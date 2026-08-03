import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { method, scars } from "@/content/proof";

/**
 * METHOD, how the work gets built.
 *
 * This section used to argue for its own credibility, opening with lines about
 * having no stars and ending on a block explaining what the work "is not".
 * That was defensive: the reader had not challenged anything. It now just
 * shows the engineering position and lets it speak.
 */



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

    </Section>
  );
}
