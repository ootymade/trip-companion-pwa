import { supabase } from "@/lib/supabase";

export type StatusCategory = "toy_train" | "ghat_road" | "attraction_closure" | "epass" | "weather_alert" | "general";
export type StatusSeverity = "info" | "caution" | "urgent";

export interface StatusItem {
  id: string;
  category: StatusCategory;
  title: string;
  detail: string;
  severity: StatusSeverity;
  lastVerifiedOn: string;
}

// RLS on today_status already drops anything unpublished, unverified, or
// outside its active (starts_at/expires_at) window — this is a plain
// select, not a second copy of that filtering logic.
export async function getActiveStatusItems(): Promise<StatusItem[]> {
  const { data, error } = await supabase
    .from("today_status")
    .select("id, category, title, detail, severity, last_verified_on")
    .order("last_verified_on", { ascending: false });

  if (error || !data) {
    console.error("Failed to load today_status:", error?.message);
    return [];
  }

  // Most urgent first — severity isn't alphabetically ordered, so sort by
  // an explicit rank rather than relying on the DB column's text order.
  const severityRank: Record<StatusSeverity, number> = { urgent: 0, caution: 1, info: 2 };
  const sorted = [...data].sort((a, b) => severityRank[a.severity as StatusSeverity] - severityRank[b.severity as StatusSeverity]);

  return sorted.map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    detail: row.detail,
    severity: row.severity,
    lastVerifiedOn: row.last_verified_on,
  }));
}
