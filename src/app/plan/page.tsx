import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty Trip Planner: Build a Day-by-Day Itinerary",
  description:
    "Tell us your days, party, pace and interests — get a proximity-sequenced day-by-day Ooty itinerary with timings and estimated costs, shareable as a link.",
};

export default function PlanPage() {
  return (
    <PageShell
      title="Plan"
      intro="Build a day-by-day itinerary sequenced by distance, not guesswork."
    />
  );
}
