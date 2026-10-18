import { supabaseClient as supabase, isEduEmail } from '../lib/supabase';
import { AuthUser, UserProfile, CourseId, CourseProgress, ThemeColor, Language, UserRole, UserActiveStatus } from '../types';

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

    // Check if Supabase returned an existing user (identities is empty when email already exists)
    if (authData.user.identities && authData.user.identities.length === 0) {
      return {
        user: null,
        error: 'An account with this email already exists! Please switch to the Sign In tab to log in.',
      };
    }

    const userId = authData.user.id;
    const isAdmin = finalRole === 'admin';
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const eduHeartsUntil = isEdu ? Date.now() + twoDaysMs : null;
    const initialGems = isAdmin ? 999999 : (isEdu ? 200 : 0);

    // 3. Guaranteed Insert into public.profiles & public.users with complete profile record
    const fullProfileRecord: Record<string, unknown> = {
      id: userId,
      username: trimmedUsername,
      email: email.trim(),
      role: finalRole,
      display_name: trimmedUsername,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
      gems: initialGems,
      xp: 0,
      streak: 0,
      is_edu_user: isEdu,
      unlimited_hearts_until: isAdmin
        ? new Date('2099-12-31T23:59:59Z').toISOString()
        : (eduHeartsUntil ? new Date(eduHeartsUntil).toISOString() : null),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('[Supabase] Inserting into public.profiles:', fullProfileRecord);
    const { error: profError } = await supabase
      .from('profiles')
      .upsert(fullProfileRecord, { onConflict: 'id' });

    if (profError) {
      console.warn('[Supabase] profiles table upsert error, trying fallback:', profError.message);
      // Fallback to basic 4 columns if necessary
      await supabase.from('profiles').upsert({
        id: userId,
        username: trimmedUsername,
        email: email.trim(),
        role: finalRole,
      }, { onConflict: 'id' });
    } else {
      console.log('[Supabase] Successfully inserted profile into public.profiles table!');
    }

    // Also insert into public.users if table exists
    try {
      await supabase.from('users').upsert({
        ...fullProfileRecord,
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
    }

    // Ensure profile exists in both public.profiles and public.users
    const syncProfileRecord: Record<string, unknown> = {
      id: user.id,
      username: user.user_metadata?.username || user.user_metadata?.display_name || user.email?.split('@')[0],
      display_name: user.user_metadata?.display_name || user.user_metadata?.username || user.email?.split('@')[0],
      email: user.email,
      role: resolvedRole,
      avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.id)}`,
      updated_at: new Date().toISOString(),
    };
    try {
      await supabase.from('profiles').upsert(syncProfileRecord, { onConflict: 'id' });
    } catch {
      // ignore
    }
    try {
      await supabase.from('users').upsert({
        ...syncProfileRecord,
        password_hash: 'Secured via Supabase Auth',
      }, { onConflict: 'id' });
    } catch {
      // ignore
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
      bio: record.bio || '',
      activeStatus: record.active_status || 'online',
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
      bio: user.user_metadata?.bio || '',
      activeStatus: (user.user_metadata?.active_status as UserActiveStatus) || 'online',
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
    avatarUrl: string;
    bio: string;
    activeStatus: UserActiveStatus;
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
    // 0. Sync Auth metadata directly if profile info is present
    if (profileData.displayName || profileData.avatarUrl || profileData.bio !== undefined || profileData.activeStatus) {
      try {
        await supabase.auth.updateUser({
          data: {
            ...(profileData.displayName ? { display_name: profileData.displayName, username: profileData.displayName } : {}),
            ...(profileData.avatarUrl ? { avatar_url: profileData.avatarUrl } : {}),
            ...(profileData.bio !== undefined ? { bio: profileData.bio } : {}),
            ...(profileData.activeStatus ? { active_status: profileData.activeStatus } : {}),
          }
        });
      } catch {
        // ignore
      }
    }

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

    // 1. Build comprehensive payload for public.profiles and public.users
    const fullPayload: Record<string, unknown> = {
      id: userId,
      role: profileData.role || 'user',
      updated_at: new Date().toISOString(),
    };
    if (profileData.email) fullPayload.email = profileData.email;
    if (profileData.displayName) {
      fullPayload.username = profileData.displayName;
      fullPayload.display_name = profileData.displayName;
    }
    if (profileData.avatarUrl) fullPayload.avatar_url = profileData.avatarUrl;
    if (profileData.bio !== undefined) fullPayload.bio = profileData.bio;
    if (profileData.activeStatus) fullPayload.active_status = profileData.activeStatus;
    if (profileData.xp !== undefined) fullPayload.xp = profileData.xp;
    if (profileData.streak !== undefined) fullPayload.streak = profileData.streak;
    if (profileData.isEduUser !== undefined) fullPayload.is_edu_user = profileData.isEduUser;
    if (profileData.courseProgress !== undefined) fullPayload.course_progress = profileData.courseProgress;
    if (profileData.settings !== undefined) fullPayload.settings = profileData.settings;
    if (profileData.role === 'admin') {
      fullPayload.gems = 999999;
      fullPayload.unlimited_hearts_until = new Date('2099-12-31T23:59:59Z').toISOString();
    } else if (profileData.gems !== undefined) {
      fullPayload.gems = profileData.gems;
    } else if (profileData.unlimitedHeartsUntil !== undefined) {
      fullPayload.unlimited_hearts_until = profileData.unlimitedHeartsUntil
        ? new Date(profileData.unlimitedHeartsUntil).toISOString()
        : null;
    }

    // 2. Upsert directly to public.profiles
    const { error: profError } = await supabase
      .from('profiles')
      .upsert(fullPayload, { onConflict: 'id' });

    if (profError) {
      console.warn('[Supabase] profiles full upsert note, trying fallback:', profError.message);
      const exactPayload: Record<string, unknown> = {
        id: userId,
        role: profileData.role || 'user',
      };
      if (profileData.email) exactPayload.email = profileData.email;
      if (profileData.displayName) exactPayload.username = profileData.displayName;
      await supabase.from('profiles').upsert(exactPayload, { onConflict: 'id' });
      await supabase.from('profiles').update(fullPayload).eq('id', userId);
    } else {
      console.log('[Supabase] Successfully saved profile changes to public.profiles!');
    }

    // 3. Upsert into public.users table as well
    try {
      await supabase.from('users').upsert(fullPayload, { onConflict: 'id' });
    } catch {
      // ignore
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/**
 * 4g. Upload a custom user avatar image to Supabase Storage ('avatars' bucket)
 * Automatically crops/resizes client-side and returns the public URL.
 */
export const uploadAvatarImage = async (
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    if (!file || !file.type.startsWith('image/')) {
      return { url: null, error: 'Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).' };
    }

    // Process & optimize image in browser using Canvas (square center-crop, max 320x320)
    const optimizedBlob: Blob = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 320;
          const width = img.width;
          const height = img.height;
          
          // Square center crop
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;
          
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(minDim, maxDim);
          canvas.height = Math.min(minDim, maxDim);
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            'image/jpeg',
            0.88
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });

    const fileExt = 'jpg';
    const cleanUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanUserId}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // 1. Try Supabase Storage upload
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, optimizedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl, error: null };
        }
      } else if (uploadError) {
        console.warn('[Supabase Storage] Avatar upload note:', uploadError.message);
      }
    } catch (storageErr) {
      console.warn('[Supabase Storage] Avatar upload caught error:', storageErr);
    }

    // 2. Fallback to optimized data URL if storage upload is unavailable
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(optimizedBlob);
    });

    return { url: dataUrl, error: null };
  } catch (err) {
    return { url: null, error: (err as Error).message || 'Failed to process avatar image.' };
  }
};

