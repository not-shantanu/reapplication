-- Drop existing tables
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.resumes CASCADE;

-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied',
    applied_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

-- Create policies for applications table
CREATE POLICY "Users can view their own applications" 
    ON public.applications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
    ON public.applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
    ON public.applications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" 
    ON public.applications FOR DELETE 
    USING (auth.uid() = user_id);

-- Create policies for resumes table
CREATE POLICY "Users can view their own resumes" 
    ON public.resumes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" 
    ON public.resumes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
    ON public.resumes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
    ON public.resumes FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 