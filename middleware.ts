import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, matchAcceptLanguage } from "@/lib/i18n/locales";

// First-visit-only: if there's no locale cookie yet, derive one from the
// browser's Accept-Language header and set it, so the very first page a
// tourist sees is already in their language. Every visit after that is
// driven by the cookie (set here, or by the LanguageSwitcher), not by this
// header again — a user who explicitly switches language should stay
// switched even if their browser reports something else.
export function middleware(request: NextRequest) {
  if (request.cookies.has(LOCALE_COOKIE)) {
    return NextResponse.next();
  }

  const locale = matchAcceptLanguage(request.headers.get("accept-language"));
  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|icons|sw.js).*)",
};
