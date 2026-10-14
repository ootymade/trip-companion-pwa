import { supabase } from "@/lib/supabase";

// Shapes of the `data` jsonb column in `content_documents`, one per row id.
// These mirror exactly what was seeded into Supabase — see README for how.

// Shared shape for the short-and-sweet layout: at-a-glance summary, 4-6
// steps, 3-4 before-you-go tips, a CTA, 3-4 short FAQs.
export interface EPassContent {
  atAGlance: string;
  steps: string[];
  beforeYouGo: string[];
  officialPortalUrl: string;
  faqs: { question: string; answer: string }[];
}

export interface ToyTrainContent {
  atAGlance: string;
  steps: string[];
  beforeYouGo: string[];
  officialBookingUrl: string;
  stations: { code: string; name: string }[];
  faqs: { question: string; answer: string }[];
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
    .select("id, data, last_verified_on, source_note")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(`Failed to load content document "${id}":`, error?.message);
    return null;
  }

  return {
    id: data.id,
    data: data.data as T,
    lastVerified: data.last_verified_on,
    sourceNote: data.source_note,
  };
}

export const getEPassContent = () => getContentDocument<EPassContent>("epass");
export const getToyTrainContent = () => getContentDocument<ToyTrainContent>("toy_train");
export const getConnectivityContent = () => getContentDocument<ConnectivityContent>("connectivity");
export const getShoppingContent = () => getContentDocument<ShoppingContent>("shopping");

export interface ToyTrainScheduleRow {
  id: number;
  routeLabel: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  ticketClass: string;
  departsApprox: string | null;
  arrivesApprox: string | null;
  notes: string | null;
}

// RLS already restricts this to published, verified rows — see
// toy_train_schedule's policies. An empty result means the team hasn't
// entered confirmed times yet, not an error; the page shows that plainly
// rather than falling back to any guessed time.
export async function getToyTrainSchedule(): Promise<ToyTrainScheduleRow[]> {
  const { data, error } = await supabase
    .from("toy_train_schedule")
    .select("id, route_label, from_station_code, from_station_name, to_station_code, to_station_name, ticket_class, departs_approx, arrives_approx, notes")
    .order("sort_order");

  if (error || !data) {
    console.error("Failed to load toy_train_schedule:", error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    routeLabel: row.route_label,
    fromCode: row.from_station_code,
    fromName: row.from_station_name,
    toCode: row.to_station_code,
    toName: row.to_station_name,
    ticketClass: row.ticket_class,
    departsApprox: row.departs_approx,
    arrivesApprox: row.arrives_approx,
    notes: row.notes,
  }));
}

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
