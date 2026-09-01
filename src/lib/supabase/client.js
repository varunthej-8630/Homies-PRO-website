import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Clean accidental whitespace/quotes from environment inputs
const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const supabaseAnonKey = rawAnonKey.trim().replace(/^['"]|['"]$/g, '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Public Supabase client for client-side queries subject to Row Level Security (RLS).
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export default supabase;
