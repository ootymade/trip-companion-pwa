interface ExternalLinkButtonProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLinkButton({ href, children }: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}
