import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { DraftReview, type DraftRow } from "./DraftReview";

export default async function AdminContentDraftsPage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("content_document_drafts")
    .select("id, content_document_id, data, sources, submitted_at")
    .eq("status", "needs_review")
    .order("submitted_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Content drafts</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Proposed content for existing pages, pending your review. Nothing here is visible to
        tourists — publishing stamps it as verified by you, right now, and copies it onto the
        live page.
      </p>
      <div className="mt-4 space-y-4">
        {(data ?? []).map((draft) => (
          <DraftReview key={draft.id} draft={draft as DraftRow} />
        ))}
        {(data ?? []).length === 0 ? (
          <p className="text-sm text-foreground-muted">No drafts waiting for review.</p>
        ) : null}
      </div>
    </div>
  );
}
