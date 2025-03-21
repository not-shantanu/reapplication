'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewApplication() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error('Not authenticated');

      const formData = new FormData(e.currentTarget);
      const applicationData = {
        user_id: session.user.id,
        company_name: formData.get('company_name'),
        job_title: formData.get('job_title'),
        location: formData.get('location') || null,
        salary_range: formData.get('salary_range') || null,
        status: 'Applied', // Default status
        job_description: formData.get('job_description') || null,
        application_url: formData.get('application_url') || null,
        recruiter_email: formData.get('recruiter_email') || null,
        notes: formData.get('notes') || null,
        applied_at: new Date().toISOString(),
      };

      // Validate required fields
      if (!applicationData.company_name || !applicationData.job_title) {
        setError('Company name and job title are required.');
        return;
      }

      const { error: insertError } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (insertError) {
        console.error('Error inserting application:', insertError);
        throw new Error('Failed to create application');
      }
      
      router.push('/applications');
      router.refresh();
    } catch (err) {
      console.error('Error creating application:', err);
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add New Application
          </h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="job_title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  name="job_title"
                  id="job_title"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="salary_range"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary_range"
                  id="salary_range"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="recruiter_email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Recruiter Email
                </label>
                <input
                  type="email"
                  name="recruiter_email"
                  id="recruiter_email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="application_url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Application URL
                </label>
                <input
                  type="url"
                  name="application_url"
                  id="application_url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="job_description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Job Description
              </label>
              <textarea
                name="job_description"
                id="job_description"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Application'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 