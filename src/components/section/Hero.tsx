"use client";

import { ArrowDown } from "lucide-react";
import { useRef } from "react";

import { LogitLens, LogitLensRail } from "@/components/motion/LogitLens";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/type/Counter";
import { Eyebrow, Label, Lede } from "@/components/type";
import { profile } from "@/content/profile";

/**
 * The hero. Follows the reference's structure exactly, eyebrow, oversized
 * two-line headline, muted lede, a row of hard numbers, and a baseline strip
 * with location and a scroll cue, but the headline decodes rather than
 * dissolving. See LogitLens.
 */
export function Hero() {
  const railRef = useRef<HTMLSpanElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);

  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] flex-col justify-between px-(--gutter) pb-10 pt-24 md:pt-32"
    >
      <div className="mx-auto flex w-full max-w-(--shell) flex-1 flex-col justify-center">
        <Reveal variant="stagger" className="space-y-8">
          <Eyebrow>{profile.title}</Eyebrow>

          <h1 className="t-display max-w-[16ch] text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.92] tracking-[-0.04em]">
            <LogitLens
              text={profile.headline}
              railRef={railRef}
              readoutRef={readoutRef}
            />
          </h1>

          <LogitLensRail railRef={railRef} readoutRef={readoutRef} />

          <Lede className="max-w-[52ch]">{profile.subhead}</Lede>

          <ul className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
            {profile.stats.map((stat) => (
              <li key={stat.caption} className="flex items-baseline gap-3">
                <Counter
                  value={stat.value}
                  className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-accent tabular-nums"
                />
                <Label>{stat.caption}</Label>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mx-auto flex w-full max-w-(--shell) items-center justify-between">
        <Label>{profile.location}</Label>
        <a
          href="#spine"
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
  );
}
