-- Check if tables exist
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('verification_pending', 'verification_tokens');

-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('verification_pending', 'verification_tokens')
ORDER BY table_name, ordinal_position;

-- Check RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('verification_pending', 'verification_tokens');

-- Test inserting into verification_pending
INSERT INTO verification_pending (email, password_hash, full_name)
VALUES ('test@example.com', 'test_password', 'Test User')
RETURNING *;

-- Test inserting into verification_tokens
INSERT INTO verification_tokens (token, email, type, expires_at)
VALUES ('test_token', 'test@example.com', 'verification', NOW() + INTERVAL '24 hours')
RETURNING *;

-- Clean up test data
DELETE FROM verification_pending WHERE email = 'test@example.com';
DELETE FROM verification_tokens WHERE token = 'test_token'; 