import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { VerifiedNote } from "@/components/VerifiedNote";
import { getToyTrainContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ooty Toy Train Timings & Booking (Nilgiri Mountain Railway)",
  description:
    "Nilgiri Mountain Railway station codes, indicative schedule, and IRCTC booking tips for the Mettupalayam–Coonoor–Ooty toy train.",
};

export const revalidate = 3600;

export default async function ToyTrainPage() {
  const doc = await getToyTrainContent();

  if (!doc) {
    return (
      <PageShell
        title="Toy Train"
        intro="We couldn't load the toy train schedule right now. Please try again shortly, or book directly on IRCTC below."
      >
        <ExternalLinkButton href="https://www.irctc.co.in">Book on IRCTC</ExternalLinkButton>
      </PageShell>
    );
  }

  const { data } = doc;

  return (
    <PageShell title="Toy Train" intro={data.summary}>
      <ExternalLinkButton href={data.irctcUrl}>Book on IRCTC</ExternalLinkButton>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-forest">Stations</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {data.stations.map((station) => (
            <li
              key={station.code}
              className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground-muted"
            >
              <span className="font-semibold text-forest">{station.code}</span> — {station.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Indicative schedule</h2>
        <div className="mt-2 space-y-2">
          {data.legs.map((leg) => (
            <div key={`${leg.from}-${leg.to}`} className="rounded-lg border border-border bg-surface p-4">
              <p className="font-semibold text-forest">
                {leg.from} → {leg.to}
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                Departs {leg.departsApprox}, arrives {leg.arrivesApprox} ({leg.durationApprox})
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-foreground-muted">{data.fareNote}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Booking tips</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground-muted">
          {data.bookingTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <VerifiedNote lastVerified={doc.lastVerified} sourceNote={doc.sourceNote} />
    </PageShell>
  );
}
