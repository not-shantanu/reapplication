-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create verification_pending table
CREATE TABLE IF NOT EXISTS verification_pending (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    verification_attempts INT DEFAULT 0
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('verification', 'reset')),
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verification_pending_email ON verification_pending(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);

-- Enable Row Level Security
ALTER TABLE verification_pending ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON verification_pending;
DROP POLICY IF EXISTS "Enable insert for all users" ON verification_pending;
DROP POLICY IF EXISTS "Enable delete for service role" ON verification_pending;
DROP POLICY IF EXISTS "Enable read access for all users" ON verification_tokens;
DROP POLICY IF EXISTS "Enable insert for service role" ON verification_tokens;
DROP POLICY IF EXISTS "Enable update for service role" ON verification_tokens;

-- Create policies for verification_pending
CREATE POLICY "Enable read access for service role" ON verification_pending
    FOR SELECT TO service_role USING (true);

CREATE POLICY "Enable insert for anonymous users" ON verification_pending
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable delete for service role" ON verification_pending
    FOR DELETE TO service_role USING (true);

-- Create policies for verification_tokens
CREATE POLICY "Enable read access for all users" ON verification_tokens
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Enable insert for service role" ON verification_tokens
    FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON verification_tokens
    FOR UPDATE TO service_role USING (true);

-- Create function to clean up expired records
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete expired pending verifications
    DELETE FROM verification_pending
    WHERE expires_at < NOW();
    
    -- Delete expired tokens
    DELETE FROM verification_tokens
    WHERE expires_at < NOW();
END;
$$;

-- Create a scheduled job to run cleanup every hour
SELECT cron.schedule(
    'cleanup-expired-verifications',
    '0 * * * *', -- Every hour
    'SELECT cleanup_expired_verifications();'
); 