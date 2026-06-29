import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionById, createReading } from "@/lib/queries";
import { extractProbeTemps, type SupportedMediaType } from "@/lib/claude";
import type { ProbeRole } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const SUPPORTED: SupportedMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Map raw probe1/probe2 readings onto grate/meat using the session's role
 * assignment. If both probes share a role (two-meat config), probe1 takes the
 * primary slot and probe2 falls back to the other.
 */
function mapProbesToRoles(
  probe1: number | null,
  probe2: number | null,
  probe1Role: ProbeRole,
  probe2Role: ProbeRole
): { grateTemp: number | null; meatTemp: number | null } {
  let grateTemp: number | null = null;
  let meatTemp: number | null = null;

  if (probe1Role === "grate") grateTemp = probe1;
  else meatTemp = probe1;

  if (probe2Role === "grate") grateTemp = grateTemp ?? probe2;
  else meatTemp = meatTemp ?? probe2;

  return { grateTemp, meatTemp };
}

/**
 * POST handles two stages:
 *
 *  • multipart/form-data with an `image` → upload photo to Blob + read temps
 *    with Claude vision. Returns the read values WITHOUT saving, so the client
 *    can show a confirm/correct screen first.
 *
 *  • application/json {grateTemp, meatTemp, source, photoUrl?, timestamp?} →
 *    persist the (possibly corrected, or manually entered) reading.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionById(params.id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  // ---- Save stage (JSON): persist a confirmed or manual reading ----
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const grateTemp = numOrNull(body.grateTemp);
    const meatTemp = numOrNull(body.meatTemp);
    if (grateTemp === null && meatTemp === null) {
      return NextResponse.json(
        { error: "Provide at least one temperature" },
        { status: 400 }
      );
    }
    const reading = await createReading({
      sessionId: params.id,
      timestamp: typeof body.timestamp === "number" ? body.timestamp : Date.now(),
      grateTemp,
      meatTemp,
      source: body.source === "manual" ? "manual" : "photo",
      photoUrl: typeof body.photoUrl === "string" ? body.photoUrl : null,
    });
    return NextResponse.json(reading, { status: 201 });
  }

  // ---- Read stage (multipart): upload photo + Claude vision read ----
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data or JSON" },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const mediaType = (file.type || "image/jpeg") as SupportedMediaType;
  if (!SUPPORTED.includes(mediaType)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${mediaType}` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  let probe1: number | null = null;
  let probe2: number | null = null;
  try {
    const result = await extractProbeTemps(base64, mediaType);
    probe1 = result.probe1;
    probe2 = result.probe2;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vision read failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Best-effort photo storage — a missing token shouldn't block the read.
  let photoUrl: string | null = null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const ext = mediaType.split("/")[1] ?? "jpg";
      const blob = await put(
        `sessions/${params.id}/${Date.now()}.${ext}`,
        buffer,
        { access: "public", contentType: mediaType }
      );
      photoUrl = blob.url;
    } catch {
      photoUrl = null;
    }
  }

  const { grateTemp, meatTemp } = mapProbesToRoles(
    probe1,
    probe2,
    session.probe1Role as ProbeRole,
    session.probe2Role as ProbeRole
  );

  return NextResponse.json(
    { grateTemp, meatTemp, photoUrl, raw: { probe1, probe2 } },
    { status: 200 }
  );
}

function numOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
