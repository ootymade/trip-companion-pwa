"use client";

import { useSyncExternalStore } from "react";
import type { StatusItem } from "@/lib/status";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface StatusBannerClientProps {
  items: StatusItem[];
  mostRecentVerifiedOn: string | null;
  dictionary: Dictionary;
}

const SEVERITY_STYLES: Record<StatusItem["severity"], string> = {
  urgent: "border-danger/40 bg-danger/10 text-danger",
  caution: "border-gold/50 bg-gold/10 text-gold-text",
  info: "border-border bg-surface text-foreground-muted",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function subscribeToConnectivity(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// useSyncExternalStore (not useState+useEffect) for the one genuinely
// external bit of state here — it has a proper getServerSnapshot, so
// there's no setState-in-effect and no SSR/client mismatch to paper over.
function useIsOffline(): boolean {
  return useSyncExternalStore(
    subscribeToConnectivity,
    () => !navigator.onLine,
    () => false // server/first paint: assume online, corrected on hydration if wrong
  );
}

export function StatusBannerClient({ items, mostRecentVerifiedOn, dictionary }: StatusBannerClientProps) {
  // Rendered fresh on every request/revalidation while online; when the
  // service worker serves this same HTML from cache during an offline
  // visit, isOffline flips true on hydration and we relabel the
  // already-rendered timestamp instead of pretending it's live.
  const isOffline = useIsOffline();

  return (
    <section className="mx-auto max-w-5xl px-4 pt-6" aria-label={dictionary.statusBanner.heading}>
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-forest">
        {dictionary.statusBanner.heading}
      </h2>

      {items.length === 0 ? (
        <div className="mt-2 rounded-lg border border-border bg-surface p-3 text-sm text-foreground-muted">
          {dictionary.statusBanner.noAlerts}
        </div>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((item) => (
            <li key={item.id} className={`rounded-lg border p-3 text-sm ${SEVERITY_STYLES[item.severity]}`}>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-0.5 opacity-90">{item.detail}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1.5 text-xs text-foreground-muted">
        {mostRecentVerifiedOn
          ? isOffline
            ? `${dictionary.statusBanner.updated} ${timeAgo(mostRecentVerifiedOn)} — ${dictionary.statusBanner.offline}`
            : `${dictionary.statusBanner.updated} ${timeAgo(mostRecentVerifiedOn)}`
          : isOffline
            ? dictionary.statusBanner.offline
            : null}
      </p>
    </section>
  );
}
