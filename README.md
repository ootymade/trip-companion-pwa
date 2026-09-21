# OotyMade Trip Companion (PWA)

An installable-if-wanted-but-not-required Progressive Web App for tourists
visiting Ooty and the Nilgiris — real-time E-Pass steps, toy train timings,
attraction hours, a trip planner and an AI concierge, opened instantly from
a link, a WhatsApp message or a QR code. Replaces the previously-planned
native mobile app (see `ootymade/ooty-tourism-app`, now paused) — this PWA
is the priority.

## Why a PWA

- **Zero install friction** — opens in any mobile browser; "Add to Home
  Screen" is offered, never required.
- **Fully crawlable** — every module is a real server-rendered page with its
  own URL and metadata, unlike a native app's content or a WhatsApp thread.
- **Shareable** — a tourist can send a companion the exact page they need.
- **One shared backend** — this PWA, the paused native app, and the
  WhatsApp AI Agent all read from the same Supabase project and (once
  deployed) the same AI concierge Edge Function.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (same project as the native app: `dttpogtbjtzaeiatvuxo`) — schema
  and seed data already deployed there, shared across both front doors
- Claude API via the same Supabase Edge Function the native app uses
  (`ai-concierge`, deployed but still needs `ANTHROPIC_API_KEY` set)
- A hand-rolled service worker (`public/sw.js`) for Phase 0 — cache-first
  for static assets, network-first for pages/API. **Serwist** is the
  documented upgrade path for full offline support in Phase 6 (Next.js's
  own docs now recommend it over `next-pwa`, which lags App Router support)
- Native Next.js file conventions for `manifest.ts`, `robots.ts`,
  `sitemap.ts` — no extra PWA plugin needed for the manifest itself

## Getting started

```bash
npm install
cp .env.example .env.local   # already filled in locally with the real
                               # project URL + anon key — safe values, RLS-protected
npm run dev
```

## Backend status

The Supabase backend is **already deployed and shared with the native
app** — done directly via the Supabase MCP tools this session, not just
written as SQL for someone to run later:

- `content_documents`, `emergency_contacts`, `attractions` (17 rows),
  `trek_routes` (2 rows, both intentionally unverified) — all created and
  seeded, RLS policies live (unverified trek routes are hidden from the
  public role at the database level, confirmed via the advisors check).
- `ai-concierge` Edge Function deployed and `ACTIVE`. It returns a
  "not configured" error until `ANTHROPIC_API_KEY` is set as a secret —
  that's the one remaining manual step (`supabase secrets set
  ANTHROPIC_API_KEY=...`), since no MCP tool manages secrets and it must
  never appear in chat or committed code.

Five modules now read real content from these tables at request time via
Server Components (`src/lib/content.ts`), with hourly ISR revalidation and a
graceful fallback message if Supabase is briefly unreachable: E-Pass, Toy
Train, Travel, Eat & Shop, and Utilities. The remaining four (Explore, Plan,
Trekking, Ask) are still page shells — see Status below.

## Deploying (not done yet)

1. Push this repo to GitHub (already done — `ootymade/trip-companion-pwa`).
2. Create a Vercel project, import this repo.
3. Add the same env vars from `.env.local` to the Vercel project settings.
4. Add a custom domain: `trip.ootymade.com` — a CNAME record at GlobeHost
   DNS pointing to Vercel, verified in Vercel's domain settings (same
   pattern used for the existing `tourism.ootymade.com` Wix subdomain).
5. Submit the sitemap (`/sitemap.xml`) to a new Search Console property for
   the subdomain once it's live.

## Status

- **Phase 0 (scaffold)** — done. Next.js + TypeScript + Tailwind v4 with
  brand tokens (Forest Green `#1E3A1A` / Heritage Gold `#C9A84C`, with a
  separate `--color-gold-text` for text use since raw gold fails WCAG AA
  as text color — same fix already made in the native app), Playfair
  Display + DM Sans fonts, PWA manifest + placeholder icons (Forest Green
  circle, "OM" mark — real brand assets still needed), a hand-rolled
  service worker, `robots.ts`/`sitemap.ts`, and page shells with real SEO
  metadata for all 9 modules plus the home page. Verified with a real
  production build (`next build` — all pages statically prerendered) and
  screenshotted in a headless browser this session.
- **Phase 1 (static content modules)** — done for E-Pass, Toy Train, Travel,
  Eat & Shop, and Utilities: each is now a Server Component querying the
  live Supabase tables (`content_documents`, `emergency_contacts`) instead
  of a static shell, with a "last verified" + source note footer and a
  graceful fallback if the query fails. Eat & Shop currently covers
  shopping only (no restaurant data seeded yet); Utilities covers emergency
  numbers only (packing checklist and near-me lookups are explicitly
  labelled as not built yet, rather than faked).
- **Phases 2–6** — not started: Explore (attractions directory + map),
  Plan (itinerary builder), Trekking (verification-gated, 0 published
  routes today), Ask (AI concierge UI), then SEO/PWA polish.

Before launch: real OotyMade logo/icon assets (current icons are a clearly
placeholder mark), and confirm `trip.ootymade.com` as the final subdomain.
