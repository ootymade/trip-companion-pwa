import { supabase } from "@/lib/supabase";

// Shapes of the `data` jsonb column in `content_documents`, one per row id.
// These mirror exactly what was seeded into Supabase — see README for how.

export interface EPassContent {
  summary: string;
  whoNeedsIt: string[];
  whoIsExempt: string[];
  steps: string[];
  faqs: { question: string; answer: string }[];
  officialPortalUrl: string;
}

export interface ToyTrainContent {
  summary: string;
  stations: { code: string; name: string }[];
  legs: { from: string; to: string; departsApprox: string; arrivesApprox: string; durationApprox: string }[];
  bookingTips: string[];
  fareNote: string;
  irctcUrl: string;
}

export interface ConnectivityContent {
  airport: {
    code: string;
    name: string;
    routes: { label: string; distanceApprox: string; durationApprox: string; note: string }[];
  };
  railStations: { name: string; note: string }[];
  busInfo: { operators: string[]; majorOriginCities: string[]; note: string };
  ghatRoadGuide: { summary: string; tips: string[]; roadConditionUrl: string };
  localTransport: { summary: string; points: string[] };
}

export interface ShoppingContent {
  intro: string;
  items: { name: string; giTagged: boolean; description: string }[];
  disclosure: string;
  ootymadeUrl: string;
}

export interface ContentDocument<T> {
  id: string;
  data: T;
  lastVerified: string;
  sourceNote: string;
}

async function getContentDocument<T>(id: string): Promise<ContentDocument<T> | null> {
  const { data, error } = await supabase
    .from("content_documents")
    .select("id, data, last_verified, source_note")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(`Failed to load content document "${id}":`, error?.message);
    return null;
  }

  return {
    id: data.id,
    data: data.data as T,
    lastVerified: data.last_verified,
    sourceNote: data.source_note,
  };
}

export const getEPassContent = () => getContentDocument<EPassContent>("epass");
export const getToyTrainContent = () => getContentDocument<ToyTrainContent>("toy_train");
export const getConnectivityContent = () => getContentDocument<ConnectivityContent>("connectivity");
export const getShoppingContent = () => getContentDocument<ShoppingContent>("shopping");

export interface EmergencyContact {
  id: number;
  label: string;
  number: string;
  description: string;
  lastVerified: string;
  sourceNote: string;
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("id, label, number, description, sort_order, last_verified, source_note")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to load emergency contacts:", error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    label: row.label,
    number: row.number,
    description: row.description,
    lastVerified: row.last_verified,
    sourceNote: row.source_note,
  }));
}
