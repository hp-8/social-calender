import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCalendar } from '@/lib/openai/client';
import type { CalendarGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CalendarGenerationRequest = await request.json();
    
    if (!body.inputText || body.inputText.trim().length === 0) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    // Generate calendar using OpenAI
    const calendarData = await generateCalendar(body);

    // Save to database
    const { data: calendar, error: dbError } = await supabase
      .from('calendars')
      .insert({
        user_id: user.id,
        input_text: calendarData.inputText,
        business_type: calendarData.businessType,
        target_audience: calendarData.targetAudience,
        platforms: calendarData.platforms || [],
        content_pillars: calendarData.contentPillars,
        funnel_distribution: calendarData.funnelDistribution,
      })
      .select()
      .single();

    if (dbError || !calendar) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save calendar' }, { status: 500 });
    }

    // Save posts
    const postsToInsert = calendarData.posts.map(post => ({
      calendar_id: calendar.id,
      date: post.date,
      content: post.content,
      post_type: post.postType,
      category: post.category,
      topic: post.topic,
      goal: post.goal,
      funnel_stage: post.funnelStage,
      virality: post.virality,
      platform: post.platform,
    }));

    const { error: postsError } = await supabase
      .from('posts')
      .insert(postsToInsert);

    if (postsError) {
      console.error('Posts insert error:', postsError);
      // Continue anyway, calendar is saved
    }

    // Fetch complete calendar with posts
    const { data: completeCalendar, error: fetchError } = await supabase
      .from('calendars')
      .select(`
        *,
        posts (*)
      `)
      .eq('id', calendar.id)
      .single();

    if (fetchError || !completeCalendar) {
      return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
    }

    return NextResponse.json({ calendar: completeCalendar });
  } catch (error) {
    console.error('Error generating calendar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

