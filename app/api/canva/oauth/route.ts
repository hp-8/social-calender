import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { exchangeCanvaCode } from '@/lib/canva/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL(`/dashboard?canva_error=${error}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?canva_error=no_code', request.url));
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/canva/oauth`;
    
    try {
      const accessToken = await exchangeCanvaCode(code, redirectUri);
      
      // Store access token in user's profile or a separate table
      // For now, we'll store it in user_profiles
      await supabase
        .from('user_profiles')
        .update({
          canva_access_token: accessToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      return NextResponse.redirect(new URL('/dashboard?canva_connected=true', request.url));
    } catch (error) {
      console.error('Canva OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard?canva_error=token_exchange_failed', request.url));
    }
  } catch (error) {
    console.error('Canva OAuth route error:', error);
    return NextResponse.redirect(new URL('/dashboard?canva_error=unknown', request.url));
  }
}

