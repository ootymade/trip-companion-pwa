import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { VerifiedNote } from "@/components/VerifiedNote";
import { getEPassContent } from "@/lib/content";
import { getServerLocale } from "@/lib/i18n/getLocale";
import { getTranslatedField } from "@/lib/i18n/getTranslatedField";

export const metadata: Metadata = {
  title: "Ooty E-Pass: How to Apply Online (Step-by-Step)",
  description:
    "Who needs the Nilgiris E-Pass, who's exempt, and the exact steps to register online before you travel — with a direct link to the official portal.",
};

export const revalidate = 3600;

function EPassSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-full max-w-md animate-pulse rounded bg-border" />
      <div className="h-24 animate-pulse rounded-lg bg-border/60" />
    </div>
  );
}

// The title renders immediately; everything that needs the Supabase fetch
// (including the "at a glance" intro, which used to block the whole page
// via PageShell's intro prop) streams in through this boundary instead —
// the fetch no longer holds up first byte for the page shell.
async function EPassBody() {
  const doc = await getEPassContent();

  if (!doc) {
    // Covers both a genuine fetch error and a row that's been reset to
    // unverified (verified_by/last_verified_on null) pending re-review in
    // /admin — either way, there's no confirmed content to show, so the
    // honest, calm message is the same rather than implying a transient
    // glitch worth retrying.
    return (
      <div>
        <p className="text-foreground-muted">
          This page is being updated. Please check epass.tnega.org directly for now.
        </p>
        <div className="mt-4">
          <ExternalLinkButton href="https://epass.tnega.org">Apply on epass.tnega.org</ExternalLinkButton>
        </div>
      </div>
    );
  }

  const { data } = doc;
  const locale = await getServerLocale();
  const atAGlance = await getTranslatedField("content_documents", "epass", "atAGlance", locale, data.atAGlance);

  return (
    <div>
      {/* 1. At a glance. */}
      <p className="text-foreground-muted">{atAGlance.value}</p>
      {locale !== "en" && !atAGlance.isTranslated ? (
        <p className="mt-3 rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-gold-text">
          Shown in English — the translation for this safety information hasn&apos;t been
          reviewed yet.
        </p>
      ) : null}

      {/* 2. Steps. */}
      <section className="mt-6">
        <h2 className="font-heading text-lg font-semibold text-forest">How to apply</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-foreground-muted">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
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
        <ExternalLinkButton href={data.officialPortalUrl}>Apply on epass.tnega.org</ExternalLinkButton>
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

export default function EPassPage() {
  return (
    <PageShell title="E-Pass">
      <Suspense fallback={<EPassSkeleton />}>
        <EPassBody />
      </Suspense>
    </PageShell>
  );
}
