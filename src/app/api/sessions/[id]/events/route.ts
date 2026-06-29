import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionById, createEvent } from "@/lib/queries";

export const runtime = "nodejs";

const CreateEventSchema = z.object({
  type: z.enum(["spritz", "wrap", "photo", "custom"]),
  note: z.string().max(500).nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  timestamp: z.number().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionById(params.id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const event = await createEvent({
    sessionId: params.id,
    timestamp: parsed.data.timestamp ?? Date.now(),
    type: parsed.data.type,
    note: parsed.data.note ?? null,
    photoUrl: parsed.data.photoUrl ?? null,
  });

  return NextResponse.json(event, { status: 201 });
}
