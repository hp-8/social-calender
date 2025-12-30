import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postIds, date } = body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Post IDs are required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get user's Canva access token
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('canva_access_token')
      .eq('id', user.id)
      .single();

    if (!profile?.canva_access_token) {
      return NextResponse.json(
        { error: 'Canva not connected. Please connect your Canva account first.' },
        { status: 400 }
      );
    }

    // Get posts and verify they belong to user
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        calendars!inner(user_id)
      `)
      .in('id', postIds)
      .eq('calendars.user_id', user.id);

    if (postsError || !postsData || postsData.length === 0) {
      return NextResponse.json({ error: 'Posts not found or unauthorized' }, { status: 404 });
    }

    // Format posts for Canva design
    const postsContent = postsData
      .map((post: any, index: number) => 
        `Post ${index + 1}:\n${post.content}\n\nCategory: ${post.category}\nType: ${post.post_type}\nTopic: ${post.topic}\nFunnel Stage: ${post.funnel_stage}\nVirality: ${post.virality}%\nGoal: ${post.goal}`
      )
      .join('\n\n---\n\n');

    const daySummary = `
Social Media Content for ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

${postsContent}
`.trim();

    // Create Canva design URL with the day's content
    const canvaDesignUrl = `https://www.canva.com/design/DA${Date.now()}/edit?utm_source=social-calendar&type=day&date=${encodeURIComponent(date)}&content=${encodeURIComponent(daySummary)}`;
    
    return NextResponse.json({
      success: true,
      designUrl: canvaDesignUrl,
      message: `Opening Canva with content for ${new Date(date).toLocaleDateString()}...`,
    });
  } catch (error) {
    console.error('Error creating Canva day design:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

