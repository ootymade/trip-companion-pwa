import type { Metadata } from "next";
import Link from "next/link";
import { moduleLinks } from "@/lib/modules";

export const metadata: Metadata = {
  title: "OotyMade Trip Companion — Real-Time Help for Ooty & the Nilgiris",
  description:
    "E-Pass steps, toy train timings, attraction hours, a trip planner and an AI concierge — no app download, opens instantly from a link or QR code.",
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-forest md:text-5xl">
        Your Ooty trip, one link.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground-muted">
        No app to download. E-Pass steps, toy train timings, real attraction hours, a trip
        planner and an AI concierge — open it, use it, share the exact page you need with
        whoever you&apos;re travelling with.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {moduleLinks.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-lg border border-border bg-surface p-5 transition hover:border-gold hover:shadow-sm"
          >
            <h2 className="font-heading text-xl font-semibold text-forest">{m.label}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{m.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
