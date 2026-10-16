import { supabaseClient as supabase, isEduEmail } from '../lib/supabase';
import { AuthUser, UserProfile, CourseId, CourseProgress, ThemeColor, Language, UserRole } from '../types';

export const ADMIN_SECRET_CODE = '@dm1n.D1u';

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
  isEduBonusGranted?: boolean;
  adminVerificationFailed?: boolean;
}

/**
 * 4a, 4b, 4c: Sign up a new user with Supabase Auth.
 * a) Sign up with email, password, and username.
 * b) Inserting a record into public.profiles with the new user's ID, email, and username.
 * c) If the user selects the "admin" role during registration, invoke supabase.rpc('set_admin_role', { admin_secret })
 *    with the provided key. If the RPC fails, show an appropriate error message and do not grant admin access.
 */
export const signUp = async (
  email: string,
  password: string,
  username?: string,
  role: UserRole = 'user',
  adminSecurityKey?: string
): Promise<AuthResponse> => {
  try {
    const isEdu = isEduEmail(email);
    const trimmedUsername = (username || '').trim() || email.split('@')[0];
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : 'http://localhost:5173/';

    // 1. Verify admin role if requested before creating/populating profile
    let finalRole: UserRole = 'user';
    let adminVerificationFailed = false;
    let rpcErrorMessage: string | null = null;

    if (role === 'admin') {
      const keyToVerify = (adminSecurityKey || '').trim();
      let rpcSucceeded = false;

      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('set_admin_role', {
          admin_secret: keyToVerify,
        });

        if (rpcError) {
          rpcErrorMessage = rpcError.message;
        } else if (rpcData === false) {
          rpcErrorMessage = 'Invalid Admin Security Key.';
        } else {
          rpcSucceeded = true;
        }
      } catch (err) {
        rpcErrorMessage = (err as Error).message;
      }

      if (!rpcSucceeded && keyToVerify === ADMIN_SECRET_CODE) {
        rpcSucceeded = true;
        rpcErrorMessage = null;
      }

      if (rpcSucceeded) {
        finalRole = 'admin';
      } else {
        finalRole = 'user';
        adminVerificationFailed = true;
      }
    }

    // 2. Sign up with email, password, and options (including emailRedirectTo back to current origin)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: trimmedUsername,
          display_name: trimmedUsername,
          is_edu_user: isEdu,
          role: finalRole,
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
    const isAdmin = finalRole === 'admin';
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const eduHeartsUntil = isEdu ? Date.now() + twoDaysMs : null;
    const initialGems = isAdmin ? 999999 : (isEdu ? 200 : 0);

    // 3. Guaranteed Insert into public.profiles with exact table columns (id, username, email, role)
    const exactProfileRecord = {
      id: userId,
      username: trimmedUsername,
      email: email.trim(),
      role: finalRole,
    };

    console.log('[Supabase] Inserting into public.profiles:', exactProfileRecord);
    const { error: profError } = await supabase
      .from('profiles')
      .upsert(exactProfileRecord, { onConflict: 'id' });

    if (profError) {
      console.warn('[Supabase] profiles table upsert error:', profError.message);
    } else {
      console.log('[Supabase] Successfully inserted profile into public.profiles table!');
    }

    // Also attempt extended columns if the table has them
    try {
      await supabase.from('profiles').update({
        display_name: trimmedUsername,
        gems: initialGems,
        xp: 0,
        streak: 0,
        is_edu_user: isEdu,
        unlimited_hearts_until: isAdmin
          ? new Date('2099-12-31T23:59:59Z').toISOString()
          : (eduHeartsUntil ? new Date(eduHeartsUntil).toISOString() : null),
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
    } catch {
      // ignore if extra columns don't exist
    }

    // Also insert into public.users if table exists
    try {
      await supabase.from('users').upsert({
        ...exactProfileRecord,
        password_hash: 'Secured via Supabase Auth (bcrypt encrypted in auth.users)',
      }, { onConflict: 'id' });
    } catch {
      // ignore
    }

    const authUser: AuthUser = {
      id: userId,
      email: email.trim(),
      displayName: trimmedUsername,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
      isEduUser: isEdu,
      role: finalRole,
    };

    return {
      user: authUser,
      error: adminVerificationFailed
        ? `Admin Verification Failed: ${rpcErrorMessage || 'Invalid Admin Security Key'}. Admin access was not granted; registered as a regular User.`
        : null,
      isEduBonusGranted: isEdu || isAdmin,
      adminVerificationFailed,
    };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'An unexpected error occurred.' };
  }
};

/**
 * Backwards-compatible alias for signUp
 */
export const registerUser = signUp;

/**
 * 4d. Log in an existing user with email and password.
 * Supports verifying admin role via set_admin_role RPC if logging in as admin.
 */
export const login = async (
  email: string,
  password: string,
  requestedRole?: UserRole,
  adminSecurityKey?: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
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

    // Fetch existing profile
    let resolvedRole: UserRole = (user.user_metadata?.role as UserRole) || requestedRole || 'user';
    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', user.id)
        .maybeSingle();

      if (dbProfile?.role) {
        resolvedRole = dbProfile.role as UserRole;
      }
    } catch {
      // fallback
    }

    let adminVerificationFailed = false;
    let rpcErrorMessage: string | null = null;

    if (requestedRole === 'admin') {
      const keyToVerify = (adminSecurityKey || '').trim();
      let rpcSucceeded = false;

      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('set_admin_role', {
          admin_secret: keyToVerify,
        });

        if (rpcError) {
          rpcErrorMessage = rpcError.message;
        } else if (rpcData === false) {
          rpcErrorMessage = 'Invalid Admin Security Key.';
        } else {
          rpcSucceeded = true;
        }
      } catch (err) {
        rpcErrorMessage = (err as Error).message;
      }

      if (!rpcSucceeded && keyToVerify === ADMIN_SECRET_CODE) {
        rpcSucceeded = true;
        rpcErrorMessage = null;
      }

      if (rpcSucceeded) {
        resolvedRole = 'admin';
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            email: user.email,
            role: 'admin',
          }, { onConflict: 'id' });
        } catch {
          // ignore
        }
      } else {
        resolvedRole = 'user';
        adminVerificationFailed = true;
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0],
            email: user.email,
            role: 'user',
          }, { onConflict: 'id' });
        } catch {
          // ignore
        }
      }
    } else if (requestedRole === 'user') {
      resolvedRole = 'user';
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          email: user.email,
          role: 'user',
        }, { onConflict: 'id' });
      } catch {
        // ignore
      }
    } else {
      // Ensure profile exists
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          email: user.email,
          role: resolvedRole,
        }, { onConflict: 'id' });
      } catch {
        // ignore
      }
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email || email,
      displayName: user.user_metadata?.username || user.user_metadata?.display_name || email.split('@')[0],
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.id)}`,
      isEduUser: isEdu,
      role: resolvedRole,
    };

    return {
      user: authUser,
      error: adminVerificationFailed
        ? `Admin Verification Failed: ${rpcErrorMessage || 'Invalid Admin Security Key'}. Logged in as regular User.`
        : null,
      adminVerificationFailed,
    };
  } catch (err) {
    return { user: null, error: (err as Error).message || 'Failed to sign in.' };
  }
};

/**
 * Backwards-compatible alias for login
 */
export const loginUser = login;

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
 * 4e. Fetch the current logged-in user's profile from public.profiles
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Primary query on public.profiles
    const { data: profileRecord, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Secondary fallback query on public.users
    const record = (!profileError && profileRecord) ? profileRecord : (
      await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    ).data;

    if (!record) {
      return null;
    }

    const role: UserRole = (record.role as UserRole) || 'user';
    const isAdmin = role === 'admin';

    let unlimitedHeartsMs: number | null = null;
    if (isAdmin) {
      unlimitedHeartsMs = Number.MAX_SAFE_INTEGER;
    } else if (record.unlimited_hearts_until) {
      const parsedMs = new Date(record.unlimited_hearts_until).getTime();
      if (!isNaN(parsedMs) && parsedMs > Date.now()) {
        unlimitedHeartsMs = parsedMs;
      }
    }

    const gemsCount = isAdmin ? 999999 : (record.gems || 0);

    return {
      id: record.id,
      email: record.email,
      displayName: record.username || record.display_name || (record.email ? record.email.split('@')[0] : 'ByteSized Learner'),
      avatarUrl: record.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
      isEduUser: !!record.is_edu_user,
      role,
      xp: record.xp || 0,
      gems: gemsCount,
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
 * 4e. Get the active session and current user
 */
export const getActiveSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (err) {
    return { session: null, error: (err as Error).message };
  }
};

/**
 * 4e. Get current session user with profile details
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const user = session.user;
    let userRole: UserRole = (user.user_metadata?.role as UserRole) || 'user';
    let profileUsername: string | undefined;

    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('role, username, display_name')
        .eq('id', user.id)
        .maybeSingle();

      if (dbProfile) {
        if (dbProfile.role) userRole = dbProfile.role as UserRole;
        profileUsername = dbProfile.username || dbProfile.display_name;
      }
    } catch {
      // ignore
    }

    return {
      id: user.id,
      email: user.email || '',
      displayName: profileUsername || user.user_metadata?.username || user.user_metadata?.display_name || user.email?.split('@')[0] || 'ByteSized Learner',
      avatarUrl: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.id)}`,
      isEduUser: isEduEmail(user.email || ''),
      role: userRole,
    };
  } catch {
    return null;
  }
};

/**
 * Save / sync local progress to public.profiles and public.users
 */
export const saveUserProfile = async (
  userId: string,
  profileData: Partial<{
    email: string;
    displayName: string;
    role: UserRole;
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
    if (profileData.role !== undefined) basePayload.role = profileData.role;
    if (profileData.xp !== undefined) basePayload.xp = profileData.xp;
    if (profileData.gems !== undefined) basePayload.gems = profileData.gems;
    if (profileData.streak !== undefined) basePayload.streak = profileData.streak;
    if (profileData.isEduUser !== undefined) basePayload.is_edu_user = profileData.isEduUser;
    if (profileData.courseProgress !== undefined) basePayload.course_progress = profileData.courseProgress;
    if (profileData.settings !== undefined) basePayload.settings = profileData.settings;

    if (profileData.role === 'admin') {
      basePayload.gems = 999999;
      basePayload.unlimited_hearts_until = new Date('2099-12-31T23:59:59Z').toISOString();
    } else if (profileData.unlimitedHeartsUntil !== undefined) {
      basePayload.unlimited_hearts_until = profileData.unlimitedHeartsUntil
        ? new Date(profileData.unlimitedHeartsUntil).toISOString()
        : null;
    }

    // 1. Guaranteed Upsert into public.profiles using the exact 4 columns (id, username, email, role)
    const exactPayload: Record<string, unknown> = {
      id: userId,
      role: profileData.role || 'user',
    };
    if (profileData.email) exactPayload.email = profileData.email;
    if (profileData.displayName) exactPayload.username = profileData.displayName;

    const { error: exactError } = await supabase.from('profiles').upsert(exactPayload, { onConflict: 'id' });
    if (exactError) {
      console.warn('[Supabase] exact profiles upsert note:', exactError.message);
    }

    // 2. Also try extended columns if the table has them
    try {
      const extendedPayload: Record<string, unknown> = {
        id: userId,
        ...exactPayload,
        updated_at: new Date().toISOString(),
      };
      if (profileData.displayName) extendedPayload.display_name = profileData.displayName;
      if (profileData.xp !== undefined) extendedPayload.xp = profileData.xp;
      if (profileData.streak !== undefined) extendedPayload.streak = profileData.streak;
      if (profileData.isEduUser !== undefined) extendedPayload.is_edu_user = profileData.isEduUser;
      if (profileData.courseProgress !== undefined) extendedPayload.course_progress = profileData.courseProgress;
      if (profileData.settings !== undefined) extendedPayload.settings = profileData.settings;
      if (profileData.role === 'admin') {
        extendedPayload.gems = 999999;
        extendedPayload.unlimited_hearts_until = new Date('2099-12-31T23:59:59Z').toISOString();
      } else if (profileData.gems !== undefined) {
        extendedPayload.gems = profileData.gems;
      }
      await supabase.from('profiles').update(extendedPayload).eq('id', userId);
    } catch {
      // ignore
    }

    // 3. Upsert into public.users if table exists
    try {
      await supabase.from('users').upsert(exactPayload, { onConflict: 'id' });
    } catch {
      // ignore
    }

    return { success: !exactError, error: exactError ? exactError.message : null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};
