"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

// Set via next.config.ts's env from VERCEL_GIT_COMMIT_SHA — empty locally
// and on any build that isn't running on Vercel.
const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;

export function SiteFooter() {
  const { dictionary } = useLocale();

  return (
    <footer className="border-t border-border bg-surface py-6 text-sm text-foreground-muted">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} OotyMade. {dictionary.footer.tagline}
        </p>
        <div className="flex gap-4">
          <a href="https://ootymade.com" className="hover:text-foreground hover:underline">
            ootymade.com
          </a>
          <a href="https://tourism.ootymade.com" className="hover:text-foreground hover:underline">
            {dictionary.footer.bookATrip}
          </a>
        </div>
      </div>
      {buildSha ? (
        <p className="mx-auto mt-2 max-w-5xl px-4 text-xs text-foreground-muted/60">
          Build {buildSha}
        </p>
      ) : null}
    </footer>
  );
}
