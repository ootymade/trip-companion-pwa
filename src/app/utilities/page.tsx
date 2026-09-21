import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { GoodToKnow } from "@/components/GoodToKnow";
import { getEmergencyContacts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ooty Emergency Numbers, Weather & Packing Checklist",
  description:
    "Emergency numbers that work offline, a packing checklist by season, and near-me quick actions for hospitals, ATMs and petrol pumps.",
};

export const revalidate = 3600;

export default async function UtilitiesPage() {
  const contacts = await getEmergencyContacts();

  return (
    <PageShell
      title="Utilities"
      intro="Emergency numbers, kept simple enough to read even on a bad connection."
    >
      <GoodToKnow
        points={[
          "112 is India's universal emergency number — it works even if you don't know the local one for the service you need.",
          "Signal is patchy on the ghat roads. Screenshot this page or save these numbers to your phone contacts before you set off.",
        ]}
      />

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-forest">Emergency numbers</h2>
        {contacts.length === 0 ? (
          <p className="mt-2 text-sm text-foreground-muted">
            We couldn&apos;t load emergency numbers right now. In any emergency, dial 112 (India&apos;s
            national emergency number).
          </p>
        ) : (
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contacts.map((contact) => (
              <a
                key={contact.id}
                href={`tel:${contact.number}`}
                className="rounded-lg border border-border bg-surface p-4 transition hover:border-gold"
              >
                <p className="font-semibold text-forest">{contact.label}</p>
                <p className="mt-1 text-lg font-bold text-forest">{contact.number}</p>
                <p className="mt-1 text-sm text-foreground-muted">{contact.description}</p>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-forest">Packing checklist</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          A season-by-season packing checklist is on our roadmap and not published yet — we&apos;d
          rather leave this section empty than guess at it.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Near me</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Live near-me lookups for hospitals, ATMs and petrol pumps aren&apos;t built yet. For now,
          search &quot;hospital near me&quot; or &quot;ATM near me&quot; directly in your maps app.
        </p>
      </section>
    </PageShell>
  );
}
