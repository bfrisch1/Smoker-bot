import Link from "next/link";
import type { Session, Reading } from "@/lib/schema";
import type { CutType } from "@/lib/types";
import { MeatIcon } from "./MeatIcon";
import { ProbeStatTile } from "./ProbeStatTile";
import {
  formatElapsed,
  formatTime,
  latestTemps,
  detectStall,
} from "@/lib/format";

interface CookCardProps {
  session: Session;
  readings: Reading[];
  elapsedLabel?: string; // live-updating value injected by client; falls back to static
}

/** The "NOW SMOKING" active cook card on the home screen. */
export function CookCard({ session, readings, elapsedLabel }: CookCardProps) {
  const { grate, meat } = latestTemps(readings);
  const stallMin = detectStall(readings, session.doneTargetTemp);
  const elapsed = elapsedLabel ?? formatElapsed(session.startedAt, session.endedAt);

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="block rounded-standard border border-border bg-card shadow-card"
      style={{ padding: 14, textDecoration: "none" }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        <MeatIcon cut={session.cutType as CutType} size={42} />
        <div className="flex-1">
          <div
            className="font-body text-ink"
            style={{ fontWeight: 600, fontSize: 17 }}
          >
            {session.name}
          </div>
          <div className="font-mono text-muted" style={{ fontSize: 9 }}>
            started {formatTime(session.startedAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-muted" style={{ fontSize: 9 }}>
            ELAPSED
          </div>
          <div
            className="font-mono text-ink"
            style={{ fontSize: 15, fontWeight: 700 }}
          >
            {elapsed.slice(0, 5)}
          </div>
        </div>
      </div>

      <div className="flex" style={{ gap: 8, marginTop: 12 }}>
        <ProbeStatTile role="grate" label="GRATE" temp={grate} />
        <ProbeStatTile role="meat" label="MEAT" temp={meat} />
      </div>

      {stallMin !== null && (
        <div
          className="font-mono"
          style={{
            display: "inline-block",
            marginTop: 10,
            fontSize: 9,
            color: "#B8893C",
            background: "#fbf2db",
            border: "1px dashed #B8893C",
            borderRadius: 2,
            padding: "3px 8px",
          }}
        >
          ⚑ IN THE STALL · {formatStallShort(stallMin)}
        </div>
      )}
    </Link>
  );
}

function formatStallShort(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
