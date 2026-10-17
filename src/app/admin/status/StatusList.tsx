"use client";

import { useState, useTransition } from "react";
import { setPublished, expireNow } from "./actions";

export interface StatusRow {
  id: string;
  category: string;
  title: string;
  detail: string;
  severity: string;
  is_published: boolean;
  expires_at: string | null;
  last_verified_on: string | null;
  verified_by: string | null;
}

export function StatusList({ rows }: { rows: StatusRow[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isExpired = (row: StatusRow) => Boolean(row.expires_at && new Date(row.expires_at) <= new Date());

  return (
    <ul className="mt-4 space-y-2">
      {rows.map((row) => {
        const expired = isExpired(row);
        const live = row.is_published && !expired;
        return (
          <li key={row.id} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-forest">{row.title}</p>
                <p className="text-sm text-foreground-muted">{row.detail}</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {row.category} · {row.severity} ·{" "}
                  {live ? (
                    <span className="text-success">live on Home</span>
                  ) : expired ? (
                    <span>expired</span>
                  ) : (
                    <span>unpublished</span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  type="button"
                  disabled={pendingId === row.id}
                  onClick={() => {
                    setPendingId(row.id);
                    startTransition(async () => {
                      await setPublished(row.id, !row.is_published);
                      setPendingId(null);
                    });
                  }}
                  className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-gold disabled:opacity-50"
                >
                  {row.is_published ? "Unpublish" : "Publish"}
                </button>
                {!expired && (
                  <button
                    type="button"
                    disabled={pendingId === row.id}
                    onClick={() => {
                      setPendingId(row.id);
                      startTransition(async () => {
                        await expireNow(row.id);
                        setPendingId(null);
                      });
                    }}
                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-gold disabled:opacity-50"
                  >
                    Expire now
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
      {rows.length === 0 ? <p className="text-sm text-foreground-muted">No status items yet.</p> : null}
    </ul>
  );
}
