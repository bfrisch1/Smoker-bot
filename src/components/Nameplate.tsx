/**
 * The "BUTCHER'S LOG" nameplate banner — card with a butcher-red bar across
 * the top and bottom edges. Used as the masthead on the home screen.
 */
export function Nameplate({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-hairline border border-border bg-card">
      <div className="bg-butcher-red" style={{ height: compact ? 5 : 7 }} />
      <div className="text-center" style={{ padding: compact ? "11px 0 10px" : "20px 22px" }}>
        <div
          className="font-display text-ink"
          style={{ fontSize: compact ? 21 : 32, letterSpacing: "0.5px", lineHeight: 1 }}
        >
          BUTCHER&apos;S LOG
        </div>
        <div
          className="font-mono text-red-ink"
          style={{ fontSize: compact ? 8 : 10, letterSpacing: "3px", marginTop: compact ? 3 : 9 }}
        >
          SMOKE &amp; TEMP JOURNAL
        </div>
      </div>
      <div className="bg-butcher-red" style={{ height: compact ? 5 : 7 }} />
    </div>
  );
}
