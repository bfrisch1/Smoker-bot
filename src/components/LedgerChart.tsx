import type { Reading, CookEvent, Session } from "@/lib/schema";
import type { EventType } from "@/lib/types";

interface LedgerChartProps {
  session: Pick<Session, "startedAt" | "endedAt" | "doneTargetTemp">;
  readings: Reading[];
  events?: CookEvent[];
  /** Draw the dashed "NOW" marker (active cook) vs. omit it (summary). */
  showNow?: boolean;
}

// Fixed SVG coordinate system; the chart scales responsively via viewBox.
const VB_W = 600;
const VB_H = 320;
const PLOT_LEFT = 50;
const PLOT_RIGHT = 580;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 286;

const GRATE = "#3F6F7A";
const MEAT = "#A8321F";

interface Pt {
  x: number;
  y: number;
}

/**
 * Hand-plotted ledger graph. Grate readings are filled teal circles, meat
 * readings are red ✕ marks, both joined by fine dashed trend lines over blue
 * accounting rules, with a brass "done zone" band and event flag pins.
 *
 * Pure SVG (no chart lib) so it renders identically on server and client and
 * matches the design treatment precisely.
 */
export function LedgerChart({
  session,
  readings,
  events = [],
  showNow = false,
}: LedgerChartProps) {
  const gratePts = readings.filter(
    (r) => r.grateTemp !== null && r.grateTemp !== undefined
  );
  const meatPts = readings.filter(
    (r) => r.meatTemp !== null && r.meatTemp !== undefined
  );

  // ---- Domains ----
  const now = Date.now();
  const tStart = session.startedAt;
  const lastReadingT = readings.length
    ? readings[readings.length - 1].timestamp
    : tStart;
  const tEnd = Math.max(
    session.endedAt ?? (showNow ? now : lastReadingT),
    lastReadingT,
    tStart + 60_000 // avoid zero-width domain
  );

  const allTemps: number[] = [];
  for (const r of readings) {
    if (r.grateTemp != null) allTemps.push(r.grateTemp);
    if (r.meatTemp != null) allTemps.push(r.meatTemp);
  }
  if (session.doneTargetTemp != null) allTemps.push(session.doneTargetTemp);

  const dataMin = allTemps.length ? Math.min(...allTemps) : 50;
  const dataMax = allTemps.length ? Math.max(...allTemps) : 300;
  const tempMin = Math.floor((dataMin - 15) / 25) * 25;
  const tempMax = Math.ceil((dataMax + 15) / 25) * 25;
  const tempRange = Math.max(tempMax - tempMin, 25);

  const xOf = (t: number): number =>
    PLOT_LEFT +
    5 +
    ((t - tStart) / (tEnd - tStart)) * (PLOT_RIGHT - PLOT_LEFT - 5);
  const yOf = (temp: number): number =>
    PLOT_BOTTOM - ((temp - tempMin) / tempRange) * (PLOT_BOTTOM - PLOT_TOP);

  // ---- Gridlines (~5 evenly spaced temp rules) ----
  const ruleCount = 5;
  const ruleTemps: number[] = [];
  for (let i = 0; i < ruleCount; i++) {
    ruleTemps.push(tempMin + (tempRange / (ruleCount - 1)) * i);
  }
  // Y-axis labels: top, middle, bottom.
  const labelTemps = [tempMax, Math.round((tempMin + tempMax) / 2), tempMin];

  const gratePoly = gratePts
    .map((r) => `${xOf(r.timestamp)},${yOf(r.grateTemp as number)}`)
    .join(" ");
  const meatPoly = meatPts
    .map((r) => `${xOf(r.timestamp)},${yOf(r.meatTemp as number)}`)
    .join(" ");

  const nowX = xOf(Math.min(now, tEnd));

  // Done zone band.
  const doneY = session.doneTargetTemp != null ? yOf(session.doneTargetTemp) : null;

  // Emphasized latest meat point on the active screen.
  const latestMeat = meatPts.length ? meatPts[meatPts.length - 1] : null;
  const latestMeatPt: Pt | null = latestMeat
    ? { x: xOf(latestMeat.timestamp), y: yOf(latestMeat.meatTemp as number) }
    : null;

  return (
    <div
      className="rounded-standard border border-border shadow-graph-inset"
      style={{ background: "#FCF6E6", padding: "8px 8px 4px" }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        fontFamily="var(--font-space-mono), monospace"
      >
        {/* Horizontal accounting rules */}
        <g stroke="#9bb0c4" strokeWidth={0.8} opacity={0.6}>
          {ruleTemps.map((t, i) => (
            <line key={i} x1={PLOT_LEFT} y1={yOf(t)} x2={PLOT_RIGHT} y2={yOf(t)} />
          ))}
        </g>

        {/* Left margin rule (faded red) */}
        <line
          x1={PLOT_LEFT + 28}
          y1={PLOT_TOP - 4}
          x2={PLOT_LEFT + 28}
          y2={PLOT_BOTTOM + 4}
          stroke="#d08b7a"
          strokeWidth={1}
          opacity={0.6}
        />

        {/* Done zone band + label */}
        {doneY != null && (
          <>
            <rect
              x={PLOT_LEFT}
              y={doneY - 4}
              width={PLOT_RIGHT - PLOT_LEFT}
              height={9}
              fill="#B8893C"
              opacity={0.18}
            />
            <text x={PLOT_LEFT + 4} y={doneY - 6} fontSize={9} fill="#9a6f23">
              DONE {Math.round(session.doneTargetTemp as number)}°
            </text>
          </>
        )}

        {/* Y-axis labels */}
        <g fontSize={10} fill="#8a7350">
          {labelTemps.map((t, i) => (
            <text key={i} x={14} y={yOf(t) + 4}>
              {Math.round(t)}
            </text>
          ))}
        </g>

        {/* NOW marker */}
        {showNow && (
          <>
            <line
              x1={nowX}
              y1={PLOT_TOP - 4}
              x2={nowX}
              y2={PLOT_BOTTOM + 4}
              stroke="#2B1D10"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.5}
            />
            <text x={nowX + 4} y={PLOT_TOP + 8} fontSize={9} fill="#2B1D10">
              NOW
            </text>
          </>
        )}

        {/* Grate trend line + dots */}
        {gratePts.length > 1 && (
          <polyline
            points={gratePoly}
            fill="none"
            stroke={GRATE}
            strokeWidth={1.4}
            strokeDasharray="1,5"
            strokeLinecap="round"
          />
        )}
        <g fill={GRATE}>
          {gratePts.map((r) => (
            <circle
              key={r.id}
              cx={xOf(r.timestamp)}
              cy={yOf(r.grateTemp as number)}
              r={3}
            />
          ))}
        </g>

        {/* Meat trend line + ✕ marks */}
        {meatPts.length > 1 && (
          <polyline
            points={meatPoly}
            fill="none"
            stroke={MEAT}
            strokeWidth={1.4}
            strokeDasharray="1,5"
            strokeLinecap="round"
          />
        )}
        <g stroke={MEAT} strokeWidth={1.8}>
          {meatPts.map((r) => {
            const cx = xOf(r.timestamp);
            const cy = yOf(r.meatTemp as number);
            return (
              <path
                key={r.id}
                d={`M${cx - 3},${cy - 3} l6,6 M${cx + 3},${cy - 3} l-6,6`}
              />
            );
          })}
        </g>

        {/* Emphasized latest meat point (active screen) */}
        {showNow && latestMeatPt && (
          <>
            <circle cx={latestMeatPt.x} cy={latestMeatPt.y} r={5} fill={MEAT} />
            <circle
              cx={latestMeatPt.x}
              cy={latestMeatPt.y}
              r={9}
              fill="none"
              stroke={MEAT}
              strokeWidth={1.5}
              opacity={0.4}
            />
          </>
        )}

        {/* Event pins */}
        <g fontSize={9}>
          {events.map((e, i) => (
            <EventPin
              key={e.id}
              event={e}
              x={xOf(e.timestamp)}
              anchorY={anchorYForEvent(e, readings, yOf)}
              tier={i % 2}
            />
          ))}
        </g>
      </svg>

      <Legend />
    </div>
  );
}

/** Pick a y on the meat (or grate) curve nearest the event time to anchor the pin. */
function anchorYForEvent(
  e: CookEvent,
  readings: Reading[],
  yOf: (t: number) => number
): number {
  let best: Reading | null = null;
  let bestDt = Infinity;
  for (const r of readings) {
    const dt = Math.abs(r.timestamp - e.timestamp);
    if (dt < bestDt) {
      bestDt = dt;
      best = r;
    }
  }
  const temp =
    best?.meatTemp ?? best?.grateTemp ?? null;
  return temp != null ? yOf(temp) : PLOT_BOTTOM - 40;
}

const EVENT_STYLE: Record<
  EventType,
  { color: string; bg: string; label: string }
> = {
  spritz: { color: "#B8893C", bg: "#fbf2db", label: "SPRITZ" },
  wrap: { color: "#7C2316", bg: "#f6e7e2", label: "WRAP" },
  photo: { color: "#3F6F7A", bg: "#eef0e6", label: "▦" },
  custom: { color: "#5A4530", bg: "#F5EBD2", label: "NOTE" },
};

function EventPin({
  event,
  x,
  anchorY,
  tier,
}: {
  event: CookEvent;
  x: number;
  anchorY: number;
  tier: number;
}) {
  const style = EVENT_STYLE[event.type as EventType] ?? EVENT_STYLE.custom;
  const flagY = tier === 0 ? 40 : 58;
  const isGlyph = event.type === "photo";
  const w = isGlyph ? 18 : style.label.length * 6 + 12;

  return (
    <g fontFamily="var(--font-space-mono), monospace">
      <line
        x1={x}
        y1={anchorY}
        x2={x}
        y2={flagY}
        stroke={style.color}
        strokeWidth={1}
        strokeDasharray="2,2"
      />
      <circle cx={x} cy={anchorY} r={3.5} fill={style.color} />
      <rect
        x={x - w / 2}
        y={flagY - 10}
        width={w}
        height={14}
        rx={2}
        fill={style.bg}
        stroke={style.color}
      />
      <text
        x={x}
        y={flagY}
        textAnchor="middle"
        fontSize={isGlyph ? 12 : 9}
        fill={style.color}
      >
        {style.label}
      </text>
    </g>
  );
}

function Legend() {
  return (
    <div
      className="flex flex-wrap justify-center font-mono"
      style={{ gap: 10, padding: "4px 0 2px", fontSize: 9 }}
    >
      <span style={{ color: GRATE }}>● GRATE</span>
      <span style={{ color: MEAT }}>✕ MEAT</span>
      <span style={{ color: "#B8893C" }}>⚑ SPRITZ</span>
      <span style={{ color: "#7C2316" }}>⚑ WRAP</span>
      <span style={{ color: GRATE }}>▦ PHOTO</span>
    </div>
  );
}
