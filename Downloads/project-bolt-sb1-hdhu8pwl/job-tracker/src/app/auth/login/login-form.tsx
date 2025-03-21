'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

interface LoginFormProps {
  redirectTo: string;
}

/**
 * Client-side login form component
 * Handles Google OAuth authentication flow
 */
export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Create browser client using the newer @supabase/ssr package
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /**
   * Initiates Google OAuth sign in process
   * Redirects to Google's consent screen
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign in...', { redirectTo });

      // Get the current URL's origin for the redirect
      const origin = window.location.origin;
      const callbackUrl = `${origin}/auth/callback`;

      console.log('Callback URL:', callbackUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }

      console.log('Google sign in initiated:', data);
    } catch (error) {
      console.error('Unexpected error during Google sign in:', error);
      // Error handling is done via URL parameters after redirect
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Image
          src="/google.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="h-5 w-5"
          priority
        />
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>
    </div>
  );
} 