"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

// Saving a row IS the verification step, same pattern as today_status and
// the content drafts above — an admin typing in a real IRCTC/Southern
// Railway time and hitting save is the human check last_verified_on/
// verified_by exist to record.
export async function saveScheduleRow(formData: FormData) {
  const id = Number(formData.get("id"));
  const departsApprox = String(formData.get("departsApprox") ?? "").trim();
  const arrivesApprox = String(formData.get("arrivesApprox") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("toy_train_schedule")
    .update({
      departs_approx: departsApprox || null,
      arrives_approx: arrivesApprox || null,
      notes: notes || null,
      is_published: isPublished,
      last_verified_on: new Date().toISOString(),
      verified_by: userData.user?.email ?? "unknown",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/schedule");
  revalidatePath("/toy-train");
}
