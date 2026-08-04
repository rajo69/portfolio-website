"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import {
  attacks,
  FGSM_NOTE,
  models,
  setup,
  type AttackKey,
} from "@/content/data/robustness";

/**
 * The dissertation's robustness matrix, made switchable.
 *
 * THE POINT OF THE INTERACTION. Three models, three attacks, and the ranking
 * inverts depending on which attack you pick. On clean data v1 wins and v3 is
 * second. Under PGD v1 is last by a factor of sixty and v2 wins. Switching the
 * attack is the finding: a single accuracy number cannot tell you which of
 * these models you want, and clean accuracy is the one people quote.
 *
 * FGSM DRAWS AS A BAND. The repository reports it as bounds across epsilon and
 * does not publish the intermediate points. A curve through two endpoints
 * would look more finished and would be fabricated, so it stays a band, the
 * same call made for layers 5 to 27 in the gated-attention explorer.
 */

const BAR_MAX = 100;

function pct(v: number) {
  return `${v.toFixed(2)}%`;
}

export function RobustnessMatrix() {
  const [attack, setAttack] = useState<AttackKey>("pgd");
  const [modelKey, setModelKey] = useState<string>("v1");

  const active = attacks.find((a) => a.key === attack)!;
  const model = models.find((m) => m.key === modelKey) ?? models[0];

  return (
    <div className="surface rounded-lg p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Label as="h4">Accuracy under attack</Label>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-paper-dim">
            Same three models, three different tests. Switch the attack and
            watch the ranking invert.
          </p>
        </div>
        <div
          role="group"
          aria-label="Attack"
          className="inline-flex flex-wrap gap-1 rounded-full border border-line p-1"
        >
          {attacks.map((a) => (
            <button
              key={a.key}
              type="button"
              aria-pressed={a.key === attack}
              onClick={() => setAttack(a.key)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 motion-reduce:transition-none ${
                a.key === attack
                  ? "bg-accent text-on-accent"
                  : "text-paper-faint hover:text-paper"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-7 space-y-5">
        {models.map((m) => {
          const selected = m.key === modelKey;
          const isRange = attack === "fgsm";
          const value = attack === "clean" ? m.clean : attack === "pgd" ? m.pgd : m.fgsm.high;
          const low = m.fgsm.low;

          return (
            <li key={m.key}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setModelKey(m.key)}
                className="block w-full text-left"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`font-mono text-sm ${selected ? "text-paper" : "text-paper-dim"}`}
                    >
                      {m.label}
                    </span>
                    <Label>{m.training}</Label>
                  </span>
                  <span className="font-mono text-xs tabular-nums text-paper">
                    {isRange ? `${pct(value)} to ${pct(low)}` : pct(value)}
                  </span>
                </div>

                <div className="mt-2 h-3.5 rounded-sm bg-ink-700">
                  {isRange ? (
                    // Band from the low bound to the high bound.
                    <div className="relative h-full">
                      <div
                        className="absolute inset-y-0 rounded-sm transition-all duration-500 motion-reduce:transition-none"
                        style={{
                          left: `${(low / BAR_MAX) * 100}%`,
                          width: `${((value - low) / BAR_MAX) * 100}%`,
                          background: "var(--series-1-band)",
                          borderLeft: "2px solid var(--series-1)",
                          borderRight: "2px solid var(--series-1)",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="h-full rounded-sm transition-[width] duration-500 motion-reduce:transition-none"
                      style={{
                        width: `${Math.max((value / BAR_MAX) * 100, 0.5)}%`,
                        background: selected ? "var(--accent)" : "var(--series-1)",
                      }}
                    />
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 max-w-[68ch] text-sm leading-relaxed text-paper-dim">
        {active.blurb}
        {attack === "fgsm" && (
          <>
            {" "}
            <span className="text-paper-faint">{FGSM_NOTE}</span>
          </>
        )}
      </p>

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-sm text-paper">
            {model.label}, {model.training.toLowerCase()}
          </p>
          <Label>{model.objective}</Label>
        </div>
        <p className="mt-2.5 max-w-[70ch] text-sm leading-relaxed text-paper-dim">
          {model.detail}
        </p>
      </div>

      <p className="mt-6 border-t border-line pt-5 font-mono text-[11px] leading-relaxed text-paper-faint">
        {setup.architecture} on {setup.dataset}, {setup.epochs} epochs, batch{" "}
        {setup.batch}, learn rate {setup.learnRate}.
        <br />
        {setup.preprocessing}. FGSM training at {setup.fgsmTrain}. PGD test at{" "}
        {setup.pgdTest}.
        <br />
        {setup.environment}, run on {setup.compute}.
      </p>
    </div>
  );
}
