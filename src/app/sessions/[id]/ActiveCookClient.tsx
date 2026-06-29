"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Session, Reading, CookEvent } from "@/lib/schema";
import type { CutType } from "@/lib/types";
import { AppShell } from "@/components/AppShell";
import { MeatIcon } from "@/components/MeatIcon";
import { ProbeStatTile } from "@/components/ProbeStatTile";
import { LedgerChart } from "@/components/LedgerChart";
import { SnapshotsStrip } from "@/components/SnapshotsStrip";
import { EventChips } from "@/components/EventChips";
import { ReadingUploader } from "@/components/ReadingUploader";
import { SectionLabel } from "@/components/SectionLabel";
import { formatElapsed, latestTemps } from "@/lib/format";

export function ActiveCookClient({
  session,
  initialReadings,
  initialEvents,
}: {
  session: Session;
  initialReadings: Reading[];
  initialEvents: CookEvent[];
}) {
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>(initialReadings);
  const [events, setEvents] = useState<CookEvent[]>(initialEvents);
  const [elapsed, setElapsed] = useState(() => formatElapsed(session.startedAt));
  const [uploader, setUploader] = useState<null | "photo" | "manual">(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(formatElapsed(session.startedAt));
    }, 1000);
    return () => clearInterval(id);
  }, [session.startedAt]);

  const { grate, meat } = latestTemps(readings);

  function addReading(r: Reading) {
    setReadings((prev) => [...prev, r].sort((a, b) => a.timestamp - b.timestamp));
    setUploader(null);
  }

  async function endCook() {
    setEnding(true);
    await fetch(`/api/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done", endedAt: Date.now() }),
    });
    router.push(`/sessions/${session.id}/summary`);
  }

  return (
    <>
      <AppShell
        footer={
          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <EventChips
              sessionId={session.id}
              onLogged={(e) =>
                setEvents((prev) => [...prev, e].sort((a, b) => a.timestamp - b.timestamp))
              }
            />
            <button
              className="btn-stamp w-full"
              style={{ fontSize: 13, padding: 14 }}
              onClick={() => setUploader("photo")}
            >
              📷 SNAP A READING
            </button>
            <button
              onClick={() => setUploader("manual")}
              className="font-body italic text-red-ink"
              style={{ fontSize: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              or enter temps manually
            </button>
          </div>
        }
      >
        {/* header */}
        <div
          className="flex items-center"
          style={{ gap: 9, padding: "10px 16px", borderBottom: "1px solid #cdb789" }}
        >
          <Link href="/" style={{ fontSize: 18, color: "#2B1D10", textDecoration: "none" }}>
            ‹
          </Link>
          <MeatIcon cut={session.cutType as CutType} size={30} />
          <div className="flex-1">
            <div className="font-body text-ink" style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.1 }}>
              {session.name}
            </div>
            <div className="font-mono text-muted" style={{ fontSize: 9 }}>
              elapsed {elapsed}
            </div>
          </div>
          <span
            className="live-dot"
            style={{ width: 9, height: 9, borderRadius: "50%", background: "#A8321F" }}
          />
        </div>

        <div className="flex-1 px-[14px] pb-6 pt-[14px]">
          {/* big readouts */}
          <div className="flex" style={{ gap: 9 }}>
            <ProbeStatTile role="grate" label="GRATE · P1" temp={grate} large showDot />
            <ProbeStatTile role="meat" label="MEAT · P2" temp={meat} large showDot />
          </div>

          {/* graph */}
          <div style={{ marginTop: 12 }}>
            <LedgerChart session={session} readings={readings} events={events} showNow />
          </div>

          {/* snapshots */}
          <div style={{ marginTop: 14 }}>
            <SectionLabel>
              SNAPSHOTS · {readings.filter((r) => r.source === "photo").length}
            </SectionLabel>
          </div>
          <div style={{ marginTop: 7 }}>
            <SnapshotsStrip readings={readings} />
          </div>

          {/* end cook */}
          <button
            onClick={endCook}
            disabled={ending}
            className="font-mono w-full"
            style={{
              marginTop: 20,
              fontSize: 11,
              letterSpacing: "1px",
              color: "#4A5E3A",
              background: "transparent",
              border: "1.5px solid #4A5E3A",
              borderRadius: 3,
              padding: "10px",
              cursor: "pointer",
            }}
          >
            {ending ? "FINISHING…" : "✓ END COOK & VIEW SUMMARY"}
          </button>
        </div>
      </AppShell>

      {uploader && (
        <ReadingUploader
          sessionId={session.id}
          startedAt={session.startedAt}
          mode={uploader}
          onSaved={addReading}
          onClose={() => setUploader(null)}
        />
      )}
    </>
  );
}
