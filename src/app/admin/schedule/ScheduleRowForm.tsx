"use client";

import { useState } from "react";
import { saveScheduleRow } from "./actions";

export interface ScheduleRow {
  id: number;
  route_label: string;
  from_station_code: string;
  from_station_name: string;
  to_station_code: string;
  to_station_name: string;
  ticket_class: string;
  departs_approx: string | null;
  arrives_approx: string | null;
  notes: string | null;
  is_published: boolean;
  last_verified_on: string | null;
  verified_by: string | null;
}

export function ScheduleRowForm({ row }: { row: ScheduleRow }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      await saveScheduleRow(formData);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="rounded-lg border border-border bg-surface p-3">
      <input type="hidden" name="id" value={row.id} />
      <p className="font-semibold text-forest">
        {row.from_station_code} → {row.to_station_code}{" "}
        <span className="text-xs font-normal text-foreground-muted">
          ({row.from_station_name} to {row.to_station_name}, {row.ticket_class})
        </span>
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="block text-xs">
          <span className="text-forest">Departs (approx)</span>
          <input
            name="departsApprox"
            defaultValue={row.departs_approx ?? ""}
            placeholder="e.g. 7:10 AM"
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-forest">Arrives (approx)</span>
          <input
            name="arrivesApprox"
            defaultValue={row.arrives_approx ?? ""}
            placeholder="e.g. 12:00 PM"
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <label className="mt-2 block text-xs">
        <span className="text-forest">Notes</span>
        <input
          name="notes"
          defaultValue={row.notes ?? ""}
          className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
        />
      </label>

      <label className="mt-2 flex items-center gap-2 text-xs">
        <input type="checkbox" name="isPublished" defaultChecked={row.is_published} />
        <span>Published (visible on the Toy Train page)</span>
      </label>

      <p className="mt-1.5 text-xs text-foreground-muted">
        {row.verified_by ? `Last verified by ${row.verified_by}` : "Not yet verified"}
      </p>

      <button
        type="submit"
        disabled={saving}
        className="mt-2 rounded-md bg-forest px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved ✓ — save again to re-verify" : "Save (re-verifies as you, now)"}
      </button>
    </form>
  );
}
