import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
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

    // Get post details
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError || !postData) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Verify post belongs to user's calendar
    const { data: calendar } = await supabase
      .from('calendars')
      .select('id')
      .eq('id', postData.calendar_id)
      .eq('user_id', user.id)
      .single();

    if (!calendar) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create design in Canva using Connect API
    // This is a simplified version - full implementation would use Canva's API
    const canvaDesignUrl = `https://www.canva.com/design/DA${Date.now()}/edit?utm_source=social-calendar&content=${encodeURIComponent(postData.content)}&category=${encodeURIComponent(postData.category)}&type=${encodeURIComponent(postData.post_type)}`;
    
    // For now, return a template URL that opens Canva with pre-filled content
    // Full API integration would create the design programmatically
    return NextResponse.json({
      success: true,
      designUrl: canvaDesignUrl,
      message: 'Opening Canva with your post content...',
    });
  } catch (error) {
    console.error('Error creating Canva design:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

