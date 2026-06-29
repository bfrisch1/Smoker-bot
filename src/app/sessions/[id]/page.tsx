import { notFound } from "next/navigation";
import {
  getSessionById,
  getReadingsForSession,
  getEventsForSession,
} from "@/lib/queries";
import { ActiveCookClient } from "./ActiveCookClient";
import { SummaryView } from "./summary/SummaryView";

export const dynamic = "force-dynamic";

export default async function SessionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSessionById(params.id);
  if (!session) notFound();

  const [readings, events] = await Promise.all([
    getReadingsForSession(params.id),
    getEventsForSession(params.id),
  ]);

  // A finished cook opens straight to its read-only summary.
  if (session.status === "done") {
    return <SummaryView session={session} readings={readings} events={events} />;
  }

  return (
    <ActiveCookClient
      session={session}
      initialReadings={readings}
      initialEvents={events}
    />
  );
}
