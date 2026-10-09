<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OotyMade Trip Companion — ground rules

Read `ARCHITECTURE.md` first — it has the stack, folder map, data model and
how the AI concierge actually retrieves content. The rules below are about
*how to work on this repo*, not what it contains.

**Who this is for:** a tourist on a 2–3 day trip, on a phone, often with
weak signal on ghat roads, who opens the tool with one question and wants
the answer in under 30 seconds. Every feature must solve a problem the
tourist has *right now*. If it doesn't, don't build it.

**How this fits with the other OotyMade properties — do not blur these:**
- `ootymade.com` — products and informational content.
- `tourism.ootymade.com` — a separate commercial booking site, its own repo
  (`OM-Tourism-Website-2026`), its own Neon database. Never touch it, import
  from it, or share a database with it.
- This PWA — the no-install utility and safety tool. It owns real-time
  utility. Where the tourist needs a booking, hand off by WhatsApp or
  deep-link to `tourism.ootymade.com`, never build a booking flow here.

**Rules:**
1. **Read before writing.** Inspect the existing code, conventions, and
   `ARCHITECTURE.md` before changing anything. Don't introduce a new
   framework, state library, or styling system unless explicitly asked.
2. **Never invent facts.** No fares, timings, permit rules, prices,
   closures, or safety information from general knowledge. Every factual
   row needs `last_verified`/`verified_by` (or this table's equivalent
   verification columns); a record missing either must not render
   publicly, enforced in the database (RLS) or a view — not just the UI.
   See the `trek_routes` pattern in `ARCHITECTURE.md`.
3. **Secrets stay server-side.** No API keys in client code, the repo, or
   chat. Use Supabase Edge Function secrets / Vercel env vars. If a secret
   is needed, name it and where to set it, and stop — never ask for the
   literal value to be pasted into chat.
4. **Mobile-first and low-signal-first.** Design for a 360px screen, large
   tap targets, readable in bright sunlight, usable on slow 3G. Keep the JS
   bundle lean. Anything essential (emergency numbers, saved plan, E-Pass
   steps) must work offline after the first visit.
5. **Brand:** Forest Green `#1E3A1A`, Heritage Gold `#C9A84C` (never as
   text — use `--color-gold-text`, see `globals.css`), Cream `#F5EFE0`;
   Playfair Display for headings, DM Sans for body. Warm, local, short
   sentences, practical over promotional.
6. **No scope creep.** No user reviews, no tourist accounts, no in-app
   payments, no booking engine. Build only the current phase.
7. **Finish a phase properly:** `npm run build`, `npx tsc --noEmit`,
   `npm run lint`; test the new flows; check Lighthouse; commit in small,
   well-named commits on a feature branch; summarize what changed, what to
   test by hand, what data needs verification, and any risks — then stop
   for the next phase instruction.
8. If a wrong guess would be costly or hard to undo, ask one short
   question. Otherwise pick the sensible default, say what you chose, and
   continue.
