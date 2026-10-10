import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { moduleLinks } from "@/lib/modules";
import { StatusBanner } from "@/components/StatusBanner";
import { getServerLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { NAV_KEYS } from "@/lib/i18n/navKeys";

export const metadata: Metadata = {
  title: "OotyMade Trip Companion — Real-Time Help for Ooty & the Nilgiris",
  description:
    "E-Pass steps, toy train timings, attraction hours, a trip planner and an AI concierge — no app download, opens instantly from a link or QR code.",
};

export const revalidate = 60;

// Both the hero/module grid and the status banner are static-ish (per-locale
// cookie aside) but the banner needs a live Supabase round trip. A Suspense
// boundary around just the banner lets Next.js stream the rest of the page
// immediately instead of blocking the whole response on that fetch —
// closing a real Lighthouse regression this phase introduced (dynamic
// rendering for the locale cookie meant the banner's fetch was blocking
// first byte for the entire page, not just itself).
function StatusBannerSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="h-4 w-32 animate-pulse rounded bg-border" />
      <div className="mt-2 h-12 animate-pulse rounded-lg bg-border/60" />
    </div>
  );
}

export default async function Home() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <div>
      <Suspense fallback={<StatusBannerSkeleton />}>
        <StatusBanner />
      </Suspense>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-heading text-3xl font-bold text-forest md:text-5xl">
          {dictionary.home.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground-muted">{dictionary.home.subheading}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {moduleLinks.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-lg border border-border bg-surface p-5 transition hover:border-gold hover:shadow-sm"
            >
              <h2 className="font-heading text-xl font-semibold text-forest">
                {dictionary.nav[NAV_KEYS[m.href]] ?? m.label}
              </h2>
              <p className="mt-1 text-sm text-foreground-muted">{m.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
