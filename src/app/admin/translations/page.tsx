import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { ReviewList, type TranslationRow } from "./ReviewList";

export default async function AdminTranslationsPage() {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from("translations")
    .select("id, entity_type, entity_id, field_name, locale, value, is_safety_critical")
    .eq("review_status", "needs_review")
    .order("is_safety_critical", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-forest">Translations needing review</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Safety-critical rows (E-Pass rules, emergency info, trekking safety, status alerts) stay
        hidden from that language — falling back to English — until approved here. Non-critical
        rows may already be visible even unreviewed.
      </p>
      <ReviewList rows={(data ?? []) as TranslationRow[]} />
    </div>
  );
}
