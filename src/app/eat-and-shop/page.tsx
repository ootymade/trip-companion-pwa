import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ExternalLinkButton } from "@/components/ExternalLinkButton";
import { VerifiedNote } from "@/components/VerifiedNote";
import { GoodToKnow } from "@/components/GoodToKnow";
import { getShoppingContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "What to Eat & Buy in Ooty (GI-Tagged Tea, Varkey & More)",
  description:
    "Where to eat in Ooty and what's genuinely worth buying — GI-tagged Nilgiris tea, Ooty Varkey, handmade chocolate — honestly labelled, not disguised recommendations.",
};

export const revalidate = 3600;

export default async function EatAndShopPage() {
  const doc = await getShoppingContent();

  if (!doc) {
    return (
      <PageShell
        title="Eat & Shop"
        intro="We couldn't load shopping details right now. Please try again shortly."
      />
    );
  }

  const { data } = doc;

  const goodToKnow = [
    "\"GI Tagged\" means Geographical Indication — a government certification that the product genuinely comes from the Nilgiris, not a marketing label.",
    "The genuine Ooty Varkey and Nilgiris tea are made locally in small batches — mass-produced lookalikes are common in tourist-strip shops.",
    "Buy eucalyptus oil from a source you trust — a diluted, less potent version is a common substitute sold to tourists.",
  ];

  return (
    <PageShell title="Eat & Shop" intro={data.intro}>
      <GoodToKnow points={goodToKnow} />

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-forest">What to buy</h2>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.items.map((item) => (
            <div key={item.name} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-forest">{item.name}</p>
                {item.giTagged ? (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-text">
                    GI Tagged
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-foreground-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-gold/40 bg-surface p-4">
        <p className="text-sm text-foreground-muted">{data.disclosure}</p>
        <div className="mt-3">
          <ExternalLinkButton href={data.ootymadeUrl}>Shop on ootymade.com</ExternalLinkButton>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-heading text-xl font-semibold text-forest">Where to eat</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Restaurant recommendations aren&apos;t published yet — we only publish places we&apos;ve
          personally verified, the same rule we apply to trekking routes. Check back soon.
        </p>
      </section>

      <VerifiedNote lastVerified={doc.lastVerified} sourceNote={doc.sourceNote} />
    </PageShell>
  );
}
