'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const applicationSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  recruiter_email: z.string().email('Invalid email address'),
  job_description: z.string().min(1, 'Job description is required'),
  location: z.string().optional(),
  salary_range: z.string().optional(),
  application_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export default function NewApplication() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      const { error } = await supabase.from('applications').insert([
        {
          ...data,
          user_id: session.user.id,
          status: 'Applied',
        },
      ])

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating application:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        New Application
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="company_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Company Name
          </label>
          <input
            type="text"
            id="company_name"
            {...register('company_name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="job_title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Job Title
          </label>
          <input
            type="text"
            id="job_title"
            {...register('job_title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.job_title && (
            <p className="mt-1 text-sm text-red-600">{errors.job_title.message}</p>
          )}
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
            id="recruiter_email"
            {...register('recruiter_email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.recruiter_email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.recruiter_email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="job_description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Job Description
          </label>
          <textarea
            id="job_description"
            rows={4}
            {...register('job_description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.job_description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.job_description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="salary_range"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Salary Range (Optional)
          </label>
          <input
            type="text"
            id="salary_range"
            {...register('salary_range')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="application_url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Application URL (Optional)
          </label>
          <input
            type="url"
            id="application_url"
            {...register('application_url')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.application_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.application_url.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register('notes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Application'}
          </button>
        </div>
      </form>
    </div>
  )
} 