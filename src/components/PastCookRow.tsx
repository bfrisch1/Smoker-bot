import Link from "next/link";
import type { Session } from "@/lib/schema";
import type { CutType } from "@/lib/types";
import { MeatIcon } from "./MeatIcon";
import { formatShortDate, formatDuration } from "@/lib/format";

interface PastCookRowProps {
  session: Session;
  peakGrateTemp: number | null;
}

/** A single finished-cook row in the "PAST COOKS" list. */
export function PastCookRow({ session, peakGrateTemp }: PastCookRowProps) {
  const meta = [
    formatShortDate(session.startedAt),
    peakGrateTemp !== null ? `peak ${Math.round(peakGrateTemp)}°` : null,
    session.endedAt
      ? formatDuration(session.startedAt, session.endedAt)
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/sessions/${session.id}/summary`}
      className="flex items-center rounded-standard border border-border bg-card"
      style={{ gap: 11, padding: "10px 12px", textDecoration: "none" }}
    >
      <MeatIcon cut={session.cutType as CutType} size={34} />
      <div className="flex-1">
        <div
          className="font-body text-ink"
          style={{ fontWeight: 600, fontSize: 14 }}
        >
          {session.name}
        </div>
        <div className="font-mono text-muted" style={{ fontSize: 9 }}>
          {meta}
        </div>
      </div>
      <span style={{ color: "#b09a6e", fontSize: 16 }}>›</span>
    </Link>
  );
}
