export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-6 text-sm text-foreground-muted">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} OotyMade. 14 years in the Nilgiris.</p>
        <div className="flex gap-4">
          <a href="https://ootymade.com" className="hover:text-foreground hover:underline">
            ootymade.com
          </a>
          <a href="https://tourism.ootymade.com" className="hover:text-foreground hover:underline">
            Book a trip
          </a>
        </div>
      </div>
    </footer>
  );
}
