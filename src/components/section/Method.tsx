import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { findings, method, scars } from "@/content/proof";
import type { Confidence } from "@/content/types";

/**
 * METHOD — the differentiator.
 *
 * Anyone can publish results. Publishing the confidence you have in them,
 * the failures that shaped the code, and the limits you set before you
 * started is the part that can't be manufactured — and it's the strongest
 * signal available to an engineer with no commercial metrics to point at.
 *
 * The `low`-confidence finding stays in. Removing it would make this look
 * stronger and be worth less.
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

/** Four segments, filled to the grade. Reads at a glance down the column. */
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

export function Method() {
  return (
    <Section id="method">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Method</Eyebrow>
        <SplitHeading size="h1" className="max-w-[20ch]">
          Every result carries how far it can be pushed.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          Results are the easy half. What they are worth depends on how they
          were obtained and where they stop holding — so both ship with them.
        </Lede>
      </Reveal>

      {/* --- Findings, with the confidence column intact --- */}
      <Reveal className="mt-20">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <Label as="h3">Gated attention · findings</Label>
          <Label>25,600 tokens · free Colab T4</Label>
        </div>

        <ul className="border-t border-ink-600">
          {findings.map((f) => (
            <li
              key={f.claim}
              className="grid gap-3 border-b border-ink-600 py-5 md:grid-cols-[1fr_auto] md:items-start md:gap-8"
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

        <p className="mt-5 max-w-[56ch] text-xs leading-relaxed text-paper-faint">
          The last row is graded low and published anyway. A single dataset, no
          retraining, no other benchmarks — so it stays low until that changes.
        </p>
      </Reveal>

      {/* --- The principle --- */}
      <Reveal className="mt-28">
        {/* Wide enough for two lines per sentence — at 24ch the display face
            broke this into four cramped lines and lost the parallelism the
            quote depends on. */}
        <blockquote className="max-w-[34ch]">
          {method.principle.quote.split("\n").map((line, i) => (
            <p
              key={line}
              className={`t-display text-[clamp(1.25rem,2.2vw,1.85rem)] ${
                i === 1 ? "text-accent" : ""
              }`}
            >
              {line}
            </p>
          ))}
        </blockquote>
        <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-paper-dim">
          {method.principle.body}
        </p>
      </Reveal>

      {/* --- Every guard is a scar --- */}
      <Reveal className="mt-24">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <Label as="h3">Every guard is a scar</Label>
          <Label>Observed live</Label>
        </div>

        <ul className="border-t border-ink-600">
          {scars.map((s) => (
            <li
              key={s.mechanism}
              className="grid gap-3 border-b border-ink-600 py-5 md:grid-cols-2 md:gap-10"
            >
              <p className="text-sm leading-snug text-paper-dim">{s.failure}</p>
              <div>
                <code className="font-mono text-sm text-accent">{s.mechanism}</code>
                <p className="mt-1 text-xs leading-relaxed text-paper-faint">
                  {s.behaviour}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* --- Scope stated before results --- */}
      <Reveal className="mt-24 max-w-[58ch]">
        <Label as="h3" className="mb-4 block">
          {method.scoping.title}
        </Label>
        <p className="text-sm leading-relaxed text-paper-dim">{method.scoping.body}</p>
      </Reveal>
    </Section>
  );
}
