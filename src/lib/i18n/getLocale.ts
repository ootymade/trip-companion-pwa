import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE, type Locale } from "./locales";

// Server Components read the locale cookie (set by middleware on first
// visit, or by the LanguageSwitcher after that) so the first paint is
// already in the right language — no client-side flash of English.
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}
