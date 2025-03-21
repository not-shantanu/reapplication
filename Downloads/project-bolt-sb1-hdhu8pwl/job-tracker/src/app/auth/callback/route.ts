import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Handles the OAuth callback from Google authentication
 * This route is called by Supabase Auth after successful Google sign-in
 */
export async function GET(request: Request) {
  try {
    // Get the auth code from the callback URL
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    // If no code is present, redirect back to login with error
    if (!code) {
      console.error('No code provided in callback');
      return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
    }

    // Create a response object to store cookies
    const response = NextResponse.next();

    // Initialize Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookies().set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            cookies().set(name, '', options);
          },
        },
      }
    );

    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    // Handle authentication errors
    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError);
      return NextResponse.redirect(`${origin}/auth/login?error=auth&message=${sessionError.message}`);
    }

    // Ensure we have a valid session
    if (!session) {
      console.error('No session created');
      return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
    }

    // Verify session token is valid
    const { data: { user: sessionUser }, error: sessionUserError } = await supabase.auth.getUser(session.access_token);
    
    if (sessionUserError || !sessionUser) {
      console.error('Invalid session token:', sessionUserError);
      return NextResponse.redirect(`${origin}/auth/login?error=invalid_token`);
    }

    // Verify user exists and has valid email
    if (!sessionUser.email || !sessionUser.email.endsWith('@gmail.com')) {
      console.error('Invalid email domain - only Gmail allowed:', sessionUser.email);
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login?error=invalid_email`);
    }

    // Verify user has necessary claims/roles
    if (sessionUser.role !== 'authenticated') {
      console.error('User missing required role');
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/auth/login?error=unauthorized`);
    }

    // Double check user exists in auth system
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Failed to verify user:', userError);
      return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
    }

    // All checks passed, redirect to dashboard
    console.log('Successfully authenticated user:', user.email);
    return NextResponse.redirect(`${origin}/dashboard`);

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in callback:', error);
    return NextResponse.redirect(`${request.url.split('/auth')[0]}/auth/login?error=unknown`);
  }
} 