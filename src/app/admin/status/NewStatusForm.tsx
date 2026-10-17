"use client";

import { useRef, useState } from "react";
import { createStatusItem } from "./actions";

type Preset = { category: string; severity: string; title: string; detail: string };

const PRESETS: Record<string, Preset> = {
  toyTrainCancelled: {
    category: "toy_train",
    severity: "urgent",
    title: "Toy train cancelled today",
    detail: "The Nilgiri Mountain Railway service is cancelled for today. Check IRCTC before travelling to the station.",
  },
  ghatRoadClosed: {
    category: "ghat_road",
    severity: "urgent",
    title: "Ghat road closed",
    detail: "Closed at [location] — edit this before publishing.",
  },
};

export function NewStatusForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("general");
  const [severity, setSeverity] = useState("info");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function applyPreset(key: keyof typeof PRESETS) {
    const preset = PRESETS[key];
    setCategory(preset.category);
    setSeverity(preset.severity);
    setTitle(preset.title);
    setDetail(preset.detail);
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      await createStatusItem(formData);
      formRef.current?.reset();
      setCategory("general");
      setSeverity("info");
      setTitle("");
      setDetail("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-forest">Quick-add</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyPreset("toyTrainCancelled")}
          className="rounded-full border border-border px-3 py-1 text-xs hover:border-gold"
        >
          Toy train cancelled today
        </button>
        <button
          type="button"
          onClick={() => applyPreset("ghatRoadClosed")}
          className="rounded-full border border-border px-3 py-1 text-xs hover:border-gold"
        >
          Ghat road closed at [location]
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-forest">Category</span>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-2"
            >
              <option value="general">General</option>
              <option value="toy_train">Toy train</option>
              <option value="ghat_road">Ghat road</option>
              <option value="attraction_closure">Attraction closure</option>
              <option value="epass">E-Pass</option>
              <option value="weather_alert">Weather alert</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-forest">Severity</span>
            <select
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-2 py-2"
            >
              <option value="info">Info</option>
              <option value="caution">Caution</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-forest">Title</span>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
            placeholder="Short headline tourists will scan"
          />
        </label>

        <label className="block text-sm">
          <span className="text-forest">Detail</span>
          <textarea
            name="detail"
            required
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
            placeholder="One or two sentences — this is what shows under the title"
          />
        </label>

        <label className="block text-sm">
          <span className="text-forest">Auto-expire at (optional)</span>
          <input name="expiresAt" type="datetime-local" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2" />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-forest px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish now"}
        </button>
        <p className="text-xs text-foreground-muted">
          Publishing stamps this as verified by you, right now — it will be live on Home within
          a minute.
        </p>
      </form>
    </div>
  );
}
