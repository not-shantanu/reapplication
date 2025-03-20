-- Create verification_pending table to store user details before email verification
CREATE TABLE IF NOT EXISTS verification_pending (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_pending_email ON verification_pending(email);

-- Add RLS policies
ALTER TABLE verification_pending ENABLE ROW LEVEL SECURITY;

-- Allow the service role to manage all pending verifications
CREATE POLICY "Service role can manage all pending verifications"
  ON verification_pending
  TO service_role
  USING (true)
  WITH CHECK (true); 