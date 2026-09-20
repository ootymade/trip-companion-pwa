import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  intro: string;
  children?: ReactNode;
}

export function PageShell({ title, intro, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-forest md:text-4xl">{title}</h1>
      <p className="mt-3 text-foreground-muted">{intro}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
