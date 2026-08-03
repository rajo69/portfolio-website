import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/type/Counter";
import { DisplayHeading, Eyebrow, Label, Lede } from "@/components/type";
import { measurements } from "@/content/proof";

/**
 * THE MEASUREMENT WALL — this site's replacement for social proof.
 *
 * The reference site can lean on $185M and $850M in exits. Personal research
 * repositories have no equivalent, and a strip of star counts reading zero
 * would only underline the fact. So every tile here is a measurement with a
 * deep link to whatever produced it: a README anchor, an eval file, a live
 * endpoint. The claim the section makes is procedural, not promotional.
 */
export function Evidence() {
  return (
    <Section id="evidence">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>The evidence</Eyebrow>
        <DisplayHeading size="h1" className="max-w-[16ch]">
          Nothing here is a claim.
        </DisplayHeading>
        <Lede className="max-w-[54ch]">
          No stars, no download counts — these are research and production
          builds, not libraries chasing adoption. Every number below links to
          the thing that produced it. Open one and check.
        </Lede>
      </Reveal>

      <Reveal
        variant="stagger"
        as="ul"
        className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink-600 bg-ink-600 sm:grid-cols-2 lg:grid-cols-3"
      >
        {measurements.map((m) => (
          <li key={m.caption} className="bg-ink-900">
            <a
              href={m.source}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between gap-6 p-7 transition-colors duration-200 hover:bg-ink-800"
            >
              <Counter
                value={m.value}
                className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums"
              />

              <span className="space-y-2">
                <span className="block text-sm leading-snug text-paper">
                  {m.caption}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Label className="transition-colors duration-200 group-hover:text-accent">
                    {m.sourceLabel}
                  </Label>
                  <ArrowUpRight
                    className="size-3 text-paper-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </a>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
