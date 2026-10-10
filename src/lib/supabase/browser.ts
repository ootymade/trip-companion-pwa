import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Only used by the admin login form, to call signInWithOtp from the
// browser. Every other admin read/write goes through the server client
// (src/lib/supabase/server.ts) inside a Server Action, never this one.
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
