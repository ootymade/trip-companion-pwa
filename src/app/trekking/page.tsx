import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty & Nilgiris Trekking: Verified Routes Only",
  description:
    "Trekking routes personally verified by the OotyMade team — difficulty, permits, season and safety essentials. Nothing unverified is published.",
};

export default function TrekkingPage() {
  return (
    <PageShell
      title="Trekking"
      intro="Only routes someone from OotyMade has actually walked and verified — enforced as a data rule, not a promise."
    />
  );
}
