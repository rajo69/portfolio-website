"use client";

import { useEffect, useRef } from "react";

/**
 * The 2px accent bar pinned to the top edge, tracking read progress.
 * Lifted straight from the reference, it's a cheap, constant orientation cue.
 *
 * Deliberately not a ScrollTrigger: a transform driven off a passive scroll
 * listener is one line of maths and avoids registering a trigger that would
 * need refreshing on every layout change.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    // Coalesce bursts of scroll events into one write per frame.
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent"
        // The initial scale is set inline, not with Tailwind's `scale-x-0`:
        // in v4 that utility emits the standalone `scale` property, which
        // composes with, rather than being overridden by, the `transform`
        // this component writes, pinning the bar to zero width forever.
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
