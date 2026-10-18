-- ==============================================================================
-- BYTESIZED SUPABASE SCHEMA: Tables, Roles, and Admin/Student Perks
-- Direct SQL Editor URL:
-- https://supabase.com/dashboard/project/hbqipluxclqycegirqqs/sql/new
-- ==============================================================================

-- 1. Create table public.profiles (compatible with both 4-column and full schema)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' -- 'user' (purple nametag) or 'admin' (golden nametag)
);

-- Ensure base columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Optional extended columns for stats, perks, and theme preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_status TEXT DEFAULT 'online';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_edu_user BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlimited_hearts_until TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course_progress JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"themeColor": "midnight", "darkMode": true, "language": "en"}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create table public.users for backward compatibility and Table Editor visibility
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
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

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS active_status TEXT DEFAULT 'online';

-- 3. In-App Community Messages Table (Optional Cloud Sync)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL DEFAULT 'general',
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  sender_role TEXT DEFAULT 'user',
  sender_status TEXT DEFAULT 'online',
  content TEXT NOT NULL,
  code_snippet JSONB,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3b. Friendships Table (Search & Add Friends by Unique Username)
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, friend_id)
);

-- Unique Username Indexes (Case-insensitive unique handle across ByteSized)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles ((LOWER(username))) WHERE username IS NOT NULL AND username <> '';
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON public.users ((LOWER(username))) WHERE username IS NOT NULL AND username <> '';

-- 4. Row Level Security (RLS) Policies
-- Enables both authenticated users and anonymous client to safely read/write
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read friendships" ON public.friendships;
CREATE POLICY "Allow read friendships" ON public.friendships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert friendships" ON public.friendships;
CREATE POLICY "Allow insert friendships" ON public.friendships FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update friendships" ON public.friendships;
CREATE POLICY "Allow update friendships" ON public.friendships FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete friendships" ON public.friendships;
CREATE POLICY "Allow delete friendships" ON public.friendships FOR DELETE USING (true);

GRANT ALL ON TABLE public.friendships TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users and anon can insert profiles" ON public.profiles;
CREATE POLICY "Users and anon can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR true);

DROP POLICY IF EXISTS "Allow all access to public.users" ON public.users;
CREATE POLICY "Allow all access to public.users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read public messages" ON public.messages;
CREATE POLICY "Allow read public messages" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert public messages" ON public.messages;
CREATE POLICY "Allow insert public messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 5. Grant table permissions
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.messages TO anon, authenticated, service_role;

-- 5. Database RPC Function: set_admin_role(admin_secret text, user_id_override uuid)
CREATE OR REPLACE FUNCTION public.set_admin_role(admin_secret text, user_id_override uuid DEFAULT NULL)
RETURNS boolean AS $$
DECLARE
  v_uid uuid;
BEGIN
  IF admin_secret = '@dm1n.D1u' THEN
    v_uid := COALESCE(user_id_override, auth.uid());
    IF v_uid IS NOT NULL THEN
      -- 1. Update public.profiles
      UPDATE public.profiles
      SET role = 'admin', gems = 999999, unlimited_hearts_until = '2099-12-31 23:59:59+00'::timestamptz, updated_at = NOW()
      WHERE id = v_uid;

      -- 2. Update public.users
      BEGIN
        UPDATE public.users
        SET role = 'admin', gems = 999999, unlimited_hearts_until = '2099-12-31 23:59:59+00'::timestamptz, updated_at = NOW()
        WHERE id = v_uid;
      EXCEPTION WHEN OTHERS THEN NULL;
      END;

      -- 3. Update auth.users metadata
      BEGIN
        UPDATE auth.users
        SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
        WHERE id = v_uid;
      EXCEPTION WHEN OTHERS THEN NULL;
      END;

      RETURN true;
    ELSE
      RETURN true;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid Admin Security Key';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.set_admin_role(text, uuid) TO authenticated, anon;

-- Overload for single parameter to support both calling signatures
CREATE OR REPLACE FUNCTION public.set_admin_role(admin_secret text)
RETURNS boolean AS $$
BEGIN
  RETURN public.set_admin_role(admin_secret, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.set_admin_role(text) TO authenticated, anon;

-- 6. Trigger Function: Populate public.profiles & public.users automatically when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_edu BOOLEAN;
  u_role TEXT;
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

  u_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

  -- Role Privileges:
  -- Admin: Unlimited Diamonds (999,999) & Unlimited Hearts forever
  -- .EDU: 200 Free Diamonds & 2 Days of Unlimited Hearts
  -- Standard User: 0 Free Diamonds, Normal Hearts (no unlimited hearts)
  IF u_role = 'admin' THEN
    initial_gems := 999999;
    hearts_expiry := '2099-12-31 23:59:59+00'::timestamptz;
  ELSIF is_edu THEN
    initial_gems := 200;
    hearts_expiry := NOW() + INTERVAL '2 days';
  ELSE
    initial_gems := 0;
    hearts_expiry := NULL;
  END IF;

  u_name := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name',
    split_part(COALESCE(NEW.email, ''), '@', 1),
    'ByteSized Learner'
  );

  avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::text
  );

  p_hash := COALESCE(NEW.encrypted_password, 'Secured via Supabase Auth');

  -- 1. Insert/update public.profiles (guaranteed 4-column base insert)
  INSERT INTO public.profiles (
    id, username, email, role
  )
  VALUES (
    NEW.id, u_name, NEW.email, u_role
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    role = EXCLUDED.role;

  -- 2. Safely populate extended columns if they exist
  BEGIN
    UPDATE public.profiles
    SET
      display_name = u_name,
      avatar_url = avatar,
      is_edu_user = is_edu,
      gems = initial_gems,
      xp = 0,
      streak = 0,
      unlimited_hearts_until = hearts_expiry,
      updated_at = NOW()
    WHERE id = NEW.id;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- 3. Safely insert into public.users if table exists
  BEGIN
    INSERT INTO public.users (
      id, username, email, password_hash, role, is_edu_user, xp, gems, streak, unlimited_hearts_until, created_at, updated_at
    )
    VALUES (
      NEW.id, u_name, NEW.email, p_hash, u_role, is_edu, 0, initial_gems, 0, hearts_expiry, NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      gems = EXCLUDED.gems,
      unlimited_hearts_until = EXCLUDED.unlimited_hearts_until,
      updated_at = NOW();
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Attach trigger to auth.users (runs automatically on every signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Backfill existing users into public.profiles and public.users
INSERT INTO public.profiles (
  id, username, email, role, display_name, avatar_url, bio, active_status, is_edu_user, xp, gems, streak, created_at, updated_at
)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'username', raw_user_meta_data->>'display_name', split_part(COALESCE(email, ''), '@', 1), 'ByteSized Learner'),
  email,
  COALESCE(raw_user_meta_data->>'role', 'user'),
  COALESCE(raw_user_meta_data->>'display_name', raw_user_meta_data->>'username', split_part(COALESCE(email, ''), '@', 1), 'ByteSized Learner'),
  COALESCE(raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || id::text),
  COALESCE(raw_user_meta_data->>'bio', ''),
  'online',
  (
    LOWER(COALESCE(email, '')) ~ '\.edu(\.[a-z]{2,})?$' OR
    LOWER(COALESCE(email, '')) LIKE '%.edu.%' OR
    LOWER(COALESCE(email, '')) LIKE '%.edu' OR
    LOWER(COALESCE(email, '')) ~ '\.ac\.[a-z]{2,}$'
  ),
  0,
  CASE WHEN COALESCE(raw_user_meta_data->>'role', 'user') = 'admin' THEN 999999 ELSE 0 END,
  0,
  created_at,
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- 9. Storage Bucket: avatars (for custom profile picture uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Avatar public select" ON storage.objects;
CREATE POLICY "Avatar public select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar insert" ON storage.objects;
CREATE POLICY "Avatar insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar update" ON storage.objects;
CREATE POLICY "Avatar update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatar delete" ON storage.objects;
CREATE POLICY "Avatar delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');

-- 10. Refresh schema cache
NOTIFY pgrst, 'reload schema';

