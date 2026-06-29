import { eq, desc, asc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import {
  sessions,
  readings,
  events,
  type Session,
  type Reading,
  type CookEvent,
  type NewReading,
  type NewCookEvent,
} from "./schema";
import type { CutType, ProbeRole } from "./types";
import { DONE_TARGET_TEMPS } from "./types";

export interface CreateSessionInput {
  name: string;
  cutType: CutType;
  probe1Role: ProbeRole;
  probe2Role: ProbeRole;
  probe1Label?: string;
  probe2Label?: string;
}

export async function createSession(
  input: CreateSessionInput
): Promise<Session> {
  const row = {
    id: uuidv4(),
    name: input.name,
    cutType: input.cutType,
    probe1Role: input.probe1Role,
    probe2Role: input.probe2Role,
    probe1Label: input.probe1Label ?? "Probe One",
    probe2Label: input.probe2Label ?? "Probe Two",
    startedAt: Date.now(),
    endedAt: null,
    doneTargetTemp: DONE_TARGET_TEMPS[input.cutType] ?? null,
    status: "active" as const,
    notes: null,
  };
  const [created] = await db.insert(sessions).values(row).returning();
  return created;
}

export async function getAllSessions(): Promise<Session[]> {
  return db.select().from(sessions).orderBy(desc(sessions.startedAt));
}

export async function getSessionById(
  id: string
): Promise<Session | undefined> {
  const [row] = await db.select().from(sessions).where(eq(sessions.id, id));
  return row;
}

/** Map of sessionId → peak grate temperature, for the past-cooks list. */
export async function getPeakGratePerSession(): Promise<
  Record<string, number | null>
> {
  const rows = await db
    .select({
      sessionId: readings.sessionId,
      peak: sql<number | null>`max(${readings.grateTemp})`,
    })
    .from(readings)
    .groupBy(readings.sessionId);

  const map: Record<string, number | null> = {};
  for (const row of rows) {
    map[row.sessionId] = row.peak ?? null;
  }
  return map;
}

export async function getReadingsForSession(
  sessionId: string
): Promise<Reading[]> {
  return db
    .select()
    .from(readings)
    .where(eq(readings.sessionId, sessionId))
    .orderBy(asc(readings.timestamp));
}

export async function getEventsForSession(
  sessionId: string
): Promise<CookEvent[]> {
  return db
    .select()
    .from(events)
    .where(eq(events.sessionId, sessionId))
    .orderBy(asc(events.timestamp));
}

export async function createReading(
  input: Omit<NewReading, "id">
): Promise<Reading> {
  const [created] = await db
    .insert(readings)
    .values({ id: uuidv4(), ...input })
    .returning();
  return created;
}

export async function createEvent(
  input: Omit<NewCookEvent, "id">
): Promise<CookEvent> {
  const [created] = await db
    .insert(events)
    .values({ id: uuidv4(), ...input })
    .returning();
  return created;
}

export async function updateSession(
  id: string,
  patch: Partial<
    Pick<Session, "endedAt" | "notes" | "status" | "doneTargetTemp" | "name">
  >
): Promise<Session | undefined> {
  const [updated] = await db
    .update(sessions)
    .set(patch)
    .where(eq(sessions.id, id))
    .returning();
  return updated;
}
