import Link from "next/link";
import {
  getAllSessions,
  getReadingsForSession,
  getPeakGratePerSession,
} from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { Nameplate } from "@/components/Nameplate";
import { SectionLabel } from "@/components/SectionLabel";
import { PastCookRow } from "@/components/PastCookRow";
import { LiveCookCard } from "@/components/LiveCookCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sessions = await getAllSessions();
  const active = sessions.filter((s) => s.status === "active");
  const past = sessions.filter((s) => s.status !== "active");
  const peakMap = await getPeakGratePerSession();

  // Readings for active cooks power their live stat tiles.
  const activeReadings = await Promise.all(
    active.map((s) => getReadingsForSession(s.id))
  );

  return (
    <AppShell
      footer={
        <Link href="/sessions/new" style={{ textDecoration: "none" }}>
          <button className="btn-stamp w-full" style={{ fontSize: 13, padding: 14 }}>
            ✚ NEW COOK
          </button>
        </Link>
      }
    >
      <div className="px-4 pt-4">
        <Nameplate compact />
      </div>

      <div className="flex-1 px-4 pb-6 pt-4">
        {active.length > 0 && (
          <section>
            <SectionLabel className="mb-[9px]">NOW SMOKING</SectionLabel>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {active.map((s, i) => (
                <LiveCookCard
                  key={s.id}
                  session={s}
                  initialReadings={activeReadings[i]}
                />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section style={{ marginTop: active.length > 0 ? 18 : 0 }}>
            <SectionLabel className="mb-[9px]">PAST COOKS</SectionLabel>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {past.map((s) => (
                <PastCookRow
                  key={s.id}
                  session={s}
                  peakGrateTemp={peakMap[s.id] ?? null}
                />
              ))}
            </div>
          </section>
        )}

        {sessions.length === 0 && <EmptyState />}
      </div>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: "60px 20px", gap: 12 }}
    >
      <div className="font-display text-ink" style={{ fontSize: 22 }}>
        No cooks yet
      </div>
      <p
        className="font-body italic text-muted-dark"
        style={{ fontSize: 14, maxWidth: 260 }}
      >
        Fire up the smoker, then start a new cook to begin plotting your grate
        and meat temps.
      </p>
    </div>
  );
}
