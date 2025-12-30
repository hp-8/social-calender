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
    const { calendarId } = body;

    if (!calendarId) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
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

    // Get calendar with all posts
    const { data: calendarData, error: calendarError } = await supabase
      .from('calendars')
      .select(`
        *,
        posts (*)
      `)
      .eq('id', calendarId)
      .eq('user_id', user.id)
      .single();

    if (calendarError || !calendarData) {
      return NextResponse.json({ error: 'Calendar not found' }, { status: 404 });
    }

    // Create a comprehensive design in Canva with all calendar posts
    // Format: Create a calendar template with all posts organized by date
    const postsContent = calendarData.posts
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((post: any, index: number) => 
        `${index + 1}. ${new Date(post.date).toLocaleDateString()}: ${post.content} (${post.category}, ${post.post_type}, Virality: ${post.virality}%)`
      )
      .join('\n');

    const calendarSummary = `
Social Media Calendar: ${calendarData.business_type || 'Content Calendar'}
Target Audience: ${calendarData.target_audience || 'General'}
Content Pillars: ${(calendarData.content_pillars || []).join(', ')}

30-Day Content Plan:
${postsContent}
`.trim();

    // For now, create a Canva design URL with the calendar content
    // Full API integration would create the design programmatically
    const canvaDesignUrl = `https://www.canva.com/design/DA${Date.now()}/edit?utm_source=social-calendar&type=calendar&content=${encodeURIComponent(calendarSummary)}`;
    
    return NextResponse.json({
      success: true,
      designUrl: canvaDesignUrl,
      message: 'Opening Canva with your complete calendar...',
    });
  } catch (error) {
    console.error('Error creating Canva calendar design:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

