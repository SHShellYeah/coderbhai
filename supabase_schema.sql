-- ==============================================================================
-- BYTESIZED SUPABASE SCHEMA: Users, Profiles & Student .EDU Bonus Perks
-- Run this script inside the Supabase SQL Editor:
-- Dashboard: https://supabase.com/dashboard/project/hbqipluxclqycegirqqs/sql
-- ==============================================================================

-- 1. Create the `public.users` table for visible username, email, and password tracking
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT, -- Populated with encrypted hash from auth.users (bcrypt)
  is_edu_user BOOLEAN DEFAULT FALSE,
  xp INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  unlimited_hearts_until TIMESTAMPTZ,
  course_progress JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the `public.profiles` table (compatible with profiles-based queries)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  is_edu_user BOOLEAN DEFAULT FALSE,
  xp INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  unlimited_hearts_until TIMESTAMPTZ,
  course_progress JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for public.users
DROP POLICY IF EXISTS "Users can view own row in users table" ON public.users;
CREATE POLICY "Users can view own row in users table"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own row in users table" ON public.users;
CREATE POLICY "Users can insert own row in users table"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own row in users table" ON public.users;
CREATE POLICY "Users can update own row in users table"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- 5. RLS Policies for public.profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. Trigger Function: Populate users & profiles automatically on registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_edu BOOLEAN;
  initial_gems INTEGER;
  hearts_expiry TIMESTAMPTZ;
  u_name TEXT;
  avatar TEXT;
BEGIN
  -- Detect educational email domains (.edu, .edu.xx, .ac.xx)
  is_edu := (
    LOWER(NEW.email) ~ '\.edu(\.[a-z]{2,})?$' OR
    LOWER(NEW.email) LIKE '%.edu.%' OR
    LOWER(NEW.email) LIKE '%.edu' OR
    LOWER(NEW.email) ~ '\.ac\.[a-z]{2,}$'
  );

  IF is_edu THEN
    initial_gems := 200;
    hearts_expiry := NOW() + INTERVAL '3 days';
  ELSE
    initial_gems := 0;
    hearts_expiry := NULL;
  END IF;

  u_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
  avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text
  );

  -- Insert/update into public.users
  INSERT INTO public.users (
    id,
    username,
    email,
    password_hash,
    is_edu_user,
    xp,
    gems,
    streak,
    unlimited_hearts_until,
    course_progress,
    settings,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    u_name,
    NEW.email,
    COALESCE(NEW.encrypted_password, 'Secured via Supabase Auth'),
    is_edu,
    0,
    initial_gems,
    0,
    hearts_expiry,
    '{}'::jsonb,
    '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

  -- Insert/update into public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    is_edu_user,
    xp,
    gems,
    streak,
    unlimited_hearts_until,
    course_progress,
    settings,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    u_name,
    avatar,
    is_edu,
    0,
    initial_gems,
    0,
    hearts_expiry,
    '{}'::jsonb,
    '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. RETROACTIVE BACKFILL:
-- Immediately import any users who registered before running this script
-- (e.g. the user who just logged in!)
INSERT INTO public.users (
  id,
  username,
  email,
  password_hash,
  is_edu_user,
  xp,
  gems,
  streak,
  unlimited_hearts_until,
  created_at,
  updated_at
)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1)),
  email,
  COALESCE(encrypted_password, 'Secured via Supabase Auth'),
  (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$'),
  0,
  CASE 
    WHEN (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$') 
    THEN 200 
    ELSE 0 
  END,
  0,
  CASE 
    WHEN (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$') 
    THEN NOW() + INTERVAL '3 days' 
    ELSE NULL 
  END,
  created_at,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO public.profiles (
  id,
  email,
  display_name,
  avatar_url,
  is_edu_user,
  xp,
  gems,
  streak,
  unlimited_hearts_until,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || id::text),
  (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$'),
  0,
  CASE 
    WHEN (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$') 
    THEN 200 
    ELSE 0 
  END,
  0,
  CASE 
    WHEN (LOWER(email) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(email) LIKE '%.edu.%' OR LOWER(email) LIKE '%.edu' OR LOWER(email) ~ '\.ac\.[a-z]{2,}$') 
    THEN NOW() + INTERVAL '3 days' 
    ELSE NULL 
  END,
  created_at,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  updated_at = NOW();

-- 9. Verification Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
