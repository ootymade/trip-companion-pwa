import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { VerifiedNote } from "@/components/VerifiedNote";
import { getConnectivityContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Getting to Ooty: Airport, Buses, Taxis & Ghat Roads",
  description:
    "Nearest airport and rail stations, bus routes, the local taxi-union system, and a realistic (not optimistic) ghat-road travel guide.",
};

export const revalidate = 3600;

export default async function TravelPage() {
  const doc = await getConnectivityContent();

  if (!doc) {
    return (
      <PageShell
        title="Travel"
        intro="We couldn't load travel details right now. Please try again shortly."
      />
    );
  }

  const { data } = doc;

  return (
    <PageShell
      title="Travel"
      intro="Airport, rail, buses, local taxis and the ghat roads — realistic travel-time ranges, not optimistic ones."
    >
      <section>
        <h2 className="font-heading text-xl font-semibold text-forest">
          Nearest airport — {data.airport.name} ({data.airport.code})
        </h2>
        <div className="mt-2 space-y-2">
          {data.airport.routes.map((route) => (
            <div key={route.label} className="rounded-lg border border-border bg-surface p-4">
              <p className="font-semibold text-forest">{route.label}</p>
              <p className="mt-1 text-sm text-foreground-muted">
                {route.distanceApprox} · {route.durationApprox}
              </p>
              <p className="mt-1 text-sm text-foreground-muted">{route.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Rail stations</h2>
        <ul className="mt-2 space-y-1 text-foreground-muted">
          {data.railStations.map((station) => (
            <li key={station.name}>
              <span className="font-semibold text-forest">{station.name}</span> — {station.note}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Buses</h2>
        <p className="mt-2 text-foreground-muted">{data.busInfo.note}</p>
        <p className="mt-2 text-sm text-foreground-muted">
          Operators: {data.busInfo.operators.join(", ")} · From: {data.busInfo.majorOriginCities.join(", ")}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Ghat road guide</h2>
        <p className="mt-2 text-foreground-muted">{data.ghatRoadGuide.summary}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground-muted">
          {data.ghatRoadGuide.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Getting around in Ooty</h2>
        <p className="mt-2 text-foreground-muted">{data.localTransport.summary}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground-muted">
          {data.localTransport.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <VerifiedNote lastVerified={doc.lastVerified} sourceNote={doc.sourceNote} />
    </PageShell>
  );
}
