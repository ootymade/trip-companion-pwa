"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function approveTranslation(id: number) {
  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("translations")
    .update({
      review_status: "reviewed",
      reviewed_by: userData.user?.email ?? "unknown",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/translations");
}
