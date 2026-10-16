-- ==============================================================================
-- CODERBHAI SUPABASE SCHEMA: Profiles & Student .EDU Bonus Perks
-- Run this script inside the Supabase SQL Editor:
-- Dashboard: https://supabase.com/dashboard/project/hbqipluxclqycegirqqs/sql
-- ==============================================================================

-- 1. Create the `profiles` table linked to Supabase Auth
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

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Row-Level Security Policies (Strict privacy: users manage only their own data)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 4. Automatic Trigger: Handle new user signup and award .EDU Perks automatically
-- Accounts with .edu emails receive:
--  * +200 Diamonds (Gems)
--  * 3 Days of Unlimited Hearts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_edu BOOLEAN;
  initial_gems INTEGER;
  hearts_expiry TIMESTAMPTZ;
  user_name TEXT;
BEGIN
  -- Detect educational email domains (.edu, .edu.bd, .ac.uk, etc.)
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

  user_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));

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
    user_name,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text
    ),
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
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verification Index
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
