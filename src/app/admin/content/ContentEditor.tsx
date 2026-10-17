"use client";

import { useState } from "react";
import { updateContentDocument } from "./actions";

export interface ContentRow {
  id: string;
  data: unknown;
  source_note: string;
  last_verified_on: string;
  verified_by: string | null;
}

export function ContentEditor({ row }: { row: ContentRow }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");
    try {
      await updateContentDocument(formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-forest">{row.id}</p>
          <p className="text-xs text-foreground-muted">
            Verified by {row.verified_by ?? "—"} on {new Date(row.last_verified_on).toLocaleDateString()}
          </p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-gold">
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open ? (
        <form action={handleSubmit} className="mt-3 space-y-2">
          <input type="hidden" name="id" value={row.id} />
          <label className="block text-xs">
            <span className="text-forest">data (JSON)</span>
            <textarea
              name="data"
              defaultValue={JSON.stringify(row.data, null, 2)}
              rows={12}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="block text-xs">
            <span className="text-forest">source note</span>
            <input
              name="sourceNote"
              defaultValue={row.source_note}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save (re-verifies as you, now)"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
