export interface ModuleLink {
  href: string;
  label: string;
  description: string;
}

// One entry per content module (A–I from the brief), each its own indexable
// route — this is the whole point of the PWA over a native app or a chat
// thread: every one of these is a URL Google can crawl and a tourist can
// share directly.
export const moduleLinks: ModuleLink[] = [
  { href: "/e-pass", label: "E-Pass", description: "Who needs it, how to apply, official portal" },
  { href: "/toy-train", label: "Toy Train", description: "Nilgiri Mountain Railway timings & booking" },
  { href: "/explore", label: "Explore", description: "Filterable attractions directory" },
  { href: "/plan", label: "Plan", description: "Build a day-by-day itinerary" },
  { href: "/travel", label: "Travel", description: "Airport, buses, taxis, ghat roads" },
  { href: "/trekking", label: "Trekking", description: "Verified routes only" },
  { href: "/eat-and-shop", label: "Eat & Shop", description: "Eateries and what to buy" },
  { href: "/ask", label: "Ask", description: "AI concierge, grounded in verified facts" },
  { href: "/utilities", label: "Utilities", description: "Emergency numbers, packing, near me" },
];
