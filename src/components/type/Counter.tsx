"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Counts a stat up when it scrolls into view.
 *
 * Stat values are free-form strings (`"56"`, `"<2B"`, `"3.8%"`, `"£185M"`), so
 * the numeric part is extracted and the surrounding characters are preserved
 * verbatim. Anything without a number renders as static text.
 */

const NUMERIC = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

/** Below this, counting reads as a glitch rather than a count. */
const MIN_TO_ANIMATE = 10;

export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  const match = value.match(NUMERIC);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;
  const grouped = match?.[2].includes(",") ?? false;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !match || !Number.isFinite(target) || target < MIN_TO_ANIMATE) return;
      if (reduced || prefersReducedMotion()) return;

      const state = { n: 0 };
      const [, prefix, suffix] = match;

      gsap.to(state, {
        n: target,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          const n = state.n.toFixed(decimals);
          el.textContent =
            prefix + (grouped ? Number(n).toLocaleString("en-GB") : n) + suffix;
        },
        // Snap back to the authored string so formatting is never approximated.
        onComplete: () => {
          el.textContent = value;
        },
      });
    },
    { scope: ref, dependencies: [reduced, value] });

  return (
    <span ref={ref} className={cn(className)}>
      {value}
    </span>
  );
}
