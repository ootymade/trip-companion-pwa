export const SUPPORTED_LOCALES = ["en", "ta", "hi", "ml", "kn"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ta: "தமிழ்",
  hi: "हिन्दी",
  ml: "മലയാളം",
  kn: "ಕನ್ನಡ",
};

export const LOCALE_COOKIE = "ootymade_locale";

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

// Matches an Accept-Language header (e.g. "ta-IN,ta;q=0.9,en;q=0.8") to one
// of our supported locales, defaulting to English for anything else —
// "use the browser language as the first-visit default" from the brief.
export function matchAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase().slice(0, 2))
    .filter(Boolean);

  for (const lang of preferred) {
    if (isSupportedLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}
