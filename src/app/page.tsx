import { Section } from "@/components/layout/Section";
import { Evidence } from "@/components/section/Evidence";
import { Hero } from "@/components/section/Hero";
import { Method } from "@/components/section/Method";
import { Spine } from "@/components/section/Spine";
import { Reveal } from "@/components/motion/Reveal";
import { DisplayHeading, Eyebrow, Lede } from "@/components/type";

/**
 * PHASE 2 — Hero and Spine are real. Lab, Work and Receipts below are still
 * placeholders awaiting content; see CONTENT-BRIEF.md.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Spine />
      <Evidence />
      <Method />

      {/* Placeholders — Phase 3 replaces these with real Lab cards and the
          filterable Work list. See CONTENT-BRIEF.md. */}
      <Section id="lab">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Next · The Lab</Eyebrow>
          <DisplayHeading size="h1" className="max-w-[18ch]">
            Open the systems.
            <br />
            Read the evals.
          </DisplayHeading>
          <Lede>
            Four flagship projects, each with a live chart of its real measured
            metric and a link straight to the repo.
          </Lede>
        </Reveal>
      </Section>

      <Section id="work">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Next</Eyebrow>
          <DisplayHeading size="h1" className="max-w-[18ch]">
            Where capability
            <br />
            became a system.
          </DisplayHeading>
          <Lede>
            Four flagship projects become Lab cards with live charts of their real
            measured metrics. Everything else becomes a filterable Work list.
          </Lede>
        </Reveal>
      </Section>

      <Section id="receipts">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Then</Eyebrow>
          <DisplayHeading size="h1" className="max-w-[18ch]">
            The receipts.
          </DisplayHeading>
          <Lede>
            Experience, education and certifications — with verification links,
            because the whole argument of this site is receipts over claims.
          </Lede>
        </Reveal>
      </Section>

      <Section id="about">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>About</Eyebrow>
          <DisplayHeading size="h1" className="max-w-[18ch]">
            One engineer,
            <br />
            <span className="text-accent">both ends of the pipeline.</span>
          </DisplayHeading>
        </Reveal>
      </Section>
    </>
  );
}
