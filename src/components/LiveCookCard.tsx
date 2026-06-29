"use client";

import { useEffect, useState } from "react";
import type { Session, Reading } from "@/lib/schema";
import { CookCard } from "./CookCard";
import { formatElapsed } from "@/lib/format";

/**
 * Client wrapper around CookCard that ticks the elapsed timer once a second
 * while the cook is active.
 */
export function LiveCookCard({
  session,
  initialReadings,
}: {
  session: Session;
  initialReadings: Reading[];
}) {
  const [elapsed, setElapsed] = useState(() =>
    formatElapsed(session.startedAt, session.endedAt)
  );

  useEffect(() => {
    if (session.status !== "active") return;
    const id = setInterval(() => {
      setElapsed(formatElapsed(session.startedAt, session.endedAt));
    }, 1000);
    return () => clearInterval(id);
  }, [session.startedAt, session.endedAt, session.status]);

  return (
    <CookCard
      session={session}
      readings={initialReadings}
      elapsedLabel={elapsed}
    />
  );
}
