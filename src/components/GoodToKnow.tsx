interface GoodToKnowProps {
  points: string[];
}

// Short, scannable nuggets pulled from the same verified content as the rest
// of the page (never separately-sourced trivia) — styled distinctly so it
// reads as "highlights," not as a new claim needing its own citation.
export function GoodToKnow({ points }: GoodToKnowProps) {
  return (
    <section className="mt-8 rounded-lg border border-gold/40 bg-gold/10 p-4">
      <h2 className="font-heading text-lg font-semibold text-forest">Good to know</h2>
      <ul className="mt-2 space-y-1.5">
        {points.map((point) => (
          <li key={point} className="flex gap-2 text-sm text-foreground-muted">
            <span aria-hidden="true" className="text-gold-text">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
