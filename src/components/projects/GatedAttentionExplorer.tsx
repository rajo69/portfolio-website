"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import { findings } from "@/content/proof";
import {
  architectural,
  baseline,
  bestFixed,
  discontinuity,
  gateSweep,
  headAblation,
  layerAblation,
  layerTail,
  layerZeroShare,
  setup,
  sink,
  sinkBaseline,
  type SinkCondition,
} from "@/content/data/gates";
import type { Confidence } from "@/content/types";

/**
 * Interactive view of the gated-attention study.
 *
 * EARLIER VERSION WAS THINNER. It had a single boolean, gate open or gate as
 * trained, driving a diagram and a paragraph. That described the intervention
 * without letting anyone perform it, and the repository holds four experiments
 * worth of measurements the page was not using.
 *
 * Three instruments now, one per question the study actually asks:
 *   1. Ablate. Force one layer's gates open and read the damage. This is where
 *      layer 0 stops being a statistic and becomes obvious.
 *   2. Sweep. Clamp every gate to a fixed value. Shows the sweet spot is
 *      narrow and that the model minds too-open far more than too-closed.
 *   3. Sink. The null result, kept visible rather than buried, because the
 *      hypothesis failing is the most honest thing here.
 *
 * The graded findings table stays under all three. Publishing the rows graded
 * low is the part that is hard to fake.
 *
 * Every number is imported from content/data/gates.ts, which carries the
 * experiment number it came from. Where the source is approximate, so is the
 * label. Layers 5 to 27 are a band because the source reports a range.
 */

type View = "ablate" | "sweep" | "sink";

function fmt(n: number, dp = 0): string {
  const fixed = Math.abs(n).toFixed(dp);
  const [int, dec] = fixed.split(".");
  return `${n < 0 ? "-" : ""}${int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${dec ? `.${dec}` : ""}`;
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-full border border-line p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 motion-reduce:transition-none ${
            value === o.value ? "bg-accent text-on-accent" : "text-paper-faint hover:text-paper"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 1: ablate a layer
 * ---------------------------------------------------------------- */

const AW = 760;
const AH = 210;
const APAD = { l: 46, r: 14, t: 14, b: 26 };

const lg = (v: number) => Math.log10(v);
const A_MIN = lg(baseline.ppl);
const A_MAX = lg(layerAblation[0].ppl);

const aY = (ppl: number) =>
  APAD.t + (1 - (lg(ppl) - A_MIN) / (A_MAX - A_MIN)) * (AH - APAD.t - APAD.b);

const SLOT = (AW - APAD.l - APAD.r) / setup.layers;
const aX = (layer: number) => APAD.l + layer * SLOT;

type Selection = { kind: "layer"; layer: number } | { kind: "tail" };

function AblateView() {
  const [sel, setSel] = useState<Selection>({ kind: "layer", layer: 0 });

  const chosen = sel.kind === "layer" ? layerAblation.find((l) => l.layer === sel.layer)! : null;
  const gridPpl = [100, 10000, 100000];

  return (
    <div>
      <p className="max-w-[62ch] text-sm leading-relaxed text-paper-dim">
        Each layer&apos;s gates were forced fully open, one layer at a time, and
        perplexity remeasured. Pick a layer along the axis. The scale is
        logarithmic, because a linear one renders all 28 layers except the first
        as a flat line.
      </p>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${AW} ${AH}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label={`Perplexity after forcing each layer's gates open. Layer 0 reaches roughly 148,419 against a learned-gate baseline of ${baseline.ppl}, accounting for ${layerZeroShare}% of all ablation damage.`}
        >
          {gridPpl.map((g) => (
            <g key={g}>
              <line x1={APAD.l} y1={aY(g)} x2={AW - APAD.r} y2={aY(g)} stroke="var(--line)" />
              <text
                x={APAD.l - 7}
                y={aY(g)}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--paper-faint)"
                style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
              >
                {g >= 1000 ? `${g / 1000}k` : g}
              </text>
            </g>
          ))}

          {/* Learned gates, the floor everything is measured against. */}
          <line
            x1={APAD.l}
            y1={aY(baseline.ppl)}
            x2={AW - APAD.r}
            y2={aY(baseline.ppl)}
            stroke="var(--series-2)"
            strokeDasharray="4 3"
          />
          <text
            x={AW - APAD.r}
            y={aY(baseline.ppl) - 6}
            textAnchor="end"
            fill="var(--series-2)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
          >
            learned {baseline.ppl}
          </text>

          {/* Layers 5 to 27: a band, because the source gives a range not values.
              On a log scale up to 148k that band is a couple of pixels tall,
              which is the honest picture but an impossible click target, so a
              transparent full-height rect carries the hit testing. */}
          <g
            className="cursor-pointer"
            onClick={() => setSel({ kind: "tail" })}
            onPointerEnter={() => setSel({ kind: "tail" })}
          >
            <rect
              x={aX(layerTail.from)}
              y={APAD.t}
              width={SLOT * (layerTail.to - layerTail.from + 1)}
              height={AH - APAD.t - APAD.b}
              fill="transparent"
            />
            <rect
              x={aX(layerTail.from)}
              y={aY(layerTail.pplHigh)}
              width={SLOT * (layerTail.to - layerTail.from + 1)}
              height={Math.max(aY(layerTail.pplLow) - aY(layerTail.pplHigh), 3)}
              fill={sel.kind === "tail" ? "var(--accent)" : "var(--ink-500)"}
            />
          </g>

          {layerAblation.map((l) => {
            const active = sel.kind === "layer" && sel.layer === l.layer;
            return (
              <g
                key={l.layer}
                className="cursor-pointer"
                onClick={() => setSel({ kind: "layer", layer: l.layer })}
                onPointerEnter={() => setSel({ kind: "layer", layer: l.layer })}
              >
                <rect x={aX(l.layer)} y={APAD.t} width={SLOT} height={AH - APAD.t - APAD.b} fill="transparent" />
                <rect
                  x={aX(l.layer) + 1.5}
                  y={aY(l.ppl)}
                  width={SLOT - 3}
                  height={aY(baseline.ppl) - aY(l.ppl)}
                  fill={active ? "var(--accent)" : "var(--series-1)"}
                />
              </g>
            );
          })}

          {[0, 5, 13, 20, 27].map((l) => (
            <text
              key={l}
              x={aX(l) + SLOT / 2}
              y={AH - APAD.b + 15}
              textAnchor="middle"
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
            >
              {l}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
        <div>
          <Label>{chosen ? `Layer ${chosen.layer} opened` : `Layers ${layerTail.from} to ${layerTail.to}`}</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">
            {chosen ? `PPL ~${fmt(chosen.ppl)}` : `PPL ~${layerTail.pplLow} to ${layerTail.pplHigh}`}
          </p>
        </div>
        <div>
          <Label>Change from learned</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">
            {chosen ? `+${fmt(chosen.delta)}` : `under +${layerTail.deltaMax} each`}
          </p>
        </div>
        <div>
          <Label>Share of all damage</Label>
          <p className="mt-1.5 font-mono text-sm text-accent">
            {chosen?.layer === 0 ? `${layerZeroShare}%` : "negligible"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-paper-dim">
        {sel.kind === "tail"
          ? layerTail.note
          : chosen?.layer === 0
            ? `Layer 0 is in a category of its own. Cook's distance is ${discontinuity.cooksD} against a threshold of ${discontinuity.cooksThreshold}, so it is not an extreme point on a trend, it is off the trend. It is not one bottleneck head either: opening all ${headAblation.tested / 3} heads in layer 0 costs +${fmt(headAblation.allHeadsLayer0)} perplexity, while killing the single most important one, head ${headAblation.mostCritical.head}, costs +${headAblation.mostCritical.delta}. The sensitivity is collective. The control experiment matters too: the ungated baseline puts ${architectural.baselineShare}% of its sensitivity at layer 0 against ${architectural.gatedShare}% for the gated model, so the concentration is architectural and gating actually reduces it.`
            : `Damage falls off a cliff after layer 0. Layers 0 to 2 account for almost everything, and from layer 6 onward opening the gates barely registers against a baseline of ${baseline.ppl}.`}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 2: sweep the gate value
 * ---------------------------------------------------------------- */

const SW = 760;
const SH = 220;
const SPAD = { l: 46, r: 16, t: 16, b: 30 };

const S_MIN = lg(baseline.ppl);
const S_MAX = lg(Math.max(...gateSweep.map((p) => p.ppl)));
const sX = (v: number) => SPAD.l + v * (SW - SPAD.l - SPAD.r);
const sY = (ppl: number) =>
  SPAD.t + (1 - (lg(ppl) - S_MIN) / (S_MAX - S_MIN)) * (SH - SPAD.t - SPAD.b);

function SweepView() {
  const [i, setI] = useState(3); // 0.15, the best fixed value
  const pt = gateSweep[i];
  const multiple = pt.ppl / baseline.ppl;

  return (
    <div>
      <p className="max-w-[62ch] text-sm leading-relaxed text-paper-dim">
        Instead of opening gates, clamp every one of them to the same fixed
        value. If the gates were only setting an overall sparsity level, some
        constant would match them. Drag across the eight measured values.
      </p>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label={`Perplexity against fixed gate value. The best constant, ${bestFixed.value}, reaches ${bestFixed.ppl} against ${baseline.ppl} for the learned gates.`}
        >
          {[100, 10000, 100000].map((g) => (
            <g key={g}>
              <line x1={SPAD.l} y1={sY(g)} x2={SW - SPAD.r} y2={sY(g)} stroke="var(--line)" />
              <text
                x={SPAD.l - 7}
                y={sY(g)}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--paper-faint)"
                style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
              >
                {g >= 1000 ? `${g / 1000}k` : g}
              </text>
            </g>
          ))}

          <line
            x1={SPAD.l}
            y1={sY(baseline.ppl)}
            x2={SW - SPAD.r}
            y2={sY(baseline.ppl)}
            stroke="var(--series-2)"
            strokeDasharray="4 3"
          />
          <text
            x={SW - SPAD.r}
            y={sY(baseline.ppl) - 6}
            textAnchor="end"
            fill="var(--series-2)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
          >
            learned gates {baseline.ppl}
          </text>

          <path
            d={gateSweep.map((p, k) => `${k === 0 ? "M" : "L"}${sX(p.value)},${sY(p.ppl)}`).join("")}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={2}
          />

          {gateSweep.map((p, k) => (
            <circle
              key={p.value}
              cx={sX(p.value)}
              cy={sY(p.ppl)}
              r={k === i ? 5 : 3}
              fill={k === i ? "var(--accent)" : "var(--series-1)"}
              className="cursor-pointer"
              onPointerEnter={() => setI(k)}
              onClick={() => setI(k)}
            />
          ))}

          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <text
              key={v}
              x={sX(v)}
              y={SH - SPAD.b + 16}
              textAnchor="middle"
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
            >
              {v.toFixed(2)}
            </text>
          ))}
          <text
            x={SPAD.l}
            y={SH - 3}
            fill="var(--paper-faint)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9, letterSpacing: "0.12em" }}
          >
            FIXED GATE VALUE
          </text>
        </svg>
      </div>

      <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
        <div>
          <Label>Gate clamped to</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">{pt.value.toFixed(2)}</p>
        </div>
        <div>
          <Label>Perplexity</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">{fmt(pt.ppl, pt.ppl < 1000 ? 2 : 0)}</p>
        </div>
        <div>
          <Label>Times worse than learned</Label>
          <p className="mt-1.5 font-mono text-sm text-accent">
            {multiple < 100 ? `${multiple.toFixed(1)}x` : `${fmt(multiple)}x`}
          </p>
        </div>
      </div>

      {/* Deliberately below the readout, not under the chart. The measured
          values are unevenly spaced, so a track sitting against a value-scaled
          x axis reads as an axis and lies about where the steps are. */}
      <label className="mt-5 flex items-center gap-4">
        <span className="shrink-0">
          <Label>Step through</Label>
        </span>
        <input
          type="range"
          min={0}
          max={gateSweep.length - 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="h-1 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-ink-600 accent-accent"
          aria-label="Step through the eight measured fixed gate values"
        />
      </label>

      <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-paper-dim">
        The sweet spot is narrow and off-centre. {bestFixed.value} is the best
        constant available and it is still {bestFixed.gapToLearned} perplexity
        worse than the learned gates, which is the cost of throwing away the
        token-by-token pattern. The damage is also lopsided: moving from{" "}
        {bestFixed.value} to 0.30 costs roughly 9,300 perplexity, moving to 0.10
        costs roughly 500. The model minds gates being too open far more than
        too closed.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 3: the attention sink null result
 * ---------------------------------------------------------------- */

function GateDiagram({ forced }: { forced: boolean }) {
  const gate = forced ? "var(--paper-faint)" : "var(--accent)";

  return (
    <svg
      viewBox="0 0 460 100"
      className="h-auto w-full"
      role="img"
      aria-label={
        forced
          ? "Attention block with the sigmoid gate forced open, so attention output passes through unchanged"
          : "Attention block with a trained sigmoid gate multiplying the attention output elementwise"
      }
    >
      {[
        { x: 4, w: 74, label: "Q K V" },
        { x: 104, w: 96, label: "softmax(QKᵀ)V" },
      ].map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={30} width={b.w} height={40} rx={3} fill="var(--ink-700)" stroke="var(--ink-500)" />
          <text
            x={b.x + b.w / 2}
            y={52}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--paper-dim)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11 }}
          >
            {b.label}
          </text>
        </g>
      ))}

      <rect
        x={228}
        y={30}
        width={92}
        height={40}
        rx={3}
        fill={forced ? "var(--ink-700)" : "var(--accent-ghost)"}
        stroke={gate}
        strokeDasharray={forced ? "4 3" : undefined}
      />
      <text
        x={274}
        y={45}
        textAnchor="middle"
        fill={gate}
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11 }}
      >
        {forced ? "gate = 1" : "⊙ σ(gate)"}
      </text>
      <text
        x={274}
        y={60}
        textAnchor="middle"
        fill="var(--paper-faint)"
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9 }}
      >
        {forced ? "forced open" : "as trained"}
      </text>

      <rect x={348} y={30} width={100} height={40} rx={3} fill="var(--ink-700)" stroke="var(--ink-500)" />
      <text
        x={398}
        y={52}
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
        <line key={x1} x1={x1} y1={50} x2={x2} y2={50} stroke="var(--ink-500)" strokeWidth={1} markerEnd="url(#arw)" />
      ))}
      <defs>
        <marker id="arw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-500)" />
        </marker>
      </defs>

      <text
        x={274}
        y={12}
        textAnchor="middle"
        fill="var(--paper-faint)"
        style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 9, letterSpacing: "0.14em" }}
      >
        FORWARD HOOK ATTACHES HERE
      </text>
      <line x1={274} y1={17} x2={274} y2={28} stroke="var(--ink-500)" strokeDasharray="2 2" />
    </svg>
  );
}

function SinkView() {
  const [key, setKey] = useState<SinkCondition["key"]>("learned");
  const cond = sink.find((s) => s.key === key)!;

  const rows = [
    ...sink.map((s) => ({ label: s.short, v: s.attention, active: s.key === key, ref: false })),
    { label: sinkBaseline.label, v: sinkBaseline.attention, active: false, ref: true },
  ];
  const max = sinkBaseline.attention;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[46ch] text-sm leading-relaxed text-paper-dim">
          Gating removes the attention sink. Is layer 0, the most aggressively
          gated layer, what does it?
        </p>
        <Segmented
          label="Intervention"
          value={key}
          onChange={setKey}
          options={sink.map((s) => ({ value: s.key, label: s.short }))}
        />
      </div>

      {/* Capped, because at full card width the 460 unit viewBox scales the
          11px labels up to roughly 30px and the diagram shouts. */}
      <div className="mt-6 max-w-[560px]">
        <GateDiagram forced={key !== "learned"} />
      </div>

      <div className="mt-7 space-y-2.5">
        <Label as="h5">Mean first-token attention</Label>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[9.5rem_1fr_3.5rem] items-center gap-3">
            <Label className={r.active ? "text-paper" : undefined}>{r.label}</Label>
            <div className="h-3 rounded-sm bg-ink-700">
              <div
                className="h-full rounded-sm transition-[width] duration-500 motion-reduce:transition-none"
                style={{
                  width: `${Math.max((r.v / max) * 100, 0.8)}%`,
                  background: r.ref
                    ? "var(--ink-500)"
                    : r.active
                      ? "var(--accent)"
                      : "var(--series-1)",
                }}
              />
            </div>
            <span className="text-right font-mono text-xs text-paper tabular-nums">
              {r.v.toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-paper-dim">{cond.blurb}</p>

      <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-paper-faint">
        The prediction was that the bar would move right, toward the ungated{" "}
        {sinkBaseline.attention}. It moves left. That does not contradict the
        paper, whose claim is at system level, but it does rule out the tidy
        localised explanation. Caveat carried from the source: this measures
        attention weights, not gate scores.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Findings
 * ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- *
 * Shell
 * ---------------------------------------------------------------- */

const TITLE: Record<View, string> = {
  ablate: "Open one layer's gates",
  sweep: "Replace the gates with a constant",
  sink: "The hypothesis that failed",
};

export function GatedAttentionExplorer() {
  const [view, setView] = useState<View>("ablate");

  return (
    <div className="surface rounded-lg p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Label as="h4">{TITLE[view]}</Label>
        <Segmented
          label="Experiment"
          value={view}
          onChange={setView}
          options={[
            { value: "ablate", label: "Ablate" },
            { value: "sweep", label: "Sweep" },
            { value: "sink", label: "Sink" },
          ]}
        />
      </div>

      <div className="mt-7">
        {view === "ablate" ? <AblateView /> : view === "sweep" ? <SweepView /> : <SinkView />}
      </div>

      {/* No headline stat row here. The block's own three numbers sit directly
          under this card, and repeating 99.8% and 48.3% inside it both
          duplicated them and blew the accent budget on one screenful. What the
          gates look like at rest is in the findings table instead. */}

      {/* Findings, graded */}
      <div className="mt-8 border-t border-line pt-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <Label as="h4">Every finding, with how far it can be pushed</Label>
          <Label>{fmt(setup.evalTokens)} tokens</Label>
        </div>

        <ul>
          {findings.map((f) => (
            <li
              key={f.claim}
              className="grid gap-2 border-b border-line py-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-start md:gap-8"
            >
              <div>
                <p className="text-sm leading-snug text-paper">{f.claim}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-paper-faint">{f.evidence}</p>
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
          Sparsity predicting sensitivity survives dropping layer 0, but only
          just: Spearman falls from {discontinuity.spearmanAll} to{" "}
          {discontinuity.spearmanNoLayer0} and p rises to{" "}
          {discontinuity.spearmanNoLayer0P}.
        </p>
      </div>
    </div>
  );
}
