import Anthropic from "@anthropic-ai/sdk";

export type SupportedMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export interface ProbeReading {
  // Raw values as read off the two physical probe channels (Probe 1 / Probe 2).
  probe1: number | null;
  probe2: number | null;
}

const SYSTEM_PROMPT = `You are reading a photo of a wireless BBQ thermometer receiver \
(e.g. a ThermoWorks Smoke). The device shows two probe channels. The larger receiver \
labels them "PROBE 1" and "PROBE 2"; some units label them "CH1"/"CH2". Each channel \
shows one large current temperature, often with smaller LOW ALARM / HIGH ALARM values \
beneath it — IGNORE the alarm values, read only the large current temperature.

Return ONLY a JSON object, no prose, in exactly this shape:
{"probe1": <number or null>, "probe2": <number or null>}

Rules:
- Use the big current reading for each channel (e.g. 141.5, 254.7). Include decimals if shown.
- Values are in Fahrenheit; return the number only, no degree symbol or unit.
- If a channel is blank, shows dashes, or you cannot read it confidently, return null for it.
- Never guess an alarm threshold as the reading.`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local to enable photo reading."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Send a receiver photo to Claude and extract the two probe temperatures.
 * Returns raw probe1/probe2 numbers; the caller maps them to grate/meat using
 * the session's probe role assignment.
 */
export async function extractProbeTemps(
  base64Image: string,
  mediaType: SupportedMediaType
): Promise<ProbeReading> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: "text",
            text: "Read the two probe temperatures from this receiver photo.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  return parseProbeJson(text);
}

/** Extract the JSON object from Claude's reply, tolerating markdown fences. */
export function parseProbeJson(text: string): ProbeReading {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return { probe1: null, probe2: null };
  }
  try {
    const parsed = JSON.parse(match[0]);
    return {
      probe1: toNumberOrNull(parsed.probe1),
      probe2: toNumberOrNull(parsed.probe2),
    };
  } catch {
    return { probe1: null, probe2: null };
  }
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
