import type { MetadataRoute } from "next";
import { moduleLinks } from "@/lib/modules";

// Individual /explore/[slug] attraction pages join this sitemap in Phase 2,
// once that route exists — each one is real SEO value the native app and
// the WhatsApp thread can't offer.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://trip.ootymade.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, priority: 1 },
    ...moduleLinks.map((m) => ({
      url: `${base}${m.href}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
