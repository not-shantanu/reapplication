'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting Google sign in...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        setError('An error occurred during sign in. Please try again.');
        return;
      }

      console.log('Google sign in successful:', data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Job Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in with your Google account to continue
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full justify-center items-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
} 