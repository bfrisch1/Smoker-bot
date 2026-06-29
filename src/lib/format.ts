import type { Reading, Session, CookEvent } from "./schema";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "08:12:44" elapsed from start to now (or to end). */
export function formatElapsed(startedAt: number, endedAt?: number | null): string {
  const end = endedAt ?? Date.now();
  const totalSec = Math.max(0, Math.floor((end - startedAt) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** "11h 42m" coarse duration for summaries / past cook meta. */
export function formatDuration(startedAt: number, endedAt: number): string {
  const totalMin = Math.max(0, Math.floor((endedAt - startedAt) / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/** "6:35 AM" */
export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Jun 14" */
export function formatShortDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTemp(t: number | null): string {
  if (t === null) return "—";
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}

/** Latest non-null grate/meat temps across a session's readings. */
export function latestTemps(readings: Reading[]): {
  grate: number | null;
  meat: number | null;
} {
  let grate: number | null = null;
  let meat: number | null = null;
  for (const r of readings) {
    if (r.grateTemp !== null && r.grateTemp !== undefined) grate = r.grateTemp;
    if (r.meatTemp !== null && r.meatTemp !== undefined) meat = r.meatTemp;
  }
  return { grate, meat };
}

export function peakGrate(readings: Reading[]): number | null {
  let peak: number | null = null;
  for (const r of readings) {
    if (r.grateTemp !== null && r.grateTemp !== undefined) {
      peak = peak === null ? r.grateTemp : Math.max(peak, r.grateTemp);
    }
  }
  return peak;
}

export function finishMeatTemp(readings: Reading[]): number | null {
  for (let i = readings.length - 1; i >= 0; i--) {
    const t = readings[i].meatTemp;
    if (t !== null && t !== undefined) return t;
  }
  return null;
}

/**
 * Crude stall detection: meat temp has moved less than `thresholdF` over the
 * last `windowMs`, while still below the done target. Returns the stall
 * duration in minutes if stalled, else null.
 */
export function detectStall(
  readings: Reading[],
  doneTargetTemp: number | null,
  windowMs = 60 * 60 * 1000,
  thresholdF = 5
): number | null {
  const meatReadings = readings.filter(
    (r) => r.meatTemp !== null && r.meatTemp !== undefined
  );
  if (meatReadings.length < 2) return null;

  const last = meatReadings[meatReadings.length - 1];
  if (doneTargetTemp !== null && (last.meatTemp ?? 0) >= doneTargetTemp) {
    return null;
  }

  const cutoff = last.timestamp - windowMs;
  const windowReadings = meatReadings.filter((r) => r.timestamp >= cutoff);
  if (windowReadings.length < 2) return null;

  const temps = windowReadings.map((r) => r.meatTemp as number);
  const spread = Math.max(...temps) - Math.min(...temps);
  if (spread > thresholdF) return null;

  const stallMs = last.timestamp - windowReadings[0].timestamp;
  return Math.floor(stallMs / 60000);
}

export type { Reading, Session, CookEvent };
