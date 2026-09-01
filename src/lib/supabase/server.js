import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const supabaseAnonKey = rawAnonKey.trim().replace(/^['"]|['"]$/g, '');

/**
 * Creates a server-side Supabase client scoped to the incoming user request's JWT token.
 * @param {string} userJwt - Bearer JWT from the incoming request Authorization header or cookie
 */
export function createServerSupabaseClient(userJwt = null) {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };

  if (userJwt) {
    options.global = {
      headers: {
        Authorization: `Bearer ${userJwt}`,
      },
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}

export default createServerSupabaseClient;
