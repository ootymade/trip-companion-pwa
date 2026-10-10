import { supabase } from "@/lib/supabase";
import type { Locale } from "./locales";

interface TranslatedField {
  value: string;
  isTranslated: boolean;
}

// English is the source of truth and is never stored as a "translation" —
// callers always have the English value already (it's the seeded content
// itself), so this only does a lookup for the other four locales.
//
// RLS on `translations` already hides a safety-critical row until it's
// reviewed (public SELECT requires `NOT is_safety_critical OR
// review_status = 'reviewed'`) — a missing row here means either nobody's
// translated this field yet, or they have but it's still needs_review, and
// both cases get the same honest fallback: show the English original.
export async function getTranslatedField(
  entityType: string,
  entityId: string,
  fieldName: string,
  locale: Locale,
  englishValue: string
): Promise<TranslatedField> {
  if (locale === "en") {
    return { value: englishValue, isTranslated: false };
  }

  const { data, error } = await supabase
    .from("translations")
    .select("value")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("field_name", fieldName)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) {
    return { value: englishValue, isTranslated: false };
  }

  return { value: data.value, isTranslated: true };
}
