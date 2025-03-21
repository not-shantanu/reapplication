import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to handle authentication and route protection
 * This runs before every applicable request (see matcher config below)
 */
export async function middleware(request: NextRequest) {
  // Initialize response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Create Supabase client with server-side cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // If we're on a callback route, don't set cookies
            if (request.nextUrl.pathname.startsWith('/auth/callback')) {
              return;
            }
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    const pathname = request.nextUrl.pathname;

    // Log the current route and session status for debugging
    console.log('Current route:', pathname);
    console.log('Session exists:', !!session);
    console.log('Session details:', session);

    // Define protected routes that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/profile') ||
                           pathname.startsWith('/applications');

    // Define auth routes that should not be accessed when logged in
    const isAuthRoute = pathname.startsWith('/auth');

    // Skip middleware for callback route
    if (pathname.startsWith('/auth/callback')) {
      return response;
    }

    if (session) {
      // User is authenticated
      if (isAuthRoute) {
        // Redirect authenticated users away from auth pages
        console.log('Redirecting authenticated user from auth page to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      // Allow access to protected routes
      return response;
    } else {
      // User is not authenticated
      if (isProtectedRoute) {
        // Redirect unauthenticated users to login
        console.log('Redirecting unauthenticated user to login');
        const loginUrl = new URL('/auth/login', request.url);
        // Preserve the intended destination
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // Allow access to public routes
      return response;
    }
  } catch (error) {
    // Log any errors for debugging
    console.error('Middleware error:', error);
    // On error, redirect to login as a safety measure
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/*)
     * - Static files (_next/static/*)
     * - Image optimization files (_next/image/*)
     * - Favicon (favicon.ico)
     * - Public directory files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 