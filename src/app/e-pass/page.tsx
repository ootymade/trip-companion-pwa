import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty E-Pass: How to Apply Online (Step-by-Step)",
  description:
    "Who needs the Nilgiris E-Pass, who's exempt, and the exact steps to register online before you travel — with a direct link to the official portal.",
};

export default function EPassPage() {
  return (
    <PageShell
      title="E-Pass"
      intro="Who needs it, how to apply, and the official portal — grounded in the same verified data as the AI concierge."
    />
  );
}
