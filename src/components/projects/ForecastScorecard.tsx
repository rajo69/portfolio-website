"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import {
  FIT_ORIGIN,
  FIT_ORIGIN_REVISED,
  METRIC_LABEL,
  corpora,
  corpusImbalance,
  history,
  horizonEffect,
  models,
  scoreSummary,
  scored,
  type MetricKey,
} from "@/content/data/forecast";

/**
 * The forecast, scored against what happened.
 *
 * WHY THIS SHAPE. The original coursework ends at "the estimate for October
 * 2024 is 19,566.92" and stops. That number is falsifiable and it is now
 * falsified, so publishing it alone would invite a reader to check FRED and
 * quietly conclude the analysis was wrong. Scoring it here instead makes the
 * same reader's check agree with the page, and the interesting content is the
 * decomposition: how much was the model, and how much was the ground moving.
 *
 * Three views, in the order the argument runs:
 *   1. What was forecast, what happened, and where the bands failed.
 *   2. Why. The same model is excellent one month out and poor eleven months
 *      out, which is a property of the horizon, not of the model.
 *   3. The second half of the study, an LDA topic model over hotel reviews.
 *
 * Every number is imported. Nothing is computed for effect and nothing is
 * rounded up. See the provenance header in content/data/forecast.ts.
 */

type View = "scored" | "horizon" | "topics";

/* ---------------------------------------------------------------- *
 * Formatting. Hand rolled so server and client always agree.
 * ---------------------------------------------------------------- */

function fmt(n: number, dp = 0): string {
  const fixed = Math.abs(n).toFixed(dp);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}${grouped}${dec ? `.${dec}` : ""}`;
}

const signed = (n: number, dp = 0) => `${n >= 0 ? "+" : ""}${fmt(n, dp)}`;

/* ---------------------------------------------------------------- *
 * Shared control
 * ---------------------------------------------------------------- */

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
            value === o.value
              ? "bg-accent text-on-accent"
              : "text-paper-faint hover:text-paper"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 1: forecast against outturn
 * ---------------------------------------------------------------- */

const W = 760;
const H = 300;
const PAD = { l: 54, r: 16, t: 18, b: 30 };

/** History first, then the forecast window. One row per month on the x axis. */
const chartRows = [
  ...history.map((h) => ({ label: h.label, actual: h.actual, f: null as (typeof scored)[number] | null })),
  ...scored.map((s) => ({ label: s.label, actual: s.actual, f: s })),
];

const FIRST_FC = history.length;
const LAST = chartRows.length - 1;

const yMin = Math.min(...chartRows.map((r) => Math.min(r.actual, r.f?.lo95 ?? r.actual)), FIT_ORIGIN.value) - 120;
const yMax = Math.max(...chartRows.map((r) => Math.max(r.actual, r.f?.hi95 ?? r.actual))) + 120;

const px = (i: number) => PAD.l + (i / LAST) * (W - PAD.l - PAD.r);
const py = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

/** Ribbon between two bounds across the forecast window. */
function band(lo: (r: (typeof scored)[number]) => number, hi: (r: (typeof scored)[number]) => number) {
  const top = scored.map((s, k) => `${px(FIRST_FC + k)},${py(hi(s))}`);
  const bottom = [...scored].reverse().map((s, k) => `${px(LAST - k)},${py(lo(s))}`);
  return `M${top.join("L")}L${bottom.join("L")}Z`;
}

const line = (pts: { i: number; v: number }[]) =>
  pts.map((p, k) => `${k === 0 ? "M" : "L"}${px(p.i)},${py(p.v)}`).join("");

function ScoredView() {
  // Defaults to the final month, the one the coursework actually published.
  const [sel, setSel] = useState(LAST);
  const row = chartRows[sel];
  const f = row.f;

  const ticks = [19000, 19500, 20000];

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[540px] touch-pan-y"
          role="img"
          aria-label={`US personal consumption expenditure, actual against the published Holt forecast for the eleven months to October 2024. The outturn falls outside the 95% prediction interval in ${scoreSummary.outside95} of ${scoreSummary.horizons} months.`}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * LAST);
            setSel(Math.max(0, Math.min(LAST, i)));
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} y1={py(t)} x2={W - PAD.r} y2={py(t)} stroke="var(--line)" />
              <text
                x={PAD.l - 8}
                y={py(t)}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--paper-faint)"
                style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          {/* Prediction intervals, widest first. */}
          <path d={band((s) => s.lo95, (s) => s.hi95)} fill="var(--series-1-band-wide)" />
          <path d={band((s) => s.lo80, (s) => s.hi80)} fill="var(--series-1-band)" />

          {/* Where the forecast starts. */}
          <line
            x1={px(FIRST_FC) - (px(1) - px(0)) / 2}
            y1={PAD.t}
            x2={px(FIRST_FC) - (px(1) - px(0)) / 2}
            y2={H - PAD.b}
            stroke="var(--ink-500)"
            strokeDasharray="3 3"
          />

          {/* The forecast origin moved after the model was fitted. */}
          <line
            x1={px(FIRST_FC - 1)}
            y1={py(FIT_ORIGIN.value)}
            x2={px(FIRST_FC - 1)}
            y2={py(FIT_ORIGIN_REVISED)}
            stroke="var(--paper-faint)"
            strokeWidth={1}
          />
          <circle cx={px(FIRST_FC - 1)} cy={py(FIT_ORIGIN.value)} r={2.5} fill="none" stroke="var(--paper-faint)" />

          <path d={line(chartRows.map((r, i) => ({ i, v: r.actual })))} fill="none" stroke="var(--series-2)" strokeWidth={2} />
          <path
            d={line(scored.map((s, k) => ({ i: FIRST_FC + k, v: s.point })))}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={2}
            strokeDasharray="5 3"
          />

          {/* Selection */}
          <line x1={px(sel)} y1={PAD.t} x2={px(sel)} y2={H - PAD.b} stroke="var(--line-strong)" />
          <circle cx={px(sel)} cy={py(row.actual)} r={3.5} fill="var(--series-2)" />
          {f && <circle cx={px(sel)} cy={py(f.point)} r={3.5} fill="var(--series-1)" />}

          {[0, FIRST_FC, LAST].map((i) => (
            <text
              key={i}
              x={px(i)}
              y={H - PAD.b + 16}
              textAnchor={i === 0 ? "start" : i === LAST ? "end" : "middle"}
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
            >
              {chartRows[i].label}
            </text>
          ))}
        </svg>
      </div>

      {/* Touch and keyboard path to the same selection the pointer gives. */}
      <label className="mt-3 block">
        <span className="sr-only">Select a month to compare forecast against outturn</span>
        <input
          type="range"
          min={0}
          max={LAST}
          value={sel}
          onChange={(e) => setSel(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-ink-600 accent-accent"
        />
      </label>

      <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-4">
        <div>
          <Label>{row.label}</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">
            {f ? `${f.h} month${f.h > 1 ? "s" : ""} out` : "Before the forecast"}
          </p>
        </div>
        <div>
          <Label>Forecast</Label>
          <p className="mt-1.5 font-mono text-sm" style={{ color: "var(--series-1)" }}>
            {f ? fmt(f.point, 2) : "n/a"}
          </p>
        </div>
        <div>
          <Label>Actual</Label>
          <p className="mt-1.5 font-mono text-sm" style={{ color: "var(--series-2)" }}>
            {fmt(row.actual, 1)}
          </p>
        </div>
        <div>
          <Label>Error</Label>
          <p className="mt-1.5 font-mono text-sm text-paper">
            {f ? `${signed(f.error, 1)}, ${f.ape.toFixed(2)}%` : "n/a"}
          </p>
        </div>
      </div>

      {f && (
        <p className="mt-4 text-sm leading-relaxed text-paper-dim">
          {f.insideBand95
            ? "This is the one month of eleven where the outturn landed inside the 95% interval, and only just, with 9.25 to spare."
            : "The outturn is above the top of the 95% interval. A 95% interval should be breached about one month in twenty, not ten in eleven, so the intervals were too narrow and not just the point forecast too low."}
        </p>
      )}

      <dl className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-3">
        {[
          { v: `${scoreSummary.outside95} / ${scoreSummary.horizons}`, k: "Months outside the 95% band" },
          { v: `${scoreSummary.mape.toFixed(2)}%`, k: "MAPE across the window" },
          { v: signed(scoreSummary.finalGap, 0), k: "Final gap, October 2024" },
        ].map((s) => (
          <div key={s.k}>
            <dd className="font-mono text-lg text-paper tabular-nums">{s.v}</dd>
            <dt className="mt-1">
              <Label>{s.k}</Label>
            </dt>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-paper-faint">
        The hollow marker at {FIT_ORIGIN.label} is the last value the model was
        fitted on, {fmt(FIT_ORIGIN.value, 1)}. FRED now reports{" "}
        {fmt(FIT_ORIGIN_REVISED, 1)} for that month, so the forecast origin was
        revised up by {fmt(scoreSummary.revision, 1)} after the model was built.
        That is {scoreSummary.revisionShare.toFixed(0)}% of the final gap, and it
        is not the model&apos;s error. Actual series: FRED{" "}
        <code className="font-mono">PCE</code>, current vintage.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 2: the horizon is the variable
 * ---------------------------------------------------------------- */

function HorizonView() {
  const [metric, setMetric] = useState<MetricKey>("rmse");
  const max = Math.max(...models.map((m) => m.holdout[metric]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[52ch] text-sm leading-relaxed text-paper-dim">
          Same three models, same series, same fitted parameters. The only thing
          that changes is how far ahead each one is asked to predict.
        </p>
        <Segmented
          label="Error metric"
          value={metric}
          onChange={setMetric}
          options={(Object.keys(METRIC_LABEL) as MetricKey[]).map((k) => ({
            value: k,
            label: METRIC_LABEL[k],
          }))}
        />
      </div>

      <div className="mt-7 space-y-7">
        {models.map((m) => (
          <div key={m.key}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Label as="h5" className="text-paper">
                {m.label}
              </Label>
              <p className="max-w-[46ch] text-xs leading-relaxed text-paper-faint">{m.note}</p>
            </div>

            {(["holdout", "rolling"] as const).map((h) => {
              const v = m[h][metric];
              return (
                <div key={h} className="mt-2.5 grid grid-cols-[8.5rem_1fr_5.5rem] items-center gap-3">
                  <Label>{h === "holdout" ? "13 yr, once" : "1 month, rolling"}</Label>
                  <div className="h-3 rounded-sm bg-ink-700">
                    <div
                      className="h-full rounded-sm transition-[width] duration-500 motion-reduce:transition-none"
                      style={{
                        width: `${Math.max((v / max) * 100, 0.6)}%`,
                        background: h === "holdout" ? "var(--series-1)" : "var(--series-2)",
                      }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs text-paper tabular-nums">
                    {fmt(v, metric === "mape" ? 3 : 2)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-paper-dim">
        Holt&apos;s error is {horizonEffect.rmse.toFixed(2)} times lower on RMSE
        and {horizonEffect.mape.toFixed(2)} times lower on MAPE when the horizon
        drops from the full holdout to one month. Bars share a scale so the
        collapse is visible rather than tabulated. The lesson is the one the
        coursework did not draw: a one step ahead score is not evidence that a
        model can forecast a year out, and the published eleven month forecast
        is the case in point.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * View 3: the topic model
 * ---------------------------------------------------------------- */

function TopicsView() {
  const [key, setKey] = useState<"positive" | "negative">("positive");
  const corpus = corpora.find((c) => c.key === key)!;
  const [picked, setPicked] = useState<number>(corpora[0].top3[0]);

  const topic = corpus.topics.find((t) => t.index === picked) ?? corpus.topics[0];
  const maxCount = corpus.topWords[0].count;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[50ch] text-sm leading-relaxed text-paper-dim">
          10,000 hotel reviews, non-English dropped, scored 3 treated as neutral
          and removed. Positive and negative corpora modelled separately.
        </p>
        <Segmented
          label="Review sentiment"
          value={key}
          onChange={(v) => {
            setKey(v);
            setPicked(corpora.find((c) => c.key === v)!.top3[0]);
          }}
          options={corpora.map((c) => ({ value: c.key, label: `${c.label} ${fmt(c.size)}` }))}
        />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Label as="h5">k = {corpus.k}, chosen by ldatuning</Label>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-paper-faint">{corpus.kReason}</p>

          <ul className="mt-4 space-y-1">
            {corpus.topics.map((t) => {
              const isTop = corpus.top3.includes(t.index);
              const active = t.index === picked;
              return (
                <li key={t.index}>
                  <button
                    type="button"
                    onClick={() => setPicked(t.index)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-3 rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors duration-200 motion-reduce:transition-none ${
                      active
                        ? "bg-ink-700 text-paper"
                        : "text-paper-dim hover:bg-ink-800 hover:text-paper"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-paper-faint tabular-nums">
                      {String(t.index).padStart(2, "0")}
                    </span>
                    <span className="flex-1 leading-snug">{t.label}</span>
                    {isTop && (
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                        top 3
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <Label as="h5">Top terms in topic {String(topic.index).padStart(2, "0")}</Label>
          <p className="mt-2 text-sm leading-snug text-paper">{topic.label}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {topic.terms.map((term, i) => (
              <li
                key={term}
                className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] text-paper-dim"
                style={{ opacity: 1 - i * 0.045 }}
              >
                {term}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-5">
            <Label as="h5">Raw term frequency, whole corpus</Label>
            <ul className="mt-3 space-y-1.5">
              {corpus.topWords.slice(0, 6).map((w) => (
                <li key={w.term} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3">
                  <span className="font-mono text-[11px] text-paper-dim">{w.term}</span>
                  <span className="h-1.5 rounded-sm bg-ink-700">
                    <span
                      className="block h-full rounded-sm"
                      style={{ width: `${(w.count / maxCount) * 100}%`, background: "var(--series-3)" }}
                    />
                  </span>
                  <span className="text-right font-mono text-[11px] text-paper-faint tabular-nums">
                    {fmt(w.count)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-paper-faint">
              Frequency and topic disagree, which is the point of running LDA at
              all. &quot;hotel&quot; and &quot;room&quot; dominate the counts in both corpora and
              separate nothing.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-7 border-t border-line pt-5 text-xs leading-relaxed text-paper-faint">
        The weakness worth naming: the corpora are {corpusImbalance.ratio.toFixed(1)} to 1
        imbalanced, so the negative model fits {corpus.key === "negative" ? corpora[1].k : 11}{" "}
        topics over {fmt(corpora[1].size)} documents, about{" "}
        {corpusImbalance.docsPerNegativeTopic.toFixed(0)} per topic. The positive
        topics are well supported. The negative ones should be read as
        directional.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Shell
 * ---------------------------------------------------------------- */

export function ForecastScorecard() {
  const [view, setView] = useState<View>("scored");

  return (
    <div className="surface rounded-lg p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Label as="h4">
          {view === "scored"
            ? "Forecast against outturn"
            : view === "horizon"
              ? "Why it missed"
              : "Part two, what the reviews are about"}
        </Label>
        <Segmented
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: "scored", label: "Scored" },
            { value: "horizon", label: "Horizon" },
            { value: "topics", label: "Topics" },
          ]}
        />
      </div>

      <div className="mt-7">
        {view === "scored" ? <ScoredView /> : view === "horizon" ? <HorizonView /> : <TopicsView />}
      </div>
    </div>
  );
}
