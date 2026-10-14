"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function publishDraft(draftId: number, reviewNotes: string) {
  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? "unknown";

  const { data: draft, error: fetchError } = await supabase
    .from("content_document_drafts")
    .select("content_document_id, data, sources")
    .eq("id", draftId)
    .single();

  if (fetchError || !draft) throw new Error(fetchError?.message ?? "Draft not found.");

  const sourceSummary = (draft.sources as { claim: string; source_url: string; checked_on: string }[])
    .map((s) => `${s.claim} (${s.source_url}, checked ${s.checked_on})`)
    .join(" | ");

  // Publishing is the human verification step itself: the admin reviewing
  // the sources and clicking Publish is what satisfies "every factual
  // record needs last_verified_on and verified_by" for this row — there is
  // no further approval step beyond this one person's sign-off.
  const { error: updateError } = await supabase
    .from("content_documents")
    .update({
      data: draft.data,
      source_note: sourceSummary,
      last_verified_on: new Date().toISOString(),
      verified_by: email,
    })
    .eq("id", draft.content_document_id);

  if (updateError) throw new Error(updateError.message);

  const { error: draftUpdateError } = await supabase
    .from("content_document_drafts")
    .update({ status: "approved", reviewed_by: email, reviewed_at: new Date().toISOString(), review_notes: reviewNotes })
    .eq("id", draftId);

  if (draftUpdateError) throw new Error(draftUpdateError.message);

  revalidatePath("/admin/content-drafts");
  revalidatePath("/e-pass");
  revalidatePath("/toy-train");
}

export async function rejectDraft(draftId: number, reviewNotes: string) {
  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("content_document_drafts")
    .update({
      status: "rejected",
      reviewed_by: userData.user?.email ?? "unknown",
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes,
    })
    .eq("id", draftId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/content-drafts");
}
