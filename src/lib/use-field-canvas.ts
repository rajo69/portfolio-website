"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Shared plumbing for every ambient background field.
 *
 * All the parts that are identical across fields and easy to get subtly wrong
 * live here once: DPR-capped sizing, debounced rebuild on resize, pause on a
 * hidden tab, the `?field=off` escape hatch, pointer tracking gated to fine
 * pointers, reduced-motion handling, and a frame-rate-independent `dt`.
 *
 * A field owns its own clearing. Some want a hard clear each frame, some want
 * to fade the previous frame to leave trails, and a host that cleared for them
 * would make the second kind impossible.
 */

export interface FieldPointer {
  x: number;
  y: number;
  active: boolean;
}

export interface Field {
  /** Called on mount and on every resize. Sizes are CSS pixels. */
  init(w: number, h: number): void;
  /** `dt` is normalised to 60fps. `now` is a ms timestamp. */
  step(dt: number, now: number, pointer: FieldPointer): void;
  draw(ctx: CanvasRenderingContext2D, w: number, h: number): void;
}

/**
 * `create` MUST be a stable reference, so declare the factory at module scope
 * rather than inline in the component. An inline arrow is a new function every
 * render, which would tear down and rebuild the whole field on each one.
 */
export function useFieldCanvas(create: () => Field) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("field") === "off") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const field = create();
    const pointer: FieldPointer = { x: -9999, y: -9999, active: false };
    let width = 0;
    let height = 0;

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      field.init(width, height);
    }

    build();

    if (reduced) {
      // One settled frame. The page keeps its texture and nothing moves, and
      // no pointer listener is attached: someone who asked for less motion
      // does not want the background tracking their cursor either.
      for (let k = 0; k < 90; k++) field.step(1, k * 16.7, pointer);
      field.draw(ctx, width, height);
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerOut = () => {
      pointer.active = false;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerOut);
    }

    let raf = 0;
    let last = performance.now();
    let running = true;

    function frame(now: number) {
      if (!running) return;
      // Clamp so a backgrounded tab does not fast-forward on return.
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      field.step(dt, now, pointer);
      field.draw(ctx!, width, height);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const resume = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      pause();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (finePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerOut);
      }
    };
  }, [reduced, create]);

  return canvasRef;
}

/** `#rrggbb` to `"r g b"`, for `rgb(r g b / a)`. Space separated, see DESIGN.md. */
export function rgbTriplet(hex: string, fallback = "255 61 139"): string {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return fallback;
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)).join(" ");
}

export function readTokens() {
  const css = getComputedStyle(document.documentElement);
  return {
    accent: rgbTriplet(css.getPropertyValue("--accent")),
    series2: rgbTriplet(css.getPropertyValue("--series-2"), "42 160 208"),
    lattice: css.getPropertyValue("--lattice").trim() || "150 155 168",
  };
}
