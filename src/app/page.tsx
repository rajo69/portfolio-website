import { Section } from "@/components/layout/Section";
import { About } from "@/components/section/About";
import { Certifications } from "@/components/section/Certifications";
import { Flagship } from "@/components/section/Flagship";
import { Hero } from "@/components/section/Hero";
import { Method } from "@/components/section/Method";
import { Spine } from "@/components/section/Spine";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Lede } from "@/components/type";

/**
 * The standalone "Evidence" section has been removed. It headlined "Nothing
 * here is a claim" and opened by pointing out the absence of stars, which
 * argued with a reader who had not objected to anything. The numbers now live
 * on the project cards, where a number belongs next to the thing it describes.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Spine />
      <Flagship />
      <Method />
      <About />
      <Certifications />

      {/* Placeholders. Phase 3 replaces these with the Lab cards and the
          filterable Work list. See CONTENT-BRIEF.md. */}
      <Section id="lab">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>The Lab</Eyebrow>
          <SplitHeading size="h1" className="max-w-[18ch]">
            Four things worth opening.
          </SplitHeading>
          <Lede>
            AI Accountant, the RL routing study, the job apply harness and the
            gated attention analysis, each with its numbers and a link to the
            repository.
          </Lede>
        </Reveal>
      </Section>

      <Section id="work">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Work</Eyebrow>
          <SplitHeading size="h1" className="max-w-[18ch]">
            Everything else.
          </SplitHeading>
          <Lede>
            Compliance retrieval, fine-tuning studies and earlier product builds,
            filterable by track.
          </Lede>
        </Reveal>
      </Section>

      <Section id="receipts">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Background</Eyebrow>
          <SplitHeading size="h1" className="max-w-[18ch]">
            IBM, the NHS, and an MSc in between.
          </SplitHeading>
          <Lede>
            Experience, education and certifications.
          </Lede>
        </Reveal>
      </Section>
    </>
  );
}
