"use client";

import { useState } from "react";

/** Editable free-text pit notes, auto-saved on blur. */
export function PitNotes({
  sessionId,
  initialNotes,
}: {
  sessionId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  async function persist() {
    if (notes === saved) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) setSaved(notes);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="rounded-standard border border-border"
      style={{ background: "#fdf8e9", padding: "11px 13px" }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
        <span className="font-mono text-red-ink" style={{ fontSize: 8, letterSpacing: "1px" }}>
          PIT NOTES
        </span>
        {saving && (
          <span className="font-mono text-muted" style={{ fontSize: 8 }}>
            saving…
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={persist}
        rows={4}
        placeholder="Post oak, ran 250° steady. Wrapped at 165°. Rested 1 hr…"
        className="font-body w-full"
        style={{
          fontStyle: "italic",
          fontSize: 14,
          color: "#3a2c18",
          lineHeight: 1.4,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}
