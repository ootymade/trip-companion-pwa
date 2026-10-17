import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createAdminSupabaseClient();

  const [{ count: activeCount }, { count: needsReviewCount }] = await Promise.all([
    supabase
      .from("today_status")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .not("verified_by", "is", null),
    supabase.from("translations").select("id", { count: "exact", head: true }).eq("review_status", "needs_review"),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/status" className="rounded-lg border border-border bg-surface p-4 hover:border-gold">
          <p className="text-2xl font-bold text-forest">{activeCount ?? 0}</p>
          <p className="text-sm text-foreground-muted">published status items (verified rows only)</p>
        </Link>
        <Link href="/admin/translations" className="rounded-lg border border-border bg-surface p-4 hover:border-gold">
          <p className="text-2xl font-bold text-forest">{needsReviewCount ?? 0}</p>
          <p className="text-sm text-foreground-muted">translations waiting for review</p>
        </Link>
      </div>
    </div>
  );
}
