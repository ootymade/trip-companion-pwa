"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function updateContentDocument(formData: FormData) {
  const id = String(formData.get("id"));
  const rawData = String(formData.get("data"));
  const sourceNote = String(formData.get("sourceNote") ?? "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    throw new Error("The data field must be valid JSON — nothing was saved.");
  }

  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("content_documents")
    .update({
      data: parsed,
      source_note: sourceNote,
      last_verified_on: new Date().toISOString(),
      verified_by: userData.user?.email ?? "unknown",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/content");
  // Content pages read with `revalidate = 3600` ISR — refresh them too so
  // an edit shows up immediately instead of waiting up to an hour.
  revalidatePath("/e-pass");
  revalidatePath("/toy-train");
  revalidatePath("/travel");
  revalidatePath("/eat-and-shop");
}
