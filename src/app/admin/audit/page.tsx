import { createAdminSupabaseClient } from "@/lib/supabase/server";

export default async function AdminAuditPage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("admin_audit_log")
    .select("id, actor_email, action, table_name, record_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Audit log</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Who changed what, and when — written by a database trigger, not by this page, so it
        can&apos;t be edited through the app.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-foreground-muted">
            <tr>
              <th className="py-1.5 pr-4">When</th>
              <th className="py-1.5 pr-4">Who</th>
              <th className="py-1.5 pr-4">Action</th>
              <th className="py-1.5 pr-4">Table</th>
              <th className="py-1.5">Record</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="py-1.5 pr-4 whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
                <td className="py-1.5 pr-4">{row.actor_email}</td>
                <td className="py-1.5 pr-4">{row.action}</td>
                <td className="py-1.5 pr-4">{row.table_name}</td>
                <td className="py-1.5">{row.record_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(data ?? []).length === 0 ? <p className="mt-3 text-sm text-foreground-muted">No changes logged yet.</p> : null}
      </div>
    </div>
  );
}
