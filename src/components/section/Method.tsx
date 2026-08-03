import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { findings, method, scars } from "@/content/proof";
import type { Confidence } from "@/content/types";

/**
 * METHOD, how the work gets built.
 *
 * This section used to argue for its own credibility, opening with lines about
 * having no stars and ending on a block explaining what the work "is not".
 * That was defensive: the reader had not challenged anything. It now just
 * shows the engineering position and lets it speak.
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
        <Eyebrow>How I build</Eyebrow>
        <SplitHeading size="h1" className="max-w-[20ch]">
          Guards, not runbooks.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          Agent pipelines rot in production because prose is read partially and
          remembered selectively. The fix is to turn every rule that gets broken
          once into code that raises the next time.
        </Lede>
      </Reveal>

      {/* --- The principle --- */}
      <Reveal className="mt-20">
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

      {/* --- Findings with their confidence grades --- */}
      <Reveal className="mt-24">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <Label as="h3">Gated attention, findings</Label>
          <Label>25,600 tokens</Label>
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
      </Reveal>
    </Section>
  );
}
