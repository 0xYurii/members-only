-- Migration script to update users table to match the desired schema
-- Run this in psql or your PostgreSQL client

-- First, backup your existing data if needed
-- CREATE TABLE users_backup AS SELECT * FROM users;

-- Add new columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS is_member BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Rename password to password_hash if needed
DO $$ 
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
        ALTER TABLE users RENAME COLUMN password TO password_hash;
    END IF;
END $$;

-- Update existing users with placeholder names and email
UPDATE users 
SET first_name = COALESCE(first_name, 'User'),
    last_name = COALESCE(last_name, username),
    email = COALESCE(email, username || '@example.com')
WHERE first_name IS NULL OR last_name IS NULL OR email IS NULL;

-- Make columns NOT NULL after populating them
ALTER TABLE users 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email if not exists
ALTER TABLE users 
ADD CONSTRAINT users_email_key UNIQUE (email);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on messages for better performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;
