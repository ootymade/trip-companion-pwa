"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locales";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  initialLocale: Locale;
  children: ReactNode;
}

export function LocaleProvider({ initialLocale, children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      // Cookie (so the server renders the right locale on the next
      // navigation/SSR) and localStorage (belt-and-suspenders per the
      // brief's "remembered" requirement, and a same-tab fallback if
      // cookies are ever blocked) — try/catch since storage can throw in
      // a private window.
      try {
        document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        window.localStorage.setItem(LOCALE_COOKIE, next);
      } catch {
        // Non-fatal — the in-memory state above still switches the UI for
        // this session even if nothing persists.
      }
      router.refresh();
    },
    [router]
  );

  return (
    <LocaleContext.Provider value={{ locale, dictionary: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
