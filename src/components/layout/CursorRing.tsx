"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The lagging outline ring from the reference.
 *
 * Fine-pointer devices only — on touch there is no cursor to augment, and on
 * reduced-motion the lag is the whole effect, so it's dropped rather than
 * shortened. The native cursor is never hidden: this sits on top of it, so
 * standard affordances (text I-beam, link pointer) still read normally.
 */
export function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches && !reduced);

    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches && !reduced);
    fine.addEventListener("change", onChange);
    return () => fine.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    const ring = ringRef.current;
    if (!enabled || !ring) return;

    // quickTo interpolates internally, so no tween is allocated per event.
    const xTo = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let visible = false;
    let overInteractive = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to(ring, { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      // Grow over anything interactive. Checked per-move against the live
      // element under the pointer so it survives dynamically added content.
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="grow"]',
      );

      // Only tween on a state *change*. Calling gsap.to() on every pointermove
      // allocates a tween per event and, with overwrite:"auto", kills the
      // previous one each time — hundreds of allocations a second during a
      // fast drag, which is enough to stall the main thread.
      if (interactive === overInteractive) return;
      overInteractive = interactive;

      gsap.to(ring, {
        scale: interactive ? 2.2 : 1,
        borderColor: interactive
          ? "var(--accent)"
          : "color-mix(in srgb, var(--accent) 45%, transparent)",
        duration: 0.28,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to(ring, { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(ring);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-7 rounded-full border opacity-0 md:block"
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
        willChange: "transform",
        // Centres the ring on the pointer. A -translate-x/y utility can't be
        // used here: GSAP owns `transform` via x/y and would overwrite it.
        margin: "-14px 0 0 -14px",
      }}
    />
  );
}
