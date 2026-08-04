"use client";

import { useRef, useState } from "react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The sticky section marker and scroll rail.
 *
 * TWO PROBLEMS, ONE MECHANISM.
 *
 * 1. Section eyebrows scroll away. On a page this long you lose track of which
 *    section you are in about two screenfuls after entering it.
 * 2. Flagship is enormous: five blocks, each carrying an interactive artifact
 *    well over a screen tall. There was no way to tell how far through it you
 *    were, or how much was left.
 *
 * Both are answered by a marker that pins in the left gutter for the life of
 * its section: the label stays readable, and a hairline fills as you move
 * through. Where a section has repeating children, it also counts them, so
 * Flagship reads "03 / 05" rather than leaving you to guess.
 *
 * WHY THE GUTTER. The obvious implementation, a sticky eyebrow at the top of
 * the content column, floats an 11px label over whatever scrolls beneath it,
 * which on a page with charts and canvases is noise. The gutter is empty by
 * construction, so nothing overlaps and nothing needs a scrim. It costs a
 * breakpoint: below xl there is not enough room, so this does not render and
 * the inline eyebrow does its normal job.
 *
 * ACCENT BUDGET. The track is `--line-strong` and the fill is `--accent-dim`,
 * not `--accent`. It is one hairline, at 1px, in a column nothing else
 * occupies. The section's real accent element is still its numbers.
 *
 * NO-JS AND REDUCED MOTION. Decorative and `aria-hidden`: the section already
 * has a real eyebrow and a real heading in the markup, and this repeats them.
 * Under reduced motion the fill is shown resolved rather than scrubbed, so
 * nothing is stuck at zero.
 */
export function SectionRail({
  label,
  /** CSS selector for repeating children to count, relative to the section. */
  stepSelector,
}: {
  label: string;
  stepSelector?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [step, setStep] = useState({ current: 0, total: 0 });
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      const fill = fillRef.current;
      if (!root || !fill) return;

      // The rail is absolutely positioned inside its section.
      const section = root.parentElement;
      if (!section) return;

      if (reduced || prefersReducedMotion()) {
        gsap.set(fill, { scaleY: 1 });
        if (stepSelector) {
          const n = section.querySelectorAll(stepSelector).length;
          setStep({ current: n, total: n });
        }
        return;
      }

      gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
      gsap.to(fill, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          scrub: true,
        },
      });

      if (!stepSelector) return;

      const steps = Array.from(section.querySelectorAll<HTMLElement>(stepSelector));
      if (steps.length === 0) return;
      setStep({ current: 1, total: steps.length });

      // One trigger per child rather than arithmetic on the section's
      // progress, because the blocks are wildly different heights and even
      // spacing would report the wrong one for most of the scroll.
      const triggers = steps.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setStep((s) => ({ ...s, current: i + 1 }));
          },
        })
      );

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref, dependencies: [reduced, stepSelector] }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-5 hidden select-none xl:block"
    >
      <div className="sticky top-[34vh] flex flex-col items-center gap-4">
        <span
          className="t-label whitespace-nowrap [writing-mode:vertical-rl] rotate-180"
        >
          {label}
        </span>

        <span className="relative block h-[20vh] w-px bg-line-strong">
          <span
            ref={fillRef}
            className="absolute inset-x-0 top-0 block h-full bg-accent-dim"
          />
        </span>

        {step.total > 0 && (
          <span className="font-mono text-[10px] tabular-nums text-paper-faint">
            {String(step.current).padStart(2, "0")}
            <span className="text-ink-500">/</span>
            {String(step.total).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
}
