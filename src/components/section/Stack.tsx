import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { profile } from "@/content/profile";

/**
 * The stack, rendered as a literal T.
 *
 * Foundations run full width because they run under everything: the same SQL
 * and the same pipeline work feed a dashboard and an LLM's context window.
 * The specialisms sit underneath as columns. A flat alphabetical tool list
 * would flatten exactly the distinction this section exists to make.
 */
export function Stack() {
  const [foundations, ...spikes] = profile.stack;

  return (
    <Section id="stack">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Stack</Eyebrow>
        <SplitHeading size="h1" className="max-w-[18ch]">
          One foundation, four specialisms.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          The row across the top runs under everything below it. A retrieval
          system is a data pipeline with a language model on the end, and it
          fails for the same reasons a dashboard fails.
        </Lede>
      </Reveal>

      <Reveal className="mt-14 rounded-sm border border-accent/30 bg-accent-ghost p-6">
        <Label className="block text-accent">{foundations.group}</Label>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {foundations.items.map((item) => (
            <li key={item} className="text-sm text-paper">
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal
        variant="stagger"
        className="mt-px grid gap-px border-ink-600 bg-ink-600 sm:grid-cols-2 lg:grid-cols-4"
      >
        {spikes.map((group) => (
          <div key={group.group} className="bg-ink-900 p-6">
            <Label className="block">{group.group}</Label>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-paper-dim">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
