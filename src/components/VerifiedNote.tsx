interface VerifiedNoteProps {
  lastVerified: string;
  sourceNote: string;
}

// Every piece of factual content on this site traces back to a Supabase row
// with a last-verified date and a source note — this renders that provenance
// consistently instead of asserting facts with no way to check them.
export function VerifiedNote({ lastVerified, sourceNote }: VerifiedNoteProps) {
  return (
    <p className="mt-8 border-t border-border pt-4 text-xs text-foreground-muted">
      Last verified {new Date(lastVerified).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      . {sourceNote}
    </p>
  );
}
