-- ==============================================================================
-- BYTESIZED SUPABASE SCHEMA: Instant Setup for Table Editor
-- Direct SQL Editor URL:
-- https://supabase.com/dashboard/project/hbqipluxclqycegirqqs/sql/new
-- ==============================================================================

-- 1. Create table public.users (visible in Supabase Table Editor)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  password_hash TEXT,
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

-- 2. Create table public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
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

-- 3. Enable RLS and add open policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to public.users" ON public.users;
CREATE POLICY "Allow all access to public.users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access to public.profiles" ON public.profiles;
CREATE POLICY "Allow all access to public.profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 4. Grant table permissions
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

-- 5. Trigger Function: Populate users & profiles automatically on registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_edu BOOLEAN;
  initial_gems INTEGER;
  hearts_expiry TIMESTAMPTZ;
  u_name TEXT;
  avatar TEXT;
  p_hash TEXT;
BEGIN
  is_edu := (
    LOWER(COALESCE(NEW.email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR
    LOWER(COALESCE(NEW.email, '')) LIKE '%.edu.%' OR
    LOWER(COALESCE(NEW.email, '')) LIKE '%.edu' OR
    LOWER(COALESCE(NEW.email, '')) ~ '\.ac\.[a-z]{2,}$'
  );

  IF is_edu THEN
    initial_gems := 200;
    hearts_expiry := NOW() + INTERVAL '3 days';
  ELSE
    initial_gems := 0;
    hearts_expiry := NULL;
  END IF;

  u_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(COALESCE(NEW.email, ''), '@', 1), 'ByteSized Learner');
  avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text
  );
  p_hash := COALESCE(NEW.encrypted_password, 'Secured via Supabase Auth');

  -- Insert/update public.users
  INSERT INTO public.users (
    id, username, email, password_hash, is_edu_user, xp, gems, streak, unlimited_hearts_until, course_progress, settings, created_at, updated_at
  )
  VALUES (
    NEW.id, u_name, NEW.email, p_hash, is_edu, 0, initial_gems, 0, hearts_expiry, '{}'::jsonb, '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

  -- Insert/update public.profiles
  INSERT INTO public.profiles (
    id, email, display_name, avatar_url, is_edu_user, xp, gems, streak, unlimited_hearts_until, course_progress, settings, created_at, updated_at
  )
  VALUES (
    NEW.id, NEW.email, u_name, avatar, is_edu, 0, initial_gems, 0, hearts_expiry, '{}'::jsonb, '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Backfill existing users (including the one who just signed up!)
INSERT INTO public.users (
  id, username, email, password_hash, is_edu_user, xp, gems, streak, unlimited_hearts_until, created_at, updated_at
)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'display_name', split_part(COALESCE(email, ''), '@', 1), 'ByteSized Learner'),
  email,
  COALESCE(encrypted_password, 'Secured via Supabase Auth'),
  (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$'),
  0,
  CASE WHEN (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$') THEN 200 ELSE 0 END,
  0,
  CASE WHEN (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$') THEN NOW() + INTERVAL '3 days' ELSE NULL END,
  created_at,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO public.profiles (
  id, email, display_name, avatar_url, is_edu_user, xp, gems, streak, unlimited_hearts_until, created_at, updated_at
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'display_name', split_part(COALESCE(email, ''), '@', 1), 'ByteSized Learner'),
  COALESCE(raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || id::text),
  (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$'),
  0,
  CASE WHEN (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$') THEN 200 ELSE 0 END,
  0,
  CASE WHEN (LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR LOWER(COALESCE(email, '')) LIKE '%.edu' OR LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$') THEN NOW() + INTERVAL '3 days' ELSE NULL END,
  created_at,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  updated_at = NOW();

-- 8. Refresh schema cache
NOTIFY pgrst, 'reload schema';
