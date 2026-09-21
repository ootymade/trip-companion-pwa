import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { VerifiedNote } from "@/components/VerifiedNote";
import { QuickSteps } from "@/components/QuickSteps";
import { GoodToKnow } from "@/components/GoodToKnow";
import { getEPassContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ooty E-Pass: How to Apply Online (Step-by-Step)",
  description:
    "Who needs the Nilgiris E-Pass, who's exempt, and the exact steps to register online before you travel — with a direct link to the official portal.",
};

export const revalidate = 3600;

export default async function EPassPage() {
  const doc = await getEPassContent();

  if (!doc) {
    return (
      <PageShell
        title="E-Pass"
        intro="We couldn't load the E-Pass details right now. Please try again shortly, or apply directly on the official portal below."
      >
        <ExternalLinkButton href="https://epass.tnega.org">Apply on epass.tnega.org</ExternalLinkButton>
      </PageShell>
    );
  }

  const { data } = doc;

  const quickSteps = [
    "Open epass.tnega.org and verify your mobile number with the OTP sent by SMS.",
    "Fill in your vehicle, passenger and travel details.",
    "Download your QR-code pass and show it at the checkpost.",
  ];

  const goodToKnow = [
    "Completely free — you only pay a separate small cash vehicle-entry fee at the checkpost.",
    "One application covers your whole car, so a family or group travelling together only needs one pass.",
    "Entries are capped per day and can fill up on weekends and holidays — apply a few days ahead if you can.",
  ];

  return (
    <PageShell title="E-Pass" intro={data.summary}>
      <ExternalLinkButton href={data.officialPortalUrl}>Apply on epass.tnega.org</ExternalLinkButton>

      <QuickSteps steps={quickSteps} />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section>
          <h2 className="font-heading text-xl font-semibold text-forest">Who needs it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground-muted">
            {data.whoNeedsIt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-forest">Who&apos;s exempt</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground-muted">
            {data.whoIsExempt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <GoodToKnow points={goodToKnow} />

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-forest">Full step-by-step guide</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-foreground-muted">
          {data.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">FAQs</h2>
        <div className="mt-2 divide-y divide-border rounded-lg border border-border bg-surface">
          {data.faqs.map((faq) => (
            <div key={faq.question} className="p-4">
              <p className="font-semibold text-forest">{faq.question}</p>
              <p className="mt-1 text-sm text-foreground-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <VerifiedNote lastVerified={doc.lastVerified} sourceNote={doc.sourceNote} />
    </PageShell>
  );
}
