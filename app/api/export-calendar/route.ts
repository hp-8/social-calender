import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateICalendar } from '@/lib/calendar/export';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const calendarId = searchParams.get('id');

    if (!calendarId) {
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    // Fetch calendar with posts
    const { data: calendar, error: fetchError } = await supabase
      .from('calendars')
      .select(`
        *,
        posts (*)
      `)
      .eq('id', calendarId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !calendar) {
      return NextResponse.json({ error: 'Calendar not found' }, { status: 404 });
    }

    // Transform to match our Calendar type
    const calendarData = {
      id: calendar.id,
      userId: calendar.user_id,
      inputText: calendar.input_text,
      businessType: calendar.business_type,
      targetAudience: calendar.target_audience,
      platforms: calendar.platforms || [],
      contentPillars: calendar.content_pillars || [],
      funnelDistribution: calendar.funnel_distribution,
      posts: calendar.posts.map((post: any) => ({
        id: post.id,
        calendarId: post.calendar_id,
        date: post.date,
        content: post.content,
        postType: post.post_type,
        category: post.category,
        topic: post.topic,
        goal: post.goal,
        funnelStage: post.funnel_stage,
        virality: post.virality,
        platform: post.platform || 'instagram',
        createdAt: post.created_at,
      })),
      createdAt: calendar.created_at,
      updatedAt: calendar.updated_at,
    };

    // Generate iCal
    const ical = generateICalendar(calendarData);

    // Return as downloadable file
    return new NextResponse(ical.toString(), {
      headers: {
        'Content-Type': 'text/calendar;charset=utf-8',
        'Content-Disposition': `attachment; filename="social-calendar-${calendarId}.ics"`,
      },
    });
  } catch (error) {
    console.error('Error exporting calendar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

