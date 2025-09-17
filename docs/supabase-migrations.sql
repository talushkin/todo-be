-- 17-09 updated: Enforce uniqueness for username and email on Supabase (PostgreSQL)
-- Run in Supabase SQL editor

-- Create unique indexes if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'ux_users_username'
    ) THEN
        CREATE UNIQUE INDEX ux_users_username ON users (username);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'ux_users_email'
    ) THEN
        CREATE UNIQUE INDEX ux_users_email ON users (email);
    END IF;
END $$;

-- Optional: backfill null roles and make role not null
UPDATE users SET role = 'USER' WHERE role IS NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
