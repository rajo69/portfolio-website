"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * DOT GRID BACKGROUND.
 *
 * Replaces AttentionField at Rajarshi's request on 4 August 2026. The design is
 * React Bits' `DotGrid`, and the parameter names below are theirs so his
 * settings carry over unchanged. React Bits is MIT with the Commons Clause:
 * using it in a site is fine, reselling it is not.
 *
 * The physics are hand-rolled rather than lifted. Theirs drives each dot with a
 * GSAP InertiaPlugin tween; at this site's density that is a few thousand live
 * tweens on a page that already runs Lenis and ScrollTrigger. A per-dot spring
 * inside the existing rAF loop does the same job for a fraction of the cost and
 * keeps reduced-motion handling in one place.
 *
 * COLOURS COME FROM TOKENS, NOT FROM THE SNIPPET. His paste carried React Bits'
 * demo palette, #2F293A on #5227FF, which is a violet. This site is near-black
 * with one hot pink accent, and a second unrelated hue in the background would
 * break both the palette and the accent budget. `readToken` pulls the real
 * values out of globals.css at mount, so the background cannot drift from the
 * design system. DEMO_PALETTE below flips it to the literal snippet colours if
 * he wants them after all.
 *
 * CANVAS COLOUR STRINGS. `rgb(r g b / a)` with spaces. Commas plus slash-alpha
 * is invalid CSS, and canvas silently keeps the previous fillStyle rather than
 * throwing, which is how this shipped black-on-black once before.
 *
 * DENSITY IS MEASURED, NOT EYEballed. See HANDOFF §4: a previous background ran
 * at 1.22% lit pixels and was invisible for three rounds. Sample getImageData
 * after changing anything here.
 */

/** Set true to use the literal React Bits demo palette instead of the tokens. */
const DEMO_PALETTE = false;

const CONFIG = {
  dotSize: 5,
  gap: 15,
  proximity: 120,
  shockRadius: 250,
  shockStrength: 5,
  /** Higher is slower to settle. Maps React Bits' `resistance`. */
  resistance: 750,
  /** Seconds for a displaced dot to come home. Maps `returnDuration`. */
  returnDuration: 1.5,
};

interface Dot {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Read a custom property off :root and resolve it to rgb. */
function readToken(name: string, fallback: string): Rgb {
  if (typeof window === "undefined") return hexToRgb(fallback);
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return hexToRgb(fallback);
  if (raw.startsWith("#")) return hexToRgb(raw);
  const nums = raw.match(/[\d.]+/g);
  if (nums && nums.length >= 3) {
    return [Number(nums[0]), Number(nums[1]), Number(nums[2])];
  }
  return hexToRgb(fallback);
}

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* Read synchronously, per rule 8. A background that animates for one frame
       before a reduced-motion check lands is still motion the user asked not
       to see. */
    const reduced = prefersReducedMotion();

    const base: Rgb = DEMO_PALETTE
      ? hexToRgb("#2F293A")
      : readToken("--ink-600", "#1a1e21");
    const active: Rgb = DEMO_PALETTE
      ? hexToRgb("#5227FF")
      : readToken("--accent", "#00e88c");

    /* Does this device have a real hovering pointer?
       On a phone there is none, so the proximity halo can never be seen: a
       finger only produces pointer events while it is down. The loop below used
       to run at 60fps forever anyway, repainting a full-screen canvas of
       identical frames for an effect the device cannot show. That was half the
       stutter Rajarshi reported; the other half was the backdrop blur, see
       globals.css. */
    const hasHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches;

    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let last = performance.now();

    // Pointer lives outside the viewport until it is actually moved, so nothing
    // lights up under a stationary cursor on load.
    const pointer = { x: -9999, y: -9999 };

    function build() {
      const c = canvasRef.current;
      if (!c || !ctx) return;
      /* RESOLUTION. Full device pixel ratio, capped at 3, unconditionally.
         Two earlier versions of this line were both wrong. First it was a hard
         clamp to 2, so a 3x phone rendered at two thirds scale and let the
         browser upscale: soft dots. Then it was `hasHover ? 2 : 3`, which is
         fragile in exactly the way media queries about input are always
         fragile. iPadOS and several Android browsers report `hover: hover`,
         and any device that does went straight back to the blurry path.

         Capping at 3 is safe on its own. Retina desktops are DPR 2 and most
         PC monitors are 1, so this only ever reaches 3 on a phone, which is
         also the case where the loop idles and the canvas is painted once. */
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* DENSITY IS RELATIVE TO THE SCREEN, NOT ABSOLUTE.
         His settings give a 20px pitch, which is 72 dots across a 1440px
         desktop and only 20 across a 390px phone. Same spacing, but three and
         a half times coarser as a proportion of what you are looking at, and
         on a phone it reads as a chunky low-resolution pattern rather than as
         a fine field. Shrinking the pitch below 640px keeps the texture
         looking like the same design at both sizes. */
      const narrow = w < 640;
      const dotSize = narrow ? 3.5 : CONFIG.dotSize;
      const pitch = dotSize + (narrow ? 9 : CONFIG.gap);
      radius = dotSize / 2;

      const cols = Math.ceil(w / pitch) + 1;
      const rows = Math.ceil(h / pitch) + 1;
      // Centre the lattice so the margins match on both edges.
      const ox = (w - (cols - 1) * pitch) / 2;
      const oy = (h - (rows - 1) * pitch) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let cIdx = 0; cIdx < cols; cIdx++) {
          const x = ox + cIdx * pitch;
          const y = oy + r * pitch;
          dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
    }

    // Set by build(), because the dot shrinks with the pitch on narrow screens.
    let radius = CONFIG.dotSize / 2;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const prox2 = CONFIG.proximity * CONFIG.proximity;
      const lit: { d: Dot; t: number }[] = [];

      /* Base pass: every unlit dot in ONE path and ONE fill. Batching matters,
         a full-screen grid at this pitch is several thousand dots per frame. */
      ctx.beginPath();
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < prox2) {
          lit.push({ d, t: 1 - Math.sqrt(dist2) / CONFIG.proximity });
          continue;
        }
        ctx.moveTo(d.x + radius, d.y);
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgb(${base[0]} ${base[1]} ${base[2]} / 1)`;
      ctx.fill();

      // Lit pass: only the neighbourhood of the pointer, coloured per dot.
      for (const { d, t } of lit) {
        const e = t * t; // ease in, so the halo has a soft edge rather than a rim
        const r = Math.round(base[0] + (active[0] - base[0]) * e);
        const g = Math.round(base[1] + (active[1] - base[1]) * e);
        const b = Math.round(base[2] + (active[2] - base[2]) * e);
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r} ${g} ${b} / 1)`;
        ctx.fill();
      }
    }

    /** Start the loop if it is not already running. Idempotent. */
    function ensureRunning() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    function step(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      let moving = false;

      /* Critically damped spring home. `returnDuration` sets the natural
         frequency and `resistance` trims the damping, so both of his numbers
         still mean what they mean in the original. */
      const omega = (2 * Math.PI) / CONFIG.returnDuration;
      const damping = 2 * omega * (CONFIG.resistance / 750);

      for (const d of dots) {
        if (d.vx === 0 && d.vy === 0 && d.x === d.hx && d.y === d.hy) continue;
        const ax = -omega * omega * (d.x - d.hx) - damping * d.vx;
        const ay = -omega * omega * (d.y - d.hy) - damping * d.vy;
        d.vx += ax * dt;
        d.vy += ay * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (
          Math.abs(d.x - d.hx) < 0.05 &&
          Math.abs(d.y - d.hy) < 0.05 &&
          Math.abs(d.vx) < 0.05 &&
          Math.abs(d.vy) < 0.05
        ) {
          d.x = d.hx;
          d.y = d.hy;
          d.vx = 0;
          d.vy = 0;
        } else {
          moving = true;
        }
      }

      draw();

      /* Stop when there is nothing left to animate. A settled grid with the
         pointer off-screen is a still image, and repainting it is pure cost.
         Any of the listeners below restarts the loop. */
      const pointerLive = hasHover && pointer.x > -9999;
      if (moving || pointerLive) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    }

    function onMove(e: PointerEvent) {
      // A touch drag fires pointermove too, and lighting a halo under a finger
      // that is about to lift looks like a rendering fault rather than a hover.
      if (!hasHover) return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      ensureRunning();
    }

    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
      ensureRunning();
    }

    function onClick(e: PointerEvent) {
      const sr2 = CONFIG.shockRadius * CONFIG.shockRadius;
      for (const d of dots) {
        const dx = d.x - e.clientX;
        const dy = d.y - e.clientY;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > sr2 || dist2 === 0) continue;
        const dist = Math.sqrt(dist2);
        const falloff = 1 - dist / CONFIG.shockRadius;
        const push = CONFIG.shockStrength * falloff * 42;
        d.vx += (dx / dist) * push;
        d.vy += (dy / dist) * push;
      }
      // The shockwave is the one thing a touch device still gets.
      ensureRunning();
    }

    function onResize() {
      build();
      // Always repaint: the grid is rebuilt at the new size and, with the loop
      // idle, nothing else would put it on screen.
      draw();
      if (!reduced) ensureRunning();
    }

    build();

    if (reduced) {
      // Static lattice, drawn once. No loop, no pointer, no shockwave.
      draw();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    // Paint the resting grid once, then let the listeners decide whether the
    // loop ever needs to run. On a phone, typically it never does.
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
