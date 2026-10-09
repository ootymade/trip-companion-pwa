"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

// Every mutation here relies on the `today_status` RLS policies — if the
// signed-in user isn't in admin_users, the write is rejected by Postgres
// regardless of what this code intends. Creating a status item IS its own
// verification: an admin typing it in and hitting publish is the human
// check the rest of the app's data relies on last_verified_on/verified_by
// for, so we stamp both here rather than adding a separate approval step
// that would blow past the "publish in under a minute" requirement.
export async function createStatusItem(formData: FormData) {
  const supabase = await createAdminSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? "unknown";

  const expiresAtRaw = String(formData.get("expiresAt") ?? "");

  const { error } = await supabase.from("today_status").insert({
    category: String(formData.get("category")),
    title: String(formData.get("title")),
    detail: String(formData.get("detail")),
    severity: String(formData.get("severity")),
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    is_published: true,
    last_verified_on: new Date().toISOString(),
    verified_by: email,
    created_by: email,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/status");
  revalidatePath("/");
}

export async function setPublished(id: string, isPublished: boolean) {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.from("today_status").update({ is_published: isPublished }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/status");
  revalidatePath("/");
}

export async function expireNow(id: string) {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase
    .from("today_status")
    .update({ expires_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/status");
  revalidatePath("/");
}
