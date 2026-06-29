"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Reading } from "@/lib/schema";
import { formatTime, formatElapsed } from "@/lib/format";

interface ReadingUploaderProps {
  sessionId: string;
  startedAt: number;
  mode: "photo" | "manual";
  onSaved: (reading: Reading) => void;
  onClose: () => void;
}

type Stage = "input" | "reading" | "confirm" | "saving";

interface ReadResult {
  grateTemp: number | null;
  meatTemp: number | null;
  photoUrl: string | null;
}

/**
 * Full-screen Snap & Confirm flow. Photo mode: pick/capture a receiver photo,
 * Claude reads the two temps, user corrects, confirm drops them on the graph.
 * Manual mode: type the two temps directly.
 */
export function ReadingUploader({
  sessionId,
  startedAt,
  mode,
  onSaved,
  onClose,
}: ReadingUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>(mode === "manual" ? "confirm" : "input");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ReadResult>({
    grateTemp: null,
    meatTemp: null,
    photoUrl: null,
  });
  const [grateInput, setGrateInput] = useState("");
  const [meatInput, setMeatInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setStage("reading");

    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/readings`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not read the photo.");
      }
      const data: ReadResult = await res.json();
      setResult(data);
      setGrateInput(data.grateTemp != null ? String(data.grateTemp) : "");
      setMeatInput(data.meatTemp != null ? String(data.meatTemp) : "");
      setStage("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Read failed.");
      setStage("input");
    }
  }

  async function handleSave() {
    const grateTemp = parseInput(grateInput);
    const meatTemp = parseInput(meatInput);
    if (grateTemp === null && meatTemp === null) {
      setError("Enter at least one temperature.");
      return;
    }
    setStage("saving");
    setError(null);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grateTemp,
          meatTemp,
          source: mode,
          photoUrl: result.photoUrl,
        }),
      });
      if (!res.ok) throw new Error("Could not save the reading.");
      onSaved(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setStage("confirm");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center"
      style={{ background: "rgba(28,23,18,0.55)" }}
    >
      <div className="grain relative flex w-full max-w-[440px] flex-col bg-parchment">
        <div className="relative z-10 flex flex-1 flex-col">
          {/* header */}
          <div
            className="flex items-center"
            style={{ gap: 10, padding: "14px 16px 12px", borderBottom: "1px solid #cdb789" }}
          >
            <button
              onClick={onClose}
              style={{ fontSize: 17, color: "#2B1D10", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕
            </button>
            <span className="font-display" style={{ fontSize: 15, color: "#2B1D10" }}>
              {mode === "manual" ? "Enter Temps" : "Reading Photo"}
            </span>
          </div>

          <div className="scr flex-1 overflow-auto p-4">
            {/* photo preview / receiver mock */}
            {mode === "photo" && (
              <div
                className="overflow-hidden rounded-standard border border-border"
                style={{ boxShadow: "0 2px 6px rgba(43,29,16,.18)", marginBottom: 16 }}
              >
                {preview ? (
                  <div style={{ position: "relative", width: "100%", height: 200, background: "#1d1f1b" }}>
                    <Image src={preview} alt="receiver" fill style={{ objectFit: "contain" }} unoptimized />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center font-body italic"
                    style={{ height: 160, background: "#ece0c2", color: "#8a7350", fontSize: 13 }}
                  >
                    Your receiver photo appears here
                  </div>
                )}
                <div
                  className="font-mono text-center"
                  style={{ background: "#ece0c2", fontSize: 8, color: "#8a7350", padding: 5 }}
                >
                  📷 RECEIVER PHOTO · {formatTime(Date.now())}
                </div>
              </div>
            )}

            {stage === "reading" && (
              <p className="font-body italic text-center text-red-ink" style={{ fontSize: 13 }}>
                Reading the smoke signals…
              </p>
            )}

            {(stage === "confirm" || stage === "saving") && (
              <>
                {mode === "photo" && (
                  <div className="flex items-center" style={{ gap: 8, margin: "4px 0 10px" }}>
                    <span className="font-mono text-red-ink" style={{ fontSize: 10, letterSpacing: "1px" }}>
                      ✓ WE READ
                    </span>
                    <span style={{ flex: 1, height: 1, background: "#cdb789" }} />
                    <span className="font-mono text-muted" style={{ fontSize: 8 }}>
                      tap to correct
                    </span>
                  </div>
                )}

                <div className="flex" style={{ gap: 9 }}>
                  <EditableTempTile
                    role="grate"
                    label="GRATE · P1"
                    value={grateInput}
                    onChange={setGrateInput}
                  />
                  <EditableTempTile
                    role="meat"
                    label="MEAT · P2"
                    value={meatInput}
                    onChange={setMeatInput}
                  />
                </div>

                <div
                  className="flex items-center rounded-standard border border-border bg-card"
                  style={{ gap: 8, padding: "9px 12px", marginTop: 10 }}
                >
                  <span className="font-mono text-muted" style={{ fontSize: 9 }}>
                    LOGGED AT
                  </span>
                  <span className="font-mono flex-1 text-ink" style={{ fontSize: 13 }}>
                    {formatTime(Date.now())}
                  </span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#B8893C" }}>
                    +{formatElapsed(startedAt).slice(0, 5)} elapsed
                  </span>
                </div>

                <p
                  className="font-body italic text-center text-muted-dark"
                  style={{ fontSize: 12, marginTop: 10 }}
                >
                  &ldquo;Numbers look right? Confirm to drop them on the graph.&rdquo;
                </p>
              </>
            )}

            {error && (
              <p className="font-mono text-center" style={{ color: "#A8321F", fontSize: 11, marginTop: 12 }}>
                {error}
              </p>
            )}
          </div>

          {/* footer */}
          <div className="flex flex-col items-center p-4" style={{ gap: 6 }}>
            {stage === "input" && mode === "photo" && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <button
                  className="btn-stamp w-full"
                  style={{ fontSize: 13, padding: 14 }}
                  onClick={() => fileRef.current?.click()}
                >
                  📷 CHOOSE / TAKE PHOTO
                </button>
              </>
            )}

            {(stage === "confirm" || stage === "saving") && (
              <>
                <button
                  className="btn-stamp w-full"
                  style={{ fontSize: 13, padding: 14 }}
                  disabled={stage === "saving"}
                  onClick={handleSave}
                >
                  {stage === "saving" ? "ADDING…" : "ADD TO GRAPH ✓"}
                </button>
                {mode === "photo" && (
                  <button
                    onClick={() => {
                      setStage("input");
                      setPreview(null);
                      setError(null);
                    }}
                    className="font-body italic text-red-ink"
                    style={{ fontSize: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                  >
                    retake photo
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableTempTile({
  role,
  label,
  value,
  onChange,
}: {
  role: "grate" | "meat";
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const color = role === "grate" ? "#3F6F7A" : "#A8321F";
  const bg = role === "grate" ? "#eef0e6" : "#f6e7e2";
  const border = role === "grate" ? "#a9c2c4" : "#d8b3a6";
  return (
    <div
      className="flex-1 rounded-standard"
      style={{ background: bg, border: `1px solid ${border}`, borderBottom: `2px solid ${color}`, padding: 10 }}
    >
      <div className="font-mono" style={{ fontSize: 8, color, letterSpacing: "1px" }}>
        {label}
      </div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="font-mono w-full"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color,
          background: "transparent",
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
    </div>
  );
}

function parseInput(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}
