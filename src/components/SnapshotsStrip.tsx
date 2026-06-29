import Image from "next/image";
import type { Reading } from "@/lib/schema";
import { formatTime } from "@/lib/format";

interface SnapshotsStripProps {
  readings: Reading[];
  max?: number;
}

/**
 * Horizontal strip of photo-reading thumbnails with timestamps. Readings
 * without a stored photo use the diagonal-hatch placeholder fill.
 */
export function SnapshotsStrip({ readings, max = 3 }: SnapshotsStripProps) {
  const withPhotos = readings.filter((r) => r.source === "photo");
  const shown = withPhotos.slice(-max).reverse();
  const overflow = withPhotos.length - shown.length;

  if (withPhotos.length === 0) {
    return (
      <div className="font-body italic text-muted" style={{ fontSize: 12 }}>
        No snapshots yet — snap a reading to start the log.
      </div>
    );
  }

  return (
    <div className="flex" style={{ gap: 7 }}>
      {shown.map((r) => (
        <div
          key={r.id}
          className="relative flex-1 overflow-hidden rounded-hairline border border-border"
          style={{
            height: 46,
            background: r.photoUrl
              ? undefined
              : "repeating-linear-gradient(45deg,#d9c8a0,#d9c8a0 5px,#d2bf93 5px,#d2bf93 10px)",
          }}
        >
          {r.photoUrl && (
            <Image
              src={r.photoUrl}
              alt="receiver reading"
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
            />
          )}
          <span
            className="absolute font-mono"
            style={{
              bottom: 2,
              left: 3,
              fontSize: 7,
              color: "#5A4530",
              background: "rgba(245,235,210,0.7)",
              padding: "0 2px",
              borderRadius: 1,
            }}
          >
            {formatTime(r.timestamp).replace(/\s?[AP]M/, "")}
          </span>
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="flex flex-1 items-center justify-center rounded-hairline font-mono"
          style={{
            height: 46,
            background: "#ece0c2",
            border: "1px dashed #b09a6e",
            fontSize: 8,
            color: "#8a7350",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
