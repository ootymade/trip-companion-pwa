"use client";

import { useState, useTransition } from "react";
import { publishDraft, rejectDraft } from "./actions";

interface Source {
  claim: string;
  source_url: string;
  checked_on: string;
}

export interface DraftRow {
  id: number;
  content_document_id: string;
  data: unknown;
  sources: Source[];
  submitted_at: string;
}

export function DraftReview({ draft }: { draft: DraftRow }) {
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState<"published" | "rejected" | null>(null);

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-foreground-muted">
        {draft.content_document_id} — {done === "published" ? "published to the live page" : "rejected"}.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="font-semibold text-forest">{draft.content_document_id}</p>
      <p className="text-xs text-foreground-muted">Submitted {new Date(draft.submitted_at).toLocaleString()}</p>

      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-medium text-forest">Proposed content (JSON)</summary>
        <pre className="mt-2 max-h-80 overflow-auto rounded-md bg-background p-3 text-xs">
          {JSON.stringify(draft.data, null, 2)}
        </pre>
      </details>

      <details className="mt-2" open>
        <summary className="cursor-pointer text-sm font-medium text-forest">
          Sources ({draft.sources.length})
        </summary>
        <ul className="mt-2 space-y-1.5 text-sm">
          {draft.sources.map((s, i) => (
            <li key={i} className="rounded-md border border-border bg-background p-2">
              <p>{s.claim}</p>
              <a
                href={s.source_url.startsWith("http") ? s.source_url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-xs text-gold-text hover:underline"
              >
                {s.source_url}
              </a>
              <p className="text-xs text-foreground-muted">Checked {s.checked_on}</p>
            </li>
          ))}
        </ul>
      </details>

      <label className="mt-3 block text-sm">
        <span className="text-forest">Review notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="e.g. confirmed fee amount by phone with the RTO"
        />
      </label>

      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await publishDraft(draft.id, notes);
                setDone("published");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Publish failed.");
              }
            })
          }
          className="rounded-md bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Publish (I&apos;ve verified this)
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                await rejectDraft(draft.id, notes);
                setDone("rejected");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Reject failed.");
              }
            })
          }
          className="rounded-md border border-border px-4 py-2 text-sm hover:border-gold disabled:opacity-60"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
