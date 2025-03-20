-- Drop existing policies first
DROP POLICY IF EXISTS "Enable insert for all users" ON public.verification_pending;
DROP POLICY IF EXISTS "Enable read for service role" ON public.verification_pending;
DROP POLICY IF EXISTS "Enable delete for service role" ON public.verification_pending;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.verification_tokens;
DROP POLICY IF EXISTS "Enable read for service role" ON public.verification_tokens;
DROP POLICY IF EXISTS "Enable delete for service role" ON public.verification_tokens;

-- Create verification_pending table
CREATE TABLE IF NOT EXISTS public.verification_pending (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('verification', 'reset')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.verification_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for verification_pending
CREATE POLICY "Enable insert for all users" ON public.verification_pending
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Enable read for service role" ON public.verification_pending
    FOR SELECT TO service_role
    USING (true);

CREATE POLICY "Enable delete for service role" ON public.verification_pending
    FOR DELETE TO service_role
    USING (true);

-- Create policies for verification_tokens
CREATE POLICY "Enable insert for service role" ON public.verification_tokens
    FOR INSERT TO service_role
    WITH CHECK (true);

CREATE POLICY "Enable read for service role" ON public.verification_tokens
    FOR SELECT TO service_role
    USING (true);

CREATE POLICY "Enable delete for service role" ON public.verification_tokens
    FOR DELETE TO service_role
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_pending_email ON public.verification_pending(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON public.verification_tokens(email); 