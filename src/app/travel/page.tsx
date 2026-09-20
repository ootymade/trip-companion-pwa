import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Getting to Ooty: Airport, Buses, Taxis & Ghat Roads",
  description:
    "Nearest airport and rail stations, bus routes, the local taxi-union system, and a realistic (not optimistic) ghat-road travel guide.",
};

export default function TravelPage() {
  return (
    <PageShell
      title="Travel"
      intro="Airport, rail, buses, local taxis and the ghat roads — realistic travel-time ranges, not optimistic ones."
    />
  );
}
