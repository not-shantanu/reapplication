'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function NewApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    recruiter_email: '',
    job_description: '',
    location: '',
    salary_range: '',
    application_url: '',
    notes: '',
    status: 'Applied',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error: insertError } = await supabase.from('applications').insert([
        {
          ...formData,
          user_id: session.user.id,
          applied_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      router.push('/applications');
      router.refresh();
    } catch (err) {
      console.error('Error creating application:', err);
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            New Application
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Add a new job application to track
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Company Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="company_name"
                id="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Title *
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="job_title"
                id="job_title"
                required
                value={formData.job_title}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="recruiter_email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Recruiter Email *
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="recruiter_email"
                id="recruiter_email"
                required
                value={formData.recruiter_email}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Location
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="salary_range"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Salary Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="salary_range"
                id="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
                placeholder="e.g. $80,000 - $100,000"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="application_url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Application URL
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="application_url"
                id="application_url"
                value={formData.application_url}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="job_description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Job Description
            </label>
            <div className="mt-1">
              <textarea
                name="job_description"
                id="job_description"
                rows={4}
                value={formData.job_description}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <div className="mt-1">
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <div className="mt-1">
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm dark:bg-gray-800 dark:text-white"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="sm:col-span-2">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Link
            href="/applications"
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Create Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 