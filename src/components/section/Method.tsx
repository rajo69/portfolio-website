import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Lede } from "@/components/type";
import { method } from "@/content/proof";

/**
 * METHOD, how the work gets built.
 *
 * This section used to argue for its own credibility, opening with lines about
 * having no stars and ending on a block explaining what the work "is not".
 * That was defensive: the reader had not challenged anything. It now just
 * shows the engineering position and lets it speak.
 *
 * THE SCARS TABLE IS GONE. It listed four failures and four function names
 * with no subject: the reader was never told what the agent was or what it
 * did, so it opened on the consequences of a system it had not introduced.
 * Rajarshi could not read his own section, which settled it.
 *
 * The system it came from is now flagship block 05, `HarnessMap`, which shows
 * all fifteen guards in the stage where each one actually fires. That block
 * renders EARLIER on the page than this section does, so what is left here is
 * only the principle, stated once. Do not restate the harness here: two
 * tellings of one idea a few sections apart is exactly the repetition the
 * voice audit in HANDOFF §8b was about.
 *
 * `scars` in proof.ts is now unused and kept only as the older, shorter
 * phrasing of the same four failures.
 */



export function Method() {
  return (
    <Section id="method">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>How I build</Eyebrow>
        <SplitHeading size="h1" className="max-w-[20ch]">
          Every rule that broke once is now code.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          Driving live recruitment portals taught me more about agent design
          than any amount of planning did. Block 05 above is what came out of
          it.
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

    </Section>
  );
}
