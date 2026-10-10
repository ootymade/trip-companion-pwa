import type { Dictionary } from "@/lib/i18n/dictionaries";

// Maps a module route to the dictionary field that labels it, shared by
// SiteHeader and the home page grid so both stay in sync with one list.
export const NAV_KEYS: Record<string, keyof Dictionary["nav"]> = {
  "/e-pass": "ePass",
  "/toy-train": "toyTrain",
  "/explore": "explore",
  "/plan": "plan",
  "/travel": "travel",
  "/trekking": "trekking",
  "/eat-and-shop": "eatAndShop",
  "/ask": "ask",
  "/utilities": "utilities",
};
