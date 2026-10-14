import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { VerifiedNote } from "@/components/VerifiedNote";
import { getToyTrainContent, getToyTrainSchedule } from "@/lib/content";
import { getServerLocale } from "@/lib/i18n/getLocale";
import { getTranslatedField } from "@/lib/i18n/getTranslatedField";

export const metadata: Metadata = {
  title: "Ooty Toy Train Timings & Booking (Nilgiri Mountain Railway)",
  description:
    "Nilgiri Mountain Railway station codes, indicative schedule, and IRCTC booking tips for the Mettupalayam–Coonoor–Ooty toy train.",
};

export const revalidate = 3600;

function ToyTrainSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-full max-w-md animate-pulse rounded bg-border" />
      <div className="h-24 animate-pulse rounded-lg bg-border/60" />
    </div>
  );
}

async function ToyTrainBody() {
  const doc = await getToyTrainContent();

  if (!doc) {
    return (
      <div>
        <p className="text-foreground-muted">
          We couldn&apos;t load the toy train schedule right now. Please try again shortly, or
          book directly on IRCTC below.
        </p>
        <div className="mt-4">
          <ExternalLinkButton href="https://www.irctc.co.in">Book on IRCTC</ExternalLinkButton>
        </div>
      </div>
    );
  }

  const { data } = doc;
  const [locale, schedule] = await Promise.all([getServerLocale(), getToyTrainSchedule()]);
  const atAGlance = await getTranslatedField("content_documents", "toy_train", "atAGlance", locale, data.atAGlance);

  return (
    <div>
      {/* 1. At a glance. */}
      <p className="text-foreground-muted">{atAGlance.value}</p>

      {/* 2. Steps. */}
      <section className="mt-6">
        <h2 className="font-heading text-lg font-semibold text-forest">How to book</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-foreground-muted">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-lg font-semibold text-forest">Station codes</h2>
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
        <h2 className="font-heading text-lg font-semibold text-forest">Timetable</h2>
        {schedule.length === 0 ? (
          <p className="mt-2 rounded-md border border-border bg-surface p-3 text-sm text-foreground-muted">
            Current times aren&apos;t confirmed yet — check IRCTC directly when booking. (We
            couldn&apos;t verify a current timetable from an official source.)
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-foreground-muted">
                <tr>
                  <th className="p-2">Route</th>
                  <th className="p-2">Departs</th>
                  <th className="p-2">Arrives</th>
                  <th className="p-2">Class</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-2">
                      {row.fromCode} → {row.toCode}
                    </td>
                    <td className="p-2">{row.departsApprox}</td>
                    <td className="p-2">{row.arrivesApprox}</td>
                    <td className="p-2 capitalize">{row.ticketClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. Before you go. */}
      <section className="mt-6">
        <h2 className="font-heading text-lg font-semibold text-forest">Before you go</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-foreground-muted">
          {data.beforeYouGo.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* 4. CTA button. */}
      <div className="mt-6">
        <ExternalLinkButton href={data.officialBookingUrl}>Book on IRCTC</ExternalLinkButton>
      </div>

      {/* 5. FAQs. */}
      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-forest">FAQs</h2>
        <div className="mt-2 divide-y divide-border rounded-lg border border-border bg-surface">
          {data.faqs.map((faq) => (
            <div key={faq.question} className="p-4">
              <p className="font-semibold text-forest">{faq.question}</p>
              <p className="mt-1 text-sm text-foreground-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Last verified on. */}
      <VerifiedNote lastVerified={doc.lastVerified} sourceNote={doc.sourceNote} />
    </div>
  );
}

export default function ToyTrainPage() {
  return (
    <PageShell title="Toy Train">
      <Suspense fallback={<ToyTrainSkeleton />}>
        <ToyTrainBody />
      </Suspense>
    </PageShell>
  );
}
