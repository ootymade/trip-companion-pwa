"use client";

import { useState, useTransition } from "react";
import { approveTranslation } from "./actions";

export interface TranslationRow {
  id: number;
  entity_type: string;
  entity_id: string;
  field_name: string;
  locale: string;
  value: string;
  is_safety_critical: boolean;
}

export function ReviewList({ rows }: { rows: TranslationRow[] }) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  if (rows.length === 0) {
    return <p className="mt-4 text-sm text-foreground-muted">Nothing waiting for review.</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {rows.map((row) => (
        <li key={row.id} className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-foreground-muted">
                {row.entity_type} / {row.entity_id} / {row.field_name} · {row.locale}
                {row.is_safety_critical ? (
                  <span className="ml-2 rounded-full bg-danger/10 px-2 py-0.5 text-danger">
                    safety-critical — hidden until reviewed
                  </span>
                ) : null}
              </p>
              <p className="mt-1">{row.value}</p>
            </div>
            <button
              type="button"
              disabled={pendingId === row.id}
              onClick={() => {
                setPendingId(row.id);
                startTransition(async () => {
                  await approveTranslation(row.id);
                  setPendingId(null);
                });
              }}
              className="shrink-0 rounded-md bg-forest px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              Approve
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
