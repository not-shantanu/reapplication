export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  phone?: string;
  title?: string;
  profile_completed: boolean;
}

export interface Resume {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
  is_current: boolean;
  parsed_data?: any;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  recruiter_email: string;
  job_description?: string;
  location?: string;
  salary_range?: string;
  application_url?: string;
  notes?: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export type ApplicationStatus = 'Applied' | 'Follow-up Sent' | 'Response Received' | 'Interview' | 'Rejected';

export interface Email {
  id: string;
  application_id: string;
  subject: string;
  body: string;
  sent_at?: string;
  is_follow_up: boolean;
  follow_up_number: number;
  status: EmailStatus;
}

export type EmailStatus = 'Draft' | 'Sent' | 'Failed';

export interface FollowUpSettings {
  id: string;
  application_id: string;
  frequency_days: number;
  max_follow_ups: number;
  is_active: boolean;
  next_follow_up_date?: string;
} 