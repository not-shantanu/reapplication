-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);

-- Add RLS policies
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own tokens
CREATE POLICY "Users can read their own tokens"
  ON verification_tokens
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow the service role to manage all tokens
CREATE POLICY "Service role can manage all tokens"
  ON verification_tokens
  TO service_role
  USING (true)
  WITH CHECK (true); 