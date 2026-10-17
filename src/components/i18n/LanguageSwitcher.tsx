"use client";

import { useLocale } from "./LocaleProvider";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const { locale, dictionary, setLocale } = useLocale();

  return (
    <label className="flex items-center gap-1.5 text-sm">
      <span className="sr-only">{dictionary.languageSwitcher.label}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof SUPPORTED_LOCALES)[number])}
        className="rounded-md border border-white/20 bg-forest px-2 py-1 text-cream"
        aria-label={dictionary.languageSwitcher.label}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code} className="text-foreground">
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
