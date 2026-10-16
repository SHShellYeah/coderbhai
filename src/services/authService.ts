import { supabase, isEduEmail } from '../lib/supabase';
import { AuthUser, UserProfile, CourseId, CourseProgress, ThemeColor, Language } from '../types';

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
  isEduBonusGranted?: boolean;
}

/**
 * Register a new user with Supabase Auth.
 * If the user signs up with a .edu email address, they automatically receive:
 * - 200 Free Diamonds (Gems)
 * - 3 Days of Unlimited Hearts
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResponse> => {
  try {
    const isEdu = isEduEmail(email);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
          is_edu_user: isEdu,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Registration failed. Please try again.' };
    }

    const userId = authData.user.id;
    const name = displayName || email.split('@')[0];

    // Compute perks: 200 Gems and 3 days of unlimited hearts for .edu emails
    const initialGems = isEdu ? 200 : 0;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const unlimitedHeartsUntil = isEdu ? Date.now() + threeDaysMs : null;

    // Create initial records in users and profiles tables
    const userTablePayload = {
      id: userId,
      username: name,
      email,
      password_hash: 'Secured via Supabase Auth (bcrypt encrypted in auth.users)',
      is_edu_user: isEdu,
      xp: 0,
      gems: initialGems,
      streak: 0,
      unlimited_hearts_until: unlimitedHeartsUntil ? new Date(unlimitedHeartsUntil).toISOString() : null,
      course_progress: {},
      settings: {
        themeColor: 'midnight',
        darkMode: true,
        language: 'en',
      },
      updated_at: new Date().toISOString(),
    };

    const profilePayload = {
      id: userId,
      email,
      display_name: name,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
      is_edu_user: isEdu,
      xp: 0,
      gems: initialGems,
      streak: 0,
      unlimited_hearts_until: unlimitedHeartsUntil ? new Date(unlimitedHeartsUntil).toISOString() : null,
      course_progress: {},
      settings: {
        themeColor: 'midnight',
        darkMode: true,
        language: 'en',
      },
      updated_at: new Date().toISOString(),
    };

    // Attempt insert into both 'users' and 'profiles' tables
    try {
      await supabase.from('users').upsert(userTablePayload, { onConflict: 'id' });
    } catch (uErr) {
      console.warn('Users table upsert note:', uErr);
    }
    try {
      await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
    } catch (pErr) {
      console.warn('Profiles table upsert note:', pErr);
    }

    const authUser: AuthUser = {
      id: userId,
      email,
      displayName: name,
      avatarUrl: profilePayload.avatar_url,
      isEduUser: isEdu,
    };

    return {
      user: authUser,
      error: null,
      isEduBonusGranted: isEdu,
    };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'An unexpected error occurred.' };
  }
};

/**
 * Log in an existing user with Supabase Auth
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Login failed. Please check credentials.' };
    }

    const user = data.user;
    const isEdu = isEduEmail(user.email || '');

    const authUser: AuthUser = {
      id: user.id,
      email: user.email || email,
      displayName: user.user_metadata?.display_name || email.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.id)}`,
      isEduUser: isEdu,
    };

    return { user: authUser, error: null };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'Failed to sign in.' };
  }
};

/**
 * Sign out the current user
 */
export const logoutUser = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: (err as Error).message };
  }
};

/**
 * Fetch a user's cloud profile from the `users` or `profiles` table
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // 1. Try fetching from public.users first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const data = (!userError && userData) ? userData : null;

    // 2. Fallback to public.profiles if users table is not yet queried or empty
    const record = data || (
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    ).data;

    if (!record) {
      return null;
    }

    let unlimitedHeartsMs: number | null = null;
    if (record.unlimited_hearts_until) {
      const parsedMs = new Date(record.unlimited_hearts_until).getTime();
      if (!isNaN(parsedMs) && parsedMs > Date.now()) {
        unlimitedHeartsMs = parsedMs;
      }
    }

    return {
      id: record.id,
      email: record.email,
      displayName: record.username || record.display_name || (record.email ? record.email.split('@')[0] : 'ByteSized Learner'),
      avatarUrl: record.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
      isEduUser: !!record.is_edu_user,
      xp: record.xp || 0,
      gems: record.gems || 0,
      streak: record.streak || 0,
      unlimitedHeartsUntil: unlimitedHeartsMs,
      courseProgress: record.course_progress || {},
      settings: record.settings || {},
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  } catch {
    return null;
  }
};

/**
 * Save / sync local progress to the user's Supabase cloud tables (users & profiles)
 */
export const saveUserProfile = async (
  userId: string,
  profileData: Partial<{
    email: string;
    displayName: string;
    xp: number;
    gems: number;
    streak: number;
    isEduUser: boolean;
    unlimitedHeartsUntil: number | null;
    courseProgress: Record<CourseId, CourseProgress>;
    settings: {
      themeColor?: ThemeColor;
      darkMode?: boolean;
      language?: Language;
      soundEnabled?: boolean;
    };
  }>
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const basePayload: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };

    if (profileData.email) basePayload.email = profileData.email;
    if (profileData.xp !== undefined) basePayload.xp = profileData.xp;
    if (profileData.gems !== undefined) basePayload.gems = profileData.gems;
    if (profileData.streak !== undefined) basePayload.streak = profileData.streak;
    if (profileData.isEduUser !== undefined) basePayload.is_edu_user = profileData.isEduUser;
    if (profileData.courseProgress !== undefined) basePayload.course_progress = profileData.courseProgress;
    if (profileData.settings !== undefined) basePayload.settings = profileData.settings;

    if (profileData.unlimitedHeartsUntil !== undefined) {
      basePayload.unlimited_hearts_until = profileData.unlimitedHeartsUntil
        ? new Date(profileData.unlimitedHeartsUntil).toISOString()
        : null;
    }

    // 1. Upsert into public.users
    const userPayload = {
      ...basePayload,
      ...(profileData.displayName ? { username: profileData.displayName } : {}),
    };
    const { error: userError } = await supabase.from('users').upsert(userPayload, { onConflict: 'id' });

    // 2. Upsert into public.profiles
    const profilePayload = {
      ...basePayload,
      ...(profileData.displayName ? { display_name: profileData.displayName } : {}),
    };
    const { error: profileError } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });

    // If either succeeded or both failed
    if (userError && profileError) {
      return { success: false, error: userError.message || profileError.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/**
 * Get current session user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const user = session.user;
    return {
      id: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Coder',
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.id)}`,
      isEduUser: isEduEmail(user.email || ''),
    };
  } catch {
    return null;
  }
};
