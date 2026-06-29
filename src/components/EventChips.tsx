"use client";

import { useState } from "react";
import type { CookEvent } from "@/lib/schema";
import type { EventType } from "@/lib/types";

interface EventChipsProps {
  sessionId: string;
  onLogged: (event: CookEvent) => void;
}

const CHIPS: { type: EventType; label: string }[] = [
  { type: "spritz", label: "💧 SPRITZ" },
  { type: "wrap", label: "🎁 WRAP" },
  { type: "photo", label: "📸 PHOTO" },
];

/**
 * Quick-log chip row. Tapping a chip posts a timestamped event which becomes a
 * pin on the graph. "＋" logs a free-text custom note.
 */
export function EventChips({ sessionId, onLogged }: EventChipsProps) {
  const [pending, setPending] = useState<EventType | "custom" | null>(null);

  async function logEvent(type: EventType, note?: string) {
    setPending(type);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, note: note ?? null }),
      });
      if (res.ok) {
        onLogged(await res.json());
      }
    } finally {
      setPending(null);
    }
  }

  function logCustom() {
    const note = window.prompt("Log a note for this moment:");
    if (note && note.trim()) {
      logEvent("custom", note.trim());
    }
  }

  const chipStyle: React.CSSProperties = {
    flex: 1,
    fontSize: 10,
    letterSpacing: ".5px",
    color: "#7C2316",
    background: "#F5EBD2",
    border: "1px solid #cdb789",
    borderRadius: 20,
    padding: "8px 2px",
    cursor: "pointer",
  };

  return (
    <div className="flex" style={{ gap: 6, width: "100%" }}>
      {CHIPS.map((chip) => (
        <button
          key={chip.type}
          className="font-mono"
          style={{ ...chipStyle, opacity: pending === chip.type ? 0.5 : 1 }}
          disabled={pending !== null}
          onClick={() => logEvent(chip.type)}
        >
          {chip.label}
        </button>
      ))}
      <button
        className="font-mono"
        style={{
          ...chipStyle,
          flex: "none",
          padding: "8px 11px",
          fontSize: 12,
        }}
        disabled={pending !== null}
        onClick={logCustom}
      >
        ＋
      </button>
    </div>
  );
}
