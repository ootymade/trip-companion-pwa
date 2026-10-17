import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

// The only gate that matters is RLS's is_admin() check on every table — this
// layout is a convenience redirect so a non-admin never sees a confusing
// "every button fails" screen, not the actual security boundary. Checking
// is_admin() here calls the exact same database function the RLS policies
// use, via RPC, so "logged in but not on the allow-list" is handled
// identically to how a direct API call would be handled.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/admin-login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    redirect("/admin-login?error=not-authorized");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <nav className="flex gap-4 text-sm font-medium text-forest" aria-label="Admin">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/status">Today status</Link>
          <Link href="/admin/content">Content</Link>
          <Link href="/admin/translations">Translations</Link>
          <Link href="/admin/audit">Audit log</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-foreground-muted">
          <span>{userData.user.email}</span>
          <SignOutButton />
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
