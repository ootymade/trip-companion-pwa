import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { ContentEditor, type ContentRow } from "./ContentEditor";

export default async function AdminContentPage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("content_documents")
    .select("id, data, source_note, last_verified_on, verified_by")
    .order("id");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Content documents</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        E-Pass, Toy Train, Travel and Eat &amp; Shop all read from these rows. Saving re-stamps
        last_verified_on/verified_by as you, right now.
      </p>
      <div className="mt-4 space-y-3">
        {(data ?? []).map((row) => (
          <ContentEditor key={row.id} row={row as ContentRow} />
        ))}
      </div>
    </div>
  );
}
