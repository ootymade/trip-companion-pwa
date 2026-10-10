"use client";

import Link from "next/link";
import { moduleLinks } from "@/lib/modules";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { NAV_KEYS } from "@/lib/i18n/navKeys";

export function SiteHeader() {
  const { dictionary } = useLocale();

  const links = moduleLinks.map((m) => ({
    ...m,
    label: dictionary.nav[NAV_KEYS[m.href]] ?? m.label,
  }));

  return (
    <header className="bg-forest text-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          {dictionary.siteName}
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-4 text-sm md:flex" aria-label="Main">
            {links.map((m) => (
              <Link key={m.href} href={m.href} className="opacity-90 hover:opacity-100 hover:underline">
                {m.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
      {/* Mobile: horizontal scroll of the same links — this is a phone-first tool */}
      <nav
        className="flex gap-3 overflow-x-auto border-t border-white/10 px-4 py-2 text-sm md:hidden"
        aria-label="Main"
      >
        {links.map((m) => (
          <Link key={m.href} href={m.href} className="shrink-0 opacity-90 hover:opacity-100">
            {m.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
