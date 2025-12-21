import { createClient } from '@supabase/supabase-js';

// Supabase config - deze moeten in je .env bestand staan
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.warn('Supabase credentials not found. App will run without Supabase functionality.');
}

// Client-side Supabase client or Mock for development/missing auth
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  : createMockClient();

// Helper om de huidige gebruiker op te halen
export async function getCurrentUser() {
  if (!isConfigured) return null;
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.warn('Supabase auth error:', error);
    return null;
  }
  return user;
}

function createMockClient() {
  // Return a proxy that logs warnings but doesn't crash immediate execution
  return new Proxy({}, {
    get: (target, prop) => {
      // Mock common methods to prevent "cannot read property of undefined"
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: null, error: null }),
          update: () => ({ data: null, error: null }),
          delete: () => ({ data: null, error: null }),
          upload: () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        });
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: () => ({ data: null, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            list: () => ({ data: [], error: null }),
            remove: () => ({ data: [], error: null }),
          })
        };
      }
      // Return a function that does nothing for other calls
      return () => ({ data: null, error: null });
    }
  }) as any;
}
