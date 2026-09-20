import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty Attractions: Filter by Distance, Price & Open Now",
  description:
    "A filterable directory of Ooty, Coonoor, Kotagiri and Masinagudi attractions — distance, category, price, time needed, and what's open right now.",
};

export default function ExplorePage() {
  return (
    <PageShell
      title="Explore"
      intro="Filterable attractions directory — each attraction also gets its own page for sharing and search."
    />
  );
}
