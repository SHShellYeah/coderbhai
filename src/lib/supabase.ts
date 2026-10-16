import { createClient } from '@supabase/supabase-js';

// Credentials for CoderBhai Supabase Project
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://hbqipluxclqycegirqqs.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6p9Pp_MMuL5PpP0eiY7r5w_6m9tjvQF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Validates if an email belongs to an educational institution (.edu).
 * Matches university emails like student@harvard.edu, user@buet.edu.bd, etc.
 */
export const isEduEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const lower = email.trim().toLowerCase();
  return (
    /\.edu(\.[a-z]{2,})?$/i.test(lower) ||
    lower.includes('.edu.') ||
    lower.endsWith('.edu') ||
    /\.ac\.[a-z]{2,}$/i.test(lower)
  );
};
