"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await createBrowserSupabaseClient().auth.signOut();
        router.push("/admin-login");
        router.refresh();
      }}
      className="rounded-md border border-border px-2.5 py-1 hover:border-gold"
    >
      Sign out
    </button>
  );
}
