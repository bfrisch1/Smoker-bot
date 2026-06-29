"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { BackHeader } from "@/components/BackHeader";
import { MeatIcon } from "@/components/MeatIcon";
import { CUT_TYPES, CUT_LABELS } from "@/lib/types";
import type { CutType, ProbeRole } from "@/lib/types";

export default function NewCookPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cut, setCut] = useState<CutType | null>(null);
  const [probe1Role, setProbe1Role] = useState<ProbeRole>("grate");
  const [probe2Role, setProbe2Role] = useState<ProbeRole>("meat");
  const [showAll, setShowAll] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleCuts = showAll ? CUT_TYPES : CUT_TYPES.slice(0, 5);
  const canSubmit = name.trim().length > 0 && cut !== null && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !cut) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          cutType: cut,
          probe1Role,
          probe2Role,
        }),
      });
      if (!res.ok) {
        throw new Error("Could not start the cook. Try again.");
      }
      const session = await res.json();
      router.push(`/sessions/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      footer={
        <button
          className="btn-stamp w-full"
          style={{ fontSize: 13, padding: 14 }}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting ? "LIGHTING…" : "LIGHT THE FIRE →"}
        </button>
      }
    >
      <BackHeader href="/" title="New Cook" />

      <div className="flex-1 px-4 pb-6 pt-4">
        {/* Step 1: name */}
        <StepLabel>1 · NAME YOUR COOK</StepLabel>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sunday Brisket"
          className="font-body w-full text-ink"
          style={{
            background: "#F5EBD2",
            border: "1px solid #cdb789",
            borderBottom: "2px solid #2B1D10",
            borderRadius: 2,
            padding: "11px 12px",
            fontSize: 15,
            outline: "none",
            caretColor: "#A8321F",
          }}
        />

        {/* Step 2: cut */}
        <StepLabel style={{ marginTop: 18 }}>2 · SELECT THE CUT</StepLabel>
        <div className="grid grid-cols-3" style={{ gap: 8 }}>
          {visibleCuts.map((c) => {
            const selected = cut === c;
            return (
              <button
                key={c}
                onClick={() => setCut(c)}
                className="text-center"
                style={{
                  background: selected ? "#fdf6e6" : "#F5EBD2",
                  border: selected
                    ? "2px solid #A8321F"
                    : "1px solid #cdb789",
                  borderRadius: 4,
                  padding: "8px 2px",
                  boxShadow: selected
                    ? "0 0 0 3px rgba(168,50,31,.12)"
                    : "none",
                  cursor: "pointer",
                }}
              >
                <MeatIcon cut={c} size={40} className="mx-auto" />
                <div
                  className="font-mono"
                  style={{
                    fontSize: 8,
                    color: selected ? "#A8321F" : "#5A4530",
                    fontWeight: selected ? 700 : 400,
                    marginTop: 2,
                  }}
                >
                  {CUT_LABELS[c]}
                </div>
              </button>
            );
          })}
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-center"
              style={{
                background: "#F5EBD2",
                border: "1px solid #cdb789",
                borderRadius: 4,
                padding: "8px 2px",
                color: "#b09a6e",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 26, lineHeight: "40px" }}>⋯</div>
              <div className="font-mono" style={{ fontSize: 8 }}>
                MORE
              </div>
            </button>
          )}
        </div>

        {/* Step 3: probes */}
        <StepLabel style={{ marginTop: 18 }}>3 · ASSIGN PROBES</StepLabel>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <ProbeRow
            tag="P1"
            label="Probe One"
            role={probe1Role}
            onToggle={() =>
              setProbe1Role((r) => (r === "grate" ? "meat" : "grate"))
            }
          />
          <ProbeRow
            tag="P2"
            label="Probe Two"
            role={probe2Role}
            onToggle={() =>
              setProbe2Role((r) => (r === "grate" ? "meat" : "grate"))
            }
          />
        </div>

        {error && (
          <p
            className="font-mono"
            style={{ color: "#A8321F", fontSize: 11, marginTop: 14 }}
          >
            {error}
          </p>
        )}
      </div>
    </AppShell>
  );
}

function StepLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="font-mono text-red-ink"
      style={{ fontSize: 10, letterSpacing: "1px", margin: "0 0 9px", ...style }}
    >
      {children}
    </div>
  );
}

function ProbeRow({
  tag,
  label,
  role,
  onToggle,
}: {
  tag: string;
  label: string;
  role: ProbeRole;
  onToggle: () => void;
}) {
  const isGrate = role === "grate";
  return (
    <div
      className="flex items-center rounded-standard border border-border bg-card"
      style={{ gap: 10, padding: "10px 12px" }}
    >
      <span className="font-mono text-muted" style={{ fontSize: 9 }}>
        {tag}
      </span>
      <span className="font-body flex-1 text-ink" style={{ fontSize: 14 }}>
        {label}
      </span>
      <button
        onClick={onToggle}
        className="font-mono"
        style={{
          fontSize: 10,
          color: isGrate ? "#3F6F7A" : "#A8321F",
          background: isGrate ? "#eef0e6" : "#f6e7e2",
          border: `1px solid ${isGrate ? "#a9c2c4" : "#d8b3a6"}`,
          borderRadius: 20,
          padding: "5px 11px",
          cursor: "pointer",
        }}
      >
        {isGrate ? "GRATE" : "MEAT"} ▾
      </button>
    </div>
  );
}
