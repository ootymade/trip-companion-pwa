import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty Emergency Numbers, Weather & Packing Checklist",
  description:
    "Emergency numbers that work offline, a packing checklist by season, and near-me quick actions for hospitals, ATMs and petrol pumps.",
};

export default function UtilitiesPage() {
  return (
    <PageShell
      title="Utilities"
      intro="Emergency numbers (always cached offline), packing checklist, and near-me quick actions."
    />
  );
}
