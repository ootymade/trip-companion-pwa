import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { NewStatusForm } from "./NewStatusForm";
import { StatusList, type StatusRow } from "./StatusList";

export default async function AdminStatusPage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("today_status")
    .select("id, category, title, detail, severity, is_published, expires_at, last_verified_on, verified_by")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Today status</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Publishing here stamps the item as verified by you and makes it live on Home —
        unpublished or expired items are never shown publicly, enforced by the database.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        <NewStatusForm />
        <div>
          <p className="text-sm font-semibold text-forest">All items</p>
          <StatusList rows={(data ?? []) as StatusRow[]} />
        </div>
      </div>
    </div>
  );
}
