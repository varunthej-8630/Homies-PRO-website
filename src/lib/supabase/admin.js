import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const supabaseServiceRoleKey = rawServiceKey.trim().replace(/^['"]|['"]$/g, '');

/**
 * Privileged Admin Supabase client using Service Role Key.
 * NEVER import or execute this file in client-side / browser components!
 */
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export default supabaseAdmin;
