"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import { findings } from "@/content/proof";
import type { Confidence } from "@/content/types";

/**
 * Interactive view of the gated-attention study.
 *
 * Three parts, in the order a reader needs them:
 *   1. What a gate even is and where it sits, because nothing else lands
 *      without that. Toggling it open is the study's central intervention.
 *   2. The two headline measurements.
 *   3. Every finding with its confidence grade, including the low one.
 *
 * The findings table used to live in the Method section. It belongs with the
 * project that produced it; having it in both places was the same duplication
 * problem as AI Accountant appearing twice.
 *
 * Every number here traces to the repository README. Nothing is interpolated.
 */

const CONFIDENCE_STEPS: Record<Confidence, number> = {
  high: 4,
  "moderate-high": 3,
  moderate: 2,
  low: 1,
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "High",
  "moderate-high": "Mod-high",
  moderate: "Moderate",
  low: "Low",
};

function ConfidenceMeter({ level }: { level: Confidence }) {
  const filled = CONFIDENCE_STEPS[level];
  return (
    <span className="inline-flex items-center gap-2" title={CONFIDENCE_LABEL[level]}>
      <span aria-hidden="true" className="flex gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={
              i < filled
                ? level === "low"
                  ? "block h-3 w-1 bg-accent-dim"
                  : "block h-3 w-1 bg-accent"
                : "block h-3 w-1 bg-ink-500"
            }
          />
        ))}
      </span>
      <Label className="whitespace-nowrap">{CONFIDENCE_LABEL[level]}</Label>
    </span>
  );
}

/** The attention block, with the gate the paper adds highlighted. */
function GateDiagram({ open }: { open: boolean }) {
  const gate = open ? "var(--paper-faint)" : "var(--accent)";

  return (
    <svg
      viewBox="0 0 460 132"
      className="h-auto w-full"
      role="img"
      aria-label={
        open
          ? "Attention block with the sigmoid gate forced open, so attention output passes through unchanged"
          : "Attention block with a trained sigmoid gate multiplying the attention output elementwise"
      }
    >
      {[
        { x: 4, w: 74, label: "Q K V" },
        { x: 104, w: 96, label: "softmax(QKᵀ)V" },
      ].map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={38}
            width={b.w}
            height={40}
            rx={3}
            fill="var(--ink-700)"
            stroke="var(--ink-500)"
          />
          <text
            x={b.x + b.w / 2}
            y={60}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--paper-dim)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11 }}
          >
            {b.label}
          </text>
        </g>
      ))}

      {/* The gate */}
      <rect
        x={228}
        y={38}
        width={92}
        height={40}
        rx={3}
        fill={open ? "var(--ink-700)" : "var(--accent-ghost)"}
        stroke={gate}
        strokeDasharray={open ? "4 3" : undefined}
      />
      <text
        x={274}
        y={53}
        textAnchor="middle"
        fill={gate}
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11 }}
      >
        {open ? "gate = 1" : "⊙ σ(gate)"}
      </text>
      <text
        x={274}
        y={68}
        textAnchor="middle"
        fill="var(--paper-faint)"
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
      >
        {open ? "forced open" : "as trained"}
      </text>

      <rect x={348} y={38} width={100} height={40} rx={3} fill="var(--ink-700)" stroke="var(--ink-500)" />
      <text
        x={398}
        y={60}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--paper-dim)"
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11 }}
      >
        output
      </text>

      {[
        [78, 104],
        [200, 228],
        [320, 348],
      ].map(([x1, x2]) => (
        <line
          key={x1}
          x1={x1}
          y1={58}
          x2={x2}
          y2={58}
          stroke="var(--ink-500)"
          strokeWidth={1}
          markerEnd="url(#arw)"
        />
      ))}
      <defs>
        <marker id="arw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-500)" />
        </marker>
      </defs>

      <text
        x={274}
        y={16}
        textAnchor="middle"
        fill="var(--paper-faint)"
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9, letterSpacing: "0.14em" }}
      >
        FORWARD HOOK ATTACHES HERE
      </text>
      <line x1={274} y1={22} x2={274} y2={36} stroke="var(--ink-500)" strokeDasharray="2 2" />
    </svg>
  );
}

export function GatedAttentionExplorer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-sm border border-ink-600 bg-ink-800 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Label as="h4">The intervention</Label>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-pressed={open}
          className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
            open
              ? "border-accent bg-accent text-on-accent"
              : "border-ink-500 text-paper-dim hover:border-accent hover:text-paper"
          }`}
        >
          {open ? "Gate forced open" : "Gate as trained"}
        </button>
      </div>

      <div className="mt-6">
        <GateDiagram open={open} />
      </div>

      <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-paper-dim">
        {open
          ? "Override the gate to 1 and the attention output passes straight through. Doing this one layer at a time is how the study measures what each gate was contributing. At layer 0 the model falls apart; everywhere else it barely notices."
          : "A sigmoid gate multiplies the attention output elementwise. The paper shows this helps. It does not say what the trained gates end up doing, so I attached PyTorch forward hooks and measured them over 25,600 WikiText-2 tokens."}
      </p>

      {/* Headline measurements */}
      <dl className="mt-8 grid gap-6 border-t border-ink-600 pt-6 sm:grid-cols-2">
        <div>
          <dd className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-accent tabular-nums">
            99.8%
          </dd>
          <dt className="mt-2">
            <Label>Of all ablation damage comes from layer 0 alone</Label>
          </dt>
        </div>
        <div>
          <dd className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-accent tabular-nums">
            48.3%
          </dd>
          <dt className="mt-2">
            <Label>Of gate dimensions are stably suppressed, 54.8% dynamic</Label>
          </dt>
        </div>
      </dl>

      {/* Findings, graded */}
      <div className="mt-8 border-t border-ink-600 pt-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <Label as="h4">Every finding, with how far it can be pushed</Label>
          <Label>25,600 tokens</Label>
        </div>

        <ul>
          {findings.map((f) => (
            <li
              key={f.claim}
              className="grid gap-2 border-b border-ink-600 py-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-start md:gap-8"
            >
              <div>
                <p className="text-sm leading-snug text-paper">{f.claim}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-paper-faint">
                  {f.evidence}
                </p>
              </div>
              <div className="md:pt-0.5">
                <ConfidenceMeter level={f.confidence} />
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-[62ch] text-xs leading-relaxed text-paper-faint">
          The last row is graded low and published anyway. One dataset, no
          retraining, no other benchmarks, so it stays low until that changes.
        </p>
      </div>
    </div>
  );
}
