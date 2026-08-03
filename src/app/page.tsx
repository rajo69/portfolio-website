import { ArrowDown } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { DisplayHeading, Eyebrow, Label, Lede } from "@/components/type";
import { profile } from "@/content/profile";

/**
 * PHASE 1 — shell only.
 *
 * The hero here is static placeholder markup so the shell is viewable and
 * scrollable. Phase 2 replaces it with the real Hero component and its
 * logit-lens decode animation; Phase 3+ adds Lab, Work and Receipts below.
 */
export default function Home() {
  return (
    <>
      <section
        id="top"
        className="relative flex min-h-[88svh] flex-col justify-between px-(--gutter) pb-10 pt-24 md:pt-32"
      >
        <div className="mx-auto flex w-full max-w-(--shell) flex-1 flex-col justify-center">
          <Reveal variant="stagger" className="space-y-8">
            <Eyebrow>{profile.title}</Eyebrow>

            <DisplayHeading size="hero" className="max-w-[16ch]">
              {profile.headline}
            </DisplayHeading>

            <Lede className="max-w-[52ch]">{profile.subhead}</Lede>

            <ul className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
              {profile.stats.map((stat) => (
                <li key={stat.caption} className="flex items-baseline gap-3">
                  <span
                    className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-accent"
                    style={{ fontFamily: "var(--ff-display), sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <Label>{stat.caption}</Label>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mx-auto flex w-full max-w-(--shell) items-center justify-between">
          <Label>{profile.location}</Label>
          <a
            href="#lab"
            className="group inline-flex items-center gap-2 transition-colors duration-200"
          >
            <Label className="transition-colors duration-200 group-hover:text-paper">
              See the work
            </Label>
            <ArrowDown
              className="size-3.5 text-paper-faint transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-accent"
              aria-hidden="true"
            />
          </a>
        </div>
      </section>

      {/* Placeholder — proves the shell scrolls, the header condenses, the
          progress bar tracks, and reveals fire. Replaced in Phase 2. */}
      <Section id="lab">
        <Reveal variant="stagger" className="space-y-6">
          <Eyebrow>Phase 1 · Shell</Eyebrow>
          <DisplayHeading size="h1" className="max-w-[18ch]">
            The scaffolding is up.
          </DisplayHeading>
          <Lede>
            Attention field, smooth scroll, cursor ring, scroll progress, sticky
            header and reveal animations are all live. The Lab, Work and Receipts
            sections land here once the content arrives.
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
