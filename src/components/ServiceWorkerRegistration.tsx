"use client";

import { useEffect, useState } from "react";

// A tourist keeps this tab open for their whole trip, so a background
// deploy must surface a visible prompt rather than silently going stale.
// We detect it by checking whether a controller already existed before
// this registration — i.e. this is a returning visit, not the first-ever
// install — and a new worker then reaches "activated".
export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            if (hadController && newWorker.state === "activated") {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 bg-forest px-4 py-3 text-sm text-white shadow-lg">
      <span>A new version of OotyMade Trip is ready.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 rounded-md bg-gold px-3 py-1.5 font-semibold text-forest"
      >
        Refresh
      </button>
    </div>
  );
}
