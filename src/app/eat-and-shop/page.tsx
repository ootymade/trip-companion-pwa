import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "What to Eat & Buy in Ooty (GI-Tagged Tea, Varkey & More)",
  description:
    "Where to eat in Ooty and what's genuinely worth buying — GI-tagged Nilgiris tea, Ooty Varkey, handmade chocolate — honestly labelled, not disguised recommendations.",
};

export default function EatAndShopPage() {
  return (
    <PageShell
      title="Eat & Shop"
      intro="Restaurants and what to buy — GI-tagged products linked honestly to ootymade.com as our own."
    />
  );
}
