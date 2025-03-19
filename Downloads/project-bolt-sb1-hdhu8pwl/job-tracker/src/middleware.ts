import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    if (session) {
      // If user is signed in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Protected routes
  if (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/applications') ||
    req.nextUrl.pathname.startsWith('/profile')
  ) {
    if (!session) {
      // If user is not signed in, redirect to login
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    return res
  }

  // Root route
  if (req.nextUrl.pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
    '/applications/:path*',
    '/profile/:path*',
  ],
} 