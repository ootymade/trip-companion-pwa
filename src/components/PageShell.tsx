import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  intro?: string;
  children?: ReactNode;
}

// `intro` is optional so a page that streams its data-dependent content in
// via Suspense (see e-pass/toy-train) can render the title immediately and
// let a child component render its own "at a glance" paragraph once the
// fetch resolves, instead of blocking the whole shell on that fetch.
export function PageShell({ title, intro, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-forest md:text-4xl">{title}</h1>
      {intro ? <p className="mt-3 text-foreground-muted">{intro}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
