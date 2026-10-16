export { supabase, supabaseClient, default } from './supabaseClient';

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
