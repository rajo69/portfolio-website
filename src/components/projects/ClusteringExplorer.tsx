"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import {
  clusteringDatasets,
  silhouetteWouldMislead,
} from "@/content/data/clustering";

/**
 * Interactive view of the preprocessing-sensitivity experiment.
 *
 * Two series per row, on the validated pair from the dataviz pass:
 *   #E82D77  ARI against ground truth, higher is better
 *   #2AA0D0  Silhouette, computed without labels
 *
 * Both bars are directly labelled and the numbers repeat as text, so identity
 * never rests on colour. The pair passes CVD separation at deutan dE 13.8;
 * re-run the validator before changing either value.
 *
 * The point of putting them on the same row is that they disagree. Silhouette
 * is the metric available in real unsupervised work, and on all three datasets
 * it peaks on the pipeline with the worst actual accuracy.
 */

const ARI_COLOUR = "#E82D77";
const SIL_COLOUR = "#2AA0D0";

export function ClusteringExplorer() {
  const [active, setActive] = useState(clusteringDatasets[0].key);
  const dataset =
    clusteringDatasets.find((d) => d.key === active) ?? clusteringDatasets[0];

  const bestSil = [...dataset.preprocessing].sort(
    (a, b) => b.silhouette - a.silhouette,
  )[0];
  const bestAri = [...dataset.preprocessing].sort((a, b) => b.ari - a.ari)[0];

  return (
    <div className="rounded-sm border border-ink-600 bg-ink-800 p-6 sm:p-8">
      {/* Dataset switcher */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose dataset">
        {clusteringDatasets.map((d) => {
          const on = d.key === active;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                on
                  ? "border-accent bg-accent text-on-accent"
                  : "border-ink-500 text-paper-dim hover:border-accent hover:text-paper"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-paper-faint">{dataset.blurb}</p>

      {/* Legend. Always present for two series. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="block size-2.5 rounded-full"
            style={{ backgroundColor: ARI_COLOUR }}
          />
          <Label>ARI vs ground truth</Label>
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="block size-2.5 rounded-full"
            style={{ backgroundColor: SIL_COLOUR }}
          />
          <Label>Silhouette (no labels)</Label>
        </span>
      </div>

      {/* Rows */}
      <div className="mt-7 space-y-6">
        {dataset.preprocessing.map((step) => {
          const isBestSil = step.method === bestSil.method;
          const isBestAri = step.method === bestAri.method;
          return (
            <div key={step.method}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm text-paper">{step.method}</span>
                <span className="flex items-center gap-4 font-mono text-xs tabular-nums">
                  <span className="text-paper-dim">ARI {step.ari.toFixed(3)}</span>
                  <span className="text-paper-faint">
                    Sil {step.silhouette.toFixed(3)}
                  </span>
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${step.ari * 100}%`, backgroundColor: ARI_COLOUR }}
                  />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${step.silhouette * 100}%`,
                      backgroundColor: SIL_COLOUR,
                    }}
                  />
                </div>
              </div>

              {(isBestSil || isBestAri) && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]">
                  {isBestSil && (
                    <span className="text-paper-faint">
                      Best silhouette, what you would pick without labels
                    </span>
                  )}
                  {isBestSil && isBestAri && <span> · </span>}
                  {isBestAri && <span className="text-accent">Best actual accuracy</span>}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* The finding */}
      <div className="mt-8 border-t border-ink-600 pt-6">
        {silhouetteWouldMislead(dataset) ? (
          <p className="text-sm leading-relaxed text-paper">
            On {dataset.label}, the pipeline with the{" "}
            <span className="text-accent">highest silhouette score</span> is the one
            with the <span className="text-accent">lowest actual accuracy</span>.
            Choosing by the only metric available without labels would have picked
            the worst option.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-paper">
            On {dataset.label}, silhouette and accuracy agree on the best pipeline.
          </p>
        )}

        <dl className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <dd className="font-display text-2xl font-bold tracking-tight text-accent tabular-nums">
              {dataset.ariRange.toFixed(3)}
            </dd>
            <dt className="mt-1">
              <Label>ARI swing from preprocessing alone</Label>
            </dt>
          </div>
          <div>
            <dd className="font-display text-2xl font-bold tracking-tight text-accent tabular-nums">
              {dataset.stability.mean.toFixed(3)}
            </dd>
            <dt className="mt-1">
              <Label>Bootstrap stability, +/- {dataset.stability.std.toFixed(3)}</Label>
            </dt>
          </div>
          <div>
            <dd className="font-display text-2xl font-bold tracking-tight text-accent tabular-nums">
              {dataset.baseline.ari.toFixed(3)}
            </dd>
            <dt className="mt-1">
              <Label>Baseline ARI, {dataset.baseline.method}</Label>
            </dt>
          </div>
        </dl>
      </div>

      {/* Table view, so the numbers are readable without the picture. */}
      <details className="mt-6">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint transition-colors hover:text-accent">
          Table view
        </summary>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Pipeline", "ARI", "Silhouette"].map((h) => (
                <th
                  key={h}
                  className="border-b border-ink-500 py-2 pr-6 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.preprocessing.map((s) => (
              <tr key={s.method}>
                <td className="border-b border-ink-600 py-2 pr-6 text-paper-dim">
                  {s.method}
                </td>
                <td className="border-b border-ink-600 py-2 pr-6 font-mono tabular-nums text-paper-dim">
                  {s.ari.toFixed(3)}
                </td>
                <td className="border-b border-ink-600 py-2 pr-6 font-mono tabular-nums text-paper-dim">
                  {s.silhouette.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
