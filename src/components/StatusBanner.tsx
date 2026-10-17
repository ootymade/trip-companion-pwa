import { getActiveStatusItems } from "@/lib/status";
import { getServerLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StatusBannerClient } from "./StatusBannerClient";

// Server Component: does the actual fetch (RLS already strips anything
// unpublished, unverified, or outside its active window — see
// src/lib/status.ts). The SW's network-first-falling-back-to-cache
// strategy for page navigations means this rendered HTML, banner
// included, is what a tourist sees offline too; StatusBannerClient only
// adds the "you're offline" label on top of that already-cached content.
export async function StatusBanner() {
  const [items, locale] = await Promise.all([getActiveStatusItems(), getServerLocale()]);
  const dictionary = getDictionary(locale);
  const mostRecentVerifiedOn = items[0]?.lastVerifiedOn ?? null;

  return (
    <StatusBannerClient items={items} mostRecentVerifiedOn={mostRecentVerifiedOn} dictionary={dictionary} />
  );
}
