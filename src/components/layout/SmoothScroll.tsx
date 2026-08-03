"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Lenis smooth scroll, driven by GSAP's ticker.
 *
 * Two engines each running their own rAF loop is the classic way to get
 * scroll-linked animation that lags a frame behind the scroll position. So
 * Lenis is stepped from `gsap.ticker` and ScrollTrigger is updated from Lenis
 * — one clock, no drift.
 *
 * Renders nothing; it exists for the effect.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    // Honouring the preference means native scroll, not slower smooth scroll.
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      // Touch devices have their own inertia; hijacking it feels broken.
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000); // GSAP: s, Lenis: ms
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Trigger start/end positions are measured at creation, which happens
    // before webfonts finish swapping in. Archivo is much wider than the
    // fallback, so headlines reflow and every measurement below them shifts.
    // Recompute once the real faces are in.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
