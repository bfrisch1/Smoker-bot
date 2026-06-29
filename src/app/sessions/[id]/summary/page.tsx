import { notFound } from "next/navigation";
import {
  getSessionById,
  getReadingsForSession,
  getEventsForSession,
} from "@/lib/queries";
import { SummaryView } from "./SummaryView";

export const dynamic = "force-dynamic";

export default async function SummaryPage({
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

  return <SummaryView session={session} readings={readings} events={events} />;
}
