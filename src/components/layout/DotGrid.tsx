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

    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();

    // Pointer lives outside the viewport until it is actually moved, so nothing
    // lights up under a stationary cursor on load.
    const pointer = { x: -9999, y: -9999 };

    function build() {
      const c = canvasRef.current;
      if (!c || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pitch = CONFIG.dotSize + CONFIG.gap;
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

    const radius = CONFIG.dotSize / 2;

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

    function step(now: number) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

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
        }
      }

      draw();
      raf = requestAnimationFrame(step);
    }

    function onMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }

    function onLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
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
    }

    function onResize() {
      build();
      if (reduced) draw();
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
    raf = requestAnimationFrame(step);

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
