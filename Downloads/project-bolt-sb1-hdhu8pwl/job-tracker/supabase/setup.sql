BEGIN;

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS follow_up_settings CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name VARCHAR,
  phone VARCHAR,
  title VARCHAR,
  profile_completed BOOLEAN DEFAULT FALSE
);

-- Resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_path VARCHAR NOT NULL,
  file_name VARCHAR NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_current BOOLEAN DEFAULT TRUE,
  parsed_data JSONB,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR NOT NULL,
  job_title VARCHAR NOT NULL,
  recruiter_email VARCHAR NOT NULL,
  job_description TEXT,
  location VARCHAR,
  salary_range VARCHAR,
  application_url VARCHAR,
  notes TEXT,
  status VARCHAR NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  subject VARCHAR NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  is_follow_up BOOLEAN DEFAULT FALSE,
  follow_up_number INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'Draft',
  CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Follow-up settings table
CREATE TABLE follow_up_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  frequency_days INTEGER DEFAULT 7,
  max_follow_ups INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  next_follow_up_date TIMESTAMP WITH TIME ZONE,
  CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view and update own profile" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own emails" ON emails
  USING (EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = emails.application_id
    AND applications.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own follow-up settings" ON follow_up_settings
  USING (EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = follow_up_settings.application_id
    AND applications.user_id = auth.uid()
  ));

COMMIT; 