import type { Session, Reading, CookEvent } from "@/lib/schema";
import type { CutType } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { BackHeader } from "@/components/BackHeader";
import { MeatIcon } from "@/components/MeatIcon";
import { LedgerChart } from "@/components/LedgerChart";
import { PitNotes } from "./PitNotes";
import {
  formatDuration,
  formatShortDate,
  formatTemp,
  peakGrate,
  finishMeatTemp,
} from "@/lib/format";

/**
 * Read-only review of a finished cook: full graph, 2×2 stat grid, pit notes.
 * Used both at /sessions/[id]/summary and when opening a done session directly.
 */
export function SummaryView({
  session,
  readings,
  events,
}: {
  session: Session;
  readings: Reading[];
  events: CookEvent[];
}) {
  const totalTime =
    session.endedAt != null
      ? formatDuration(session.startedAt, session.endedAt)
      : "—";
  const peak = peakGrate(readings);
  const finish = finishMeatTemp(readings);
  const snapshotCount = readings.filter((r) => r.source === "photo").length;

  return (
    <AppShell>
      <BackHeader
        href="/"
        title={session.name}
        leading={<MeatIcon cut={session.cutType as CutType} size={30} />}
      >
        <span style={{ fontSize: 15, color: "#b09a6e" }}>⤴</span>
      </BackHeader>

      <div className="flex-1 px-[14px] pb-8 pt-[14px]">
        <div className="font-mono text-muted" style={{ fontSize: 9, marginBottom: 10 }}>
          {formatShortDate(session.startedAt)} · DONE ✓
        </div>

        <LedgerChart session={session} readings={readings} events={events} />

        <div className="grid grid-cols-2" style={{ gap: 8, marginTop: 12 }}>
          <StatTile label="TOTAL TIME" value={totalTime} color="#2B1D10" />
          <StatTile
            label="PEAK GRATE"
            value={peak != null ? `${formatTemp(peak)}°` : "—"}
            color="#3F6F7A"
          />
          <StatTile
            label="FINISH TEMP"
            value={finish != null ? `${formatTemp(finish)}°` : "—"}
            color="#A8321F"
          />
          <StatTile label="SNAPSHOTS" value={String(snapshotCount)} color="#2B1D10" />
        </div>

        <div style={{ marginTop: 12 }}>
          <PitNotes sessionId={session.id} initialNotes={session.notes ?? ""} />
        </div>
      </div>
    </AppShell>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-standard border border-border bg-card"
      style={{ padding: "9px 11px" }}
    >
      <div className="font-mono" style={{ fontSize: 8, color: color === "#2B1D10" ? "#8a7350" : color, letterSpacing: "1px" }}>
        {label}
      </div>
      <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}
