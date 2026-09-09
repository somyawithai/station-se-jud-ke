import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://zrazruytoqgmgqzdxxwy.supabase.co';
// Fallback matches the URL fallback above: this is the public/publishable anon key
// (safe to embed — access is enforced by Supabase RLS policies, not by hiding this
// key). Without this fallback, a deploy host that doesn't inject
// VITE_SUPABASE_ANON_KEY silently disables all Supabase reads/writes with no error.
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GKizzfahdcZYymUEQIiX9A_A4SS-jk4';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance if configured.
 * Safely guards missing credentials without crashing.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[Station Se Jud Ke] Supabase is not configured — VITE_SUPABASE_ANON_KEY is missing. ' +
        'Station connections will only be saved to this browser (localStorage), not shared with other visitors. ' +
        'Create a .env file with your real Supabase project URL and anon key to enable shared data.'
      );
    }
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseAnonKey && supabaseAnonKey.trim().length > 10);
};

export const SUPABASE_PROJECT_URL = supabaseUrl;
