interface QuickStepsProps {
  steps: string[];
}

// A condensed, at-a-glance version of a longer step list below it — for the
// visitor who wants the gist in five seconds, not the full detail.
export function QuickSteps({ steps }: QuickStepsProps) {
  return (
    <section className="mt-6 rounded-lg bg-forest p-4">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-white/80">
        In short
      </h2>
      <ol className="mt-2 space-y-2">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm text-white">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold text-xs font-bold text-forest">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
