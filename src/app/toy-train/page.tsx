import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Ooty Toy Train Timings & Booking (Nilgiri Mountain Railway)",
  description:
    "Nilgiri Mountain Railway station codes, indicative schedule, and IRCTC booking tips for the Mettupalayam–Coonoor–Ooty toy train.",
};

export default function ToyTrainPage() {
  return (
    <PageShell
      title="Toy Train"
      intro="Nilgiri Mountain Railway timings, station codes, and booking tips."
    />
  );
}
