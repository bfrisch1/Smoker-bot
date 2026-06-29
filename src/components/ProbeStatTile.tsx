import type { ProbeRole } from "@/lib/types";

interface ProbeStatTileProps {
  role: ProbeRole;
  label: string; // e.g. "GRATE · P1" or "MEAT · P2"
  temp: number | null;
  large?: boolean; // 26px readout (active screen) vs 18px (home card)
  showDot?: boolean;
}

/**
 * A single temperature readout tile. Grate = smoke teal, Meat = butcher red.
 * Color is the system's probe-distinguishing signal, used everywhere.
 */
export function ProbeStatTile({
  role,
  label,
  temp,
  large = false,
  showDot = false,
}: ProbeStatTileProps) {
  const isGrate = role === "grate";
  const color = isGrate ? "#3F6F7A" : "#A8321F";
  const bg = isGrate ? "#eef0e6" : "#f6e7e2";
  const border = isGrate ? "#a9c2c4" : "#d8b3a6";

  return (
    <div
      className="flex-1 rounded-standard"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        padding: large ? "9px 11px" : "7px 9px",
      }}
    >
      <div
        className="font-mono"
        style={{ fontSize: 8, color, letterSpacing: "1px" }}
      >
        {showDot ? "● " : ""}
        {label}
      </div>
      <div
        className="font-mono font-bold"
        style={{ fontSize: large ? 26 : 18, color, lineHeight: 1.1 }}
      >
        {temp === null ? "—" : `${formatTemp(temp)}°`}
      </div>
    </div>
  );
}

function formatTemp(t: number): string {
  // Show one decimal only when present, otherwise a clean integer.
  return Number.isInteger(t) ? String(t) : t.toFixed(1);
}
