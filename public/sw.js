// Hand-rolled service worker (Phase 0 scope — a Serwist-based build is the
// documented upgrade path for Phase 6, see README). Two strategies:
//   - cache-first for static assets (icons, fonts, Next's hashed JS/CSS
//     chunks) — these are immutable per build, so staleness isn't a risk.
//   - network-first, falling back to cache, for page navigations and API
//     calls — content here can change (attraction hours, AI answers), but
//     the ghat roads have patchy signal, so a stale page beats no page.

const CACHE_NAME = "ootymade-trip-v1";
const STATIC_CACHE_PATTERNS = [/\/_next\/static\//, /\/icons\//, /\.(?:png|jpg|jpeg|svg|woff2?)$/];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isStatic = STATIC_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname));

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // Network-first for everything else (pages, Supabase/AI calls).
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
