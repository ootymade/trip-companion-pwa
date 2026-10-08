# Architecture

This file exists so a new session (human or AI) can get oriented without
re-deriving it from scratch. Keep it in sync with reality — if a change you
make contradicts this file, update the file in the same commit.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4, deployed to
  **Vercel**.
- **Supabase** project `dttpogtbjtzaeiatvuxo` ("OotyMade Tourism App",
  region `ap-southeast-2`) — the single shared backend for this PWA, the
  paused native app, and (eventually) the WhatsApp AI Agent. **This is a
  different project and database from `tourism.ootymade.com`'s** — never
  point this app at that one.
- **Claude API**, called from a Supabase Edge Function (`ai-concierge`),
  never from the client. See "AI concierge" below.
- A hand-rolled service worker (`src/sw-template.js`, stamped per-build into
  `public/sw.js` — see "Service worker" below). **Serwist** is the
  documented upgrade path for full offline support (Phase 6); `next-pwa`
  was deliberately avoided as it lags Next's App Router support.

## Folder map

```
src/
  app/                  One folder per route (App Router). Each page.tsx
                         exports its own metadata for SEO — this is the
                         whole point of a PWA over a native app: every
                         module is a crawlable, shareable URL.
    layout.tsx           Root layout: fonts, header/footer, SW registration.
    manifest.ts           PWA manifest (Next's native file convention).
    robots.ts / sitemap.ts
  components/            Shared UI. PageShell wraps every module page;
                         VerifiedNote renders the "last verified" footer
                         that every factual page must show.
  lib/
    supabase.ts          Single anon-key client, shared by server and
                         client components. No user auth in this app.
    content.ts            Typed getters over `content_documents` and
                         `emergency_contacts`. Add a new getter here
                         (not an inline query) for each new content module.
    modules.ts            The 9-module list rendered on the home page.
public/
  sw.js                  GENERATED — gitignored. Edit src/sw-template.js.
  icons/                  Placeholder mark today; real brand assets still
                         needed before launch.
scripts/
  generate-sw.mjs         Stamps a per-deploy build id into the service
                         worker's cache name. Runs via npm's prebuild/
                         predev hooks — never invoked manually in CI.
supabase/
  functions/ai-concierge/ Edge Function source, mirrored from what's
                         deployed. Deploy changes with the Supabase MCP
                         tools (or `supabase functions deploy`), and keep
                         this copy in sync — it is not auto-synced.
```

## Data model (Supabase project `dttpogtbjtzaeiatvuxo`, schema `public`)

All four content tables have RLS **enabled**. The non-negotiable rule from
the project brief — *no factual record without `last_verified`/`verified_by`
is ever served to the public* — is enforced at the database layer, not just
in the UI:

| Table | Purpose | Verification gate |
|---|---|---|
| `content_documents` | One JSON blob per static module (`epass`, `toy_train`, `connectivity`, `shopping`) | `last_verified` (date) + `source_note` columns; RLS currently has no "is it verified" filter because every seeded row has both — add one before letting non-admins insert rows |
| `emergency_contacts` | Numbers shown on Utilities | same as above, ordered by `sort_order` |
| `attractions` | 17 rows seeded | same as above |
| `trek_routes` | 2 rows seeded, **both intentionally unverified** (`verified_by`/`verified_date` are `NULL`) | RLS policy hides any row missing `verified_by` **or** `verified_date` from the `anon` role — confirmed via the Supabase advisors check and by querying as anon: 0 rows come back today. This is the reference pattern for every other verification-gated table going forward. |
| `ai_concierge_rate_limits` | Per-IP request counter for the concierge | RLS enabled, **no policies** — only the Edge Function's service-role key can touch it; `anon`/`authenticated` get nothing |

Adding a new verification-gated table: copy the `trek_routes` RLS pattern
(policy predicate requires both verification columns to be non-null), don't
reinvent it.

## How deploys work

1. Push to `main` on `github.com/ootymade/trip-companion-pwa`.
2. Vercel's GitHub integration builds and deploys automatically (no
   `vercel.json` in the repo — configuration lives in the Vercel dashboard:
   Project Settings → Git / Build & Deployment).
3. `next.config.ts` sets `Cache-Control: no-cache, no-store, must-revalidate`
   on `/sw.js` specifically, so browsers always revalidate it — this is
   what makes the "new version available" flow (below) actually fire.
4. `scripts/generate-sw.mjs` runs via the `prebuild`/`predev` npm lifecycle
   hooks and stamps `VERCEL_GIT_COMMIT_SHA` (falling back to a timestamp
   locally) into the service worker's cache name, so every deploy gets a
   genuinely new cache that the old one is cleaned up in favor of.
5. See the "Deployment diagnosis" section of the Phase 1 summary (chat
   history / PR description) for what was actually wrong and fixed this
   round — update this file instead of relying on that staying findable.

## Service worker

`src/sw-template.js` is the source of truth; `public/sw.js` is generated
and gitignored. Strategy: cache-first for static, hashed assets
(`/_next/static/`, icons, fonts — immutable per build, so staleness isn't a
risk); network-first-falling-back-to-cache for everything else (pages,
Supabase/AI calls — content changes, and ghat-road signal is patchy, so a
stale page beats no page).

`src/components/ServiceWorkerRegistration.tsx` detects a returning visitor
(a controller already existed before this registration) whose new service
worker reaches `activated`, and shows a small "new version ready — refresh"
banner rather than silently swapping content under them — this matters
because a tourist keeps the tab open for their whole trip.

## AI concierge

`supabase/functions/ai-concierge/index.ts`, deployed as the `ai-concierge`
Edge Function (`verify_jwt: false` — called directly from the browser with
no Supabase auth session).

**Retrieval:** on every request, before calling the LLM, it queries
`content_documents`, `attractions`, `emergency_contacts`, and `trek_routes`
with the anon key (so RLS applies exactly as it does for the public site —
an unverified trek route is invisible to the concierge too) and serializes
them into a "VERIFIED CONTEXT" block. There is no vector search or
embeddings step — the dataset is small enough to pass in full on every
call. Revisit this if the dataset grows past what comfortably fits in the
model's context window.

**Grounding:** the system prompt instructs the model to answer facts only
from that context, say "I don't have a verified answer for that" plus a
WhatsApp handoff (`tourism.ootymade.com`) when it isn't covered, and never
invent a restaurant, business, or trekking recommendation.

**Provider adapter:** `callLlm()` branches on the `AI_PROVIDER` secret —
`"anthropic"` (default) or `"openai_compatible"` (any OpenAI-chat-completions-
shaped endpoint — Groq, OpenRouter, Together, etc., for testing against a
free tier before paying for Claude in production). Switching is a secrets
change, not a code change:

| Secret | Used when |
|---|---|
| `ANTHROPIC_API_KEY` | `AI_PROVIDER` unset or `"anthropic"` |
| `ANTHROPIC_MODEL` | optional override, defaults to `claude-haiku-4-5-20251001` |
| `OPENAI_COMPATIBLE_API_KEY` / `_BASE_URL` / `_MODEL` | `AI_PROVIDER=openai_compatible` |

**Abuse limits:** per-IP rate limiting (10 requests / 60s, configurable via
the constants at the top of `index.ts`) backed by the
`ai_concierge_rate_limits` table and the `check_ai_concierge_rate_limit`
Postgres function (atomic check-and-increment, service-role only — see
migration `ai_concierge_rate_limits`). Independently, the function also
caps incoming message length (1000 chars), trims chat history server-side
to the last 10 turns, and caps the LLM's own output at 512 tokens. On a
rate-limit infrastructure error it fails *open* (lets the request through)
rather than blocking a genuine tourist over our own bookkeeping bug.

**Not yet connected:** there is no `/ask` chat UI in the Next.js app yet —
`src/app/ask/page.tsx` is still a page shell (Phase 2+). The function above
is backend-only and currently reachable only by calling the Edge Function
URL directly.

## Baseline (recorded Phase 1, 2026-10-08, before further feature work)

`npm run build` (Next 16 + Turbopack): all 16 routes prerendered as static
content, no build/type/lint errors. Total `.next/static` output: **819 KB**
(592 KB of that is JS chunks).

Lighthouse (mobile preset, simulated throttling, `next start` production
build, home page `/`, this dev machine — re-run this against the real
deployed URL once Phase 1's deploy issue is fixed, numbers here are a
starting reference, not final):

| Category | Score |
|---|---|
| Performance | 93 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

FCP 2.5s, LCP 2.5s, TBT 90ms, CLS 0, Speed Index 3.0s. (Lighthouse 13 no
longer has a separate "PWA" category — installability/offline behavior
isn't scored numerically anymore; verify those manually instead.)

Compare future phases against this table in the same section, and update
it when a change meaningfully moves these numbers.
