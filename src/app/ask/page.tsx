import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ask OotyMade: AI Concierge for Ooty & the Nilgiris",
  description:
    "Ask real-time questions about Ooty and the Nilgiris — grounded only in OotyMade's verified data, with a one-tap handoff to WhatsApp for anything it can't answer.",
};

export default function AskPage() {
  return (
    <PageShell
      title="Ask"
      intro="Quick questions, answered from verified data only — with a handoff to WhatsApp for anything else."
    />
  );
}
