import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// A Supabase client bound to the signed-in admin's own cookie session —
// used for every admin read/write, so RLS evaluates auth.jwt() as that
// real user and is_admin() is checked by the database, not by this code
// deciding to trust the request. Never use the service-role key for admin
// actions; that would make the UI the only thing enforcing who can write.
export async function createAdminSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render, where cookies can't be
          // set — fine as long as middleware or a Server Action refreshes
          // the session elsewhere.
        }
      },
    },
  });
}
