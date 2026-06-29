import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, getAllSessions } from "@/lib/queries";
import { CUT_TYPES } from "@/lib/types";

export const runtime = "nodejs";

const CreateSessionSchema = z.object({
  name: z.string().min(1).max(120),
  cutType: z.enum(CUT_TYPES as [string, ...string[]]),
  probe1Role: z.enum(["grate", "meat"]),
  probe2Role: z.enum(["grate", "meat"]),
  probe1Label: z.string().max(60).optional(),
  probe2Label: z.string().max(60).optional(),
});

export async function GET() {
  const all = await getAllSessions();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const session = await createSession(parsed.data as never);
  return NextResponse.json(session, { status: 201 });
}
