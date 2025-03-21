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

    // Log successful authentication
    console.log('Successfully authenticated user:', session.user.email);

    // Set the auth cookie
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Redirect to dashboard on success
      return NextResponse.redirect(`${origin}/dashboard`);
    } else {
      // If no user is found, redirect to login
      return NextResponse.redirect(`${origin}/auth/login?error=no_user`);
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in callback:', error);
    return NextResponse.redirect(`${request.url.split('/auth')[0]}/auth/login?error=unknown`);
  }
} 