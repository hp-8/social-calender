import OpenAI from 'openai';
import type { CalendarGenerationRequest, Calendar, Post, FunnelStage, PostType, Goal, Platform } from '@/types';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const FUNNEL_DISTRIBUTIONS = {
  new: { top: 100, middle: 10, bottom: 0 },
  established: { top: 10, middle: 20, bottom: 70 },
};

const POST_TYPE_MAPPING: Record<FunnelStage, PostType[]> = {
  top: ['entertaining', 'inspiring'],
  middle: ['educational', 'connect'],
  bottom: ['promotional'],
};

const GOAL_MAPPING: Record<FunnelStage, Goal> = {
  top: 'awareness',
  middle: 'nurturing',
  bottom: 'converting',
};

// Model fallback list - tries from most capable to most cost-effective
// Can be overridden via OPENAI_MODELS environment variable (comma-separated)
const getModelFallbacks = (): readonly string[] => {
  const envModels = process.env.OPENAI_MODELS;
  if (envModels) {
    return envModels.split(',').map(m => m.trim()) as readonly string[];
  }
  
  // Default fallback order - only models that are verified to work
  return [
    'gpt-4-turbo',      // High quality, supports JSON mode (verified working)
    'gpt-4o-mini',      // Cost-effective, supports JSON mode
    'gpt-3.5-turbo',    // Cheapest fallback (handled without JSON mode)
  ] as const;
};

const PLATFORM_GUIDELINES: Record<Platform, string> = {
  whatsapp: 'WhatsApp: Focus on personal, conversational content. Use text-based updates, status updates, and direct messaging strategies. Keep content concise and engaging for personal connections.',
  instagram: 'Instagram: Visual-first platform. Focus on high-quality images, Stories, Reels, and carousel posts. Use hashtags strategically. Content should be visually appealing and shareable.',
  facebook: 'Facebook: Community-focused content. Mix of text posts, images, videos, and live content. Focus on building community engagement, discussions, and sharing valuable information.',
  linkedin: 'LinkedIn: Professional and thought leadership content. Focus on industry insights, professional tips, company updates, and networking. Maintain professional tone while being engaging.',
  x: 'X (Twitter): Concise, timely, and engaging content. Focus on trending topics, quick insights, threads for longer content, and real-time engagement. Use hashtags and mentions strategically.',
};

export async function generateCalendar(request: CalendarGenerationRequest): Promise<Omit<Calendar, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> {
  const funnelDist = FUNNEL_DISTRIBUTIONS[request.accountMaturity || 'new'];
  const platforms = request.platforms || ['instagram'];
  
  // Get today's date and generate dates for next 30 days
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  }

  const platformGuidelines = platforms.map(p => PLATFORM_GUIDELINES[p]).join('\n');
  
  const prompt = `You are a social media content strategist. Based on the following business information, create a comprehensive 30-day social media content calendar for the selected platforms.

Selected Platforms:
${platforms.map(p => `- ${p.charAt(0).toUpperCase() + p.slice(1)}`).join('\n')}

Platform-Specific Guidelines:
${platformGuidelines}

Business Information:
${request.inputText}
${request.businessType ? `Business Type: ${request.businessType}` : ''}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}

IMPORTANT: Today's date is ${today.toISOString().split('T')[0]}. You must create posts for the next 30 days starting from today.

Requirements:
1. Identify 3-7 content pillars/categories that align with this business
2. Create 30 days of content ideas (one post per day) - EXACTLY 30 posts, one for each date
3. Distribute posts according to funnel stages:
   - Top Funnel (Awareness): ${funnelDist.top}% - Entertaining/inspiring content
   - Middle Funnel (Nurturing): ${funnelDist.middle}% - Educational/connect content
   - Bottom Funnel (Converting): ${funnelDist.bottom}% - Promotional content

4. For each post, provide:
   - Date (MUST use one of these exact dates: ${dates.join(', ')})
   - Platform (one of: ${platforms.join(', ')})
   - Content description/idea (detailed, actionable, specific, tailored to the selected platform's best practices)
   - Post type (entertaining, inspiring, educational, connect, or promotional)
   - Category/pillar it belongs to
   - Topic within that category
   - Funnel stage (top, middle, or bottom)
   - Virality potential (0-100%, based on shareability and engagement potential for that specific platform)

IMPORTANT: Distribute posts across all selected platforms evenly. Each platform should have approximately ${Math.floor(30 / platforms.length)} posts. Make sure content is optimized for each platform's unique characteristics and audience behavior.

Return a JSON object with this structure:
{
  "businessType": "extracted business type",
  "targetAudience": "extracted target audience",
  "contentPillars": ["pillar1", "pillar2", ...],
  "funnelDistribution": {
    "top": ${funnelDist.top},
    "middle": ${funnelDist.middle},
    "bottom": ${funnelDist.bottom}
  },
  "posts": [
    {
      "date": "YYYY-MM-DD",
      "platform": "${platforms.join('|')}",
      "content": "detailed post idea/description optimized for the selected platform",
      "postType": "entertaining|inspiring|educational|connect|promotional",
      "category": "pillar name",
      "topic": "specific topic within category",
      "goal": "awareness|nurturing|converting",
      "funnelStage": "top|middle|bottom",
      "virality": 0-100
    },
    ... (30 posts total)
  ]
}

Ensure the distribution matches the funnel percentages exactly.`;

  let lastError: Error | null = null;
  const MODEL_FALLBACKS = getModelFallbacks();
  
  // Try each model in the fallback list
  for (const model of MODEL_FALLBACKS) {
    try {
      const openai = getOpenAIClient();
      
      // gpt-3.5-turbo doesn't support json_object response_format, so handle differently
      const useJsonMode = model !== 'gpt-3.5-turbo';
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: useJsonMode
              ? 'You are an expert social media content strategist. Always return valid JSON. Your response must be a valid JSON object only, no additional text.'
              : 'You are an expert social media content strategist. Return ONLY valid JSON, no markdown, no code blocks, just the raw JSON object.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        ...(useJsonMode ? { response_format: { type: 'json_object' } } : {}),
        temperature: 0.8,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      // For gpt-3.5-turbo, we might need to extract JSON from markdown code blocks
      let jsonText = responseText.trim();
      if (!useJsonMode) {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
        // Remove any leading/trailing whitespace or markdown
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      }

      const parsed = JSON.parse(jsonText);
    
    // Validate and ensure we have exactly 30 posts
    if (!parsed.posts || parsed.posts.length !== 30) {
      throw new Error(`Invalid number of posts generated: ${parsed.posts?.length || 0}. Expected exactly 30.`);
    }

      // Generate dates starting from today if not provided correctly
      const today = new Date();
      const generatedDates: string[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        generatedDates.push(date.toISOString().split('T')[0]);
      }

      // Generate IDs for posts and ensure dates are correct
      const posts: Post[] = parsed.posts.map((post: any, index: number) => {
        // Use generated date if post date is invalid or missing
        let postDate = post.date;
        if (!postDate || !/^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
          postDate = generatedDates[index];
        }
        
        // Validate platform
        const postPlatform = post.platform && platforms.includes(post.platform) 
          ? post.platform 
          : platforms[index % platforms.length]; // Distribute evenly if invalid
        
        return {
          id: `post-${Date.now()}-${index}`,
          calendarId: '', // Will be set when saved
          date: postDate,
          content: post.content || `Post idea for ${postDate}`,
          postType: post.postType || 'educational',
          category: post.category || 'General',
          topic: post.topic || 'Content',
          goal: post.goal || 'awareness',
          funnelStage: post.funnelStage || 'top',
          virality: Math.max(0, Math.min(100, post.virality || 50)),
          platform: postPlatform as Platform,
        };
      });

      console.log(`Successfully generated calendar using model: ${model}`);
      
      return {
        inputText: request.inputText,
        businessType: parsed.businessType || request.businessType,
        targetAudience: parsed.targetAudience || request.targetAudience,
        platforms: platforms,
        contentPillars: parsed.contentPillars || [],
        funnelDistribution: parsed.funnelDistribution || funnelDist,
        posts,
      };
    } catch (error) {
      // Log the error but continue to next model
      console.warn(`Model ${model} failed:`, error instanceof Error ? error.message : error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If this is the last model, throw the error
      if (model === MODEL_FALLBACKS[MODEL_FALLBACKS.length - 1]) {
        console.error('All models failed. Last error:', lastError);
        throw new Error(
          `Failed to generate calendar after trying all available models. ${lastError.message}. Please check your OpenAI API key and try again.`
        );
      }
      
      // Continue to next model
      continue;
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw new Error('Failed to generate calendar. Please try again.');
}

