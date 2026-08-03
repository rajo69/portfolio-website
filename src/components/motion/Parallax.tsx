"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Scroll-scrubbed vertical drift, plus optional fade.
 *
 * Used on the hero so the page has depth on the very first interaction:
 * the copy leaves slightly faster than the page scrolls, which reads as the
 * content sitting in front of the field rather than painted onto it.
 *
 * `scrub: 0.6` rather than `true` so it trails the scrollbar a touch. Tied
 * exactly to the scroll position it feels mechanical; too loose and it feels
 * disconnected from the input.
 */
export function Parallax({
  children,
  className,
  /** Pixels of drift across the whole scroll range. Negative moves up. */
  y = -120,
  /** Fade to this opacity by the end of the range. 1 disables the fade. */
  fadeTo = 1,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  fadeTo?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reduced || prefersReducedMotion()) return;

      gsap.to(ref.current, {
        y,
        opacity: fadeTo,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: ref, dependencies: [reduced, y, fadeTo] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
