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

    // Create initial profile in profiles table
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

    // Attempt profile insert (fallback silently if triggered via DB function)
    try {
      await supabase.from('profiles').upsert(profilePayload, { onConflict: 'id' });
    } catch (upsertErr) {
      console.warn('Profile upsert note:', upsertErr);
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
 * Fetch a user's cloud profile from the `profiles` table
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    let unlimitedHeartsMs: number | null = null;
    if (data.unlimited_hearts_until) {
      const parsedMs = new Date(data.unlimited_hearts_until).getTime();
      if (!isNaN(parsedMs) && parsedMs > Date.now()) {
        unlimitedHeartsMs = parsedMs;
      }
    }

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      isEduUser: !!data.is_edu_user,
      xp: data.xp || 0,
      gems: data.gems || 0,
      streak: data.streak || 0,
      unlimitedHeartsUntil: unlimitedHeartsMs,
      courseProgress: data.course_progress || {},
      settings: data.settings || {},
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
};

/**
 * Save / sync local progress to the user's Supabase cloud profile
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
    const payload: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };

    if (profileData.email) payload.email = profileData.email;
    if (profileData.displayName) payload.display_name = profileData.displayName;
    if (profileData.xp !== undefined) payload.xp = profileData.xp;
    if (profileData.gems !== undefined) payload.gems = profileData.gems;
    if (profileData.streak !== undefined) payload.streak = profileData.streak;
    if (profileData.isEduUser !== undefined) payload.is_edu_user = profileData.isEduUser;
    if (profileData.courseProgress !== undefined) payload.course_progress = profileData.courseProgress;
    if (profileData.settings !== undefined) payload.settings = profileData.settings;

    if (profileData.unlimitedHeartsUntil !== undefined) {
      payload.unlimited_hearts_until = profileData.unlimitedHeartsUntil
        ? new Date(profileData.unlimitedHeartsUntil).toISOString()
        : null;
    }

    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
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
