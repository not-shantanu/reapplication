import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './login-form';

/**
 * Server-side login page component
 * Handles initial authentication state and renders the login form
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; redirectTo?: string };
}) {
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies });

  // Check if user is already authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  // Extract error information from URL parameters
  const error = searchParams?.error;
  const errorMessage = searchParams?.message || getErrorMessage(error);
  const redirectTo = searchParams?.redirectTo || '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to continue to your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {/* Display error message if present */}
          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Login form component */}
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to get user-friendly error messages
 */
function getErrorMessage(error?: string): string {
  switch (error) {
    case 'no_code':
      return 'Authentication code missing. Please try again.';
    case 'auth':
      return 'Authentication failed. Please try again.';
    case 'no_session':
      return 'Unable to create session. Please try again.';
    case 'unknown':
      return 'An unexpected error occurred. Please try again.';
    default:
      return '';
  }
} 