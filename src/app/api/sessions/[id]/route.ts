import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getSessionById,
  getReadingsForSession,
  getEventsForSession,
  updateSession,
} from "@/lib/queries";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionById(params.id);
  if (!session) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [readings, events] = await Promise.all([
    getReadingsForSession(params.id),
    getEventsForSession(params.id),
  ]);
  return NextResponse.json({ session, readings, events });
}

const PatchSchema = z.object({
  endedAt: z.number().nullable().optional(),
  status: z.enum(["active", "done"]).optional(),
  notes: z.string().max(4000).nullable().optional(),
  name: z.string().min(1).max(120).optional(),
  doneTargetTemp: z.number().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const updated = await updateSession(params.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
