"use client";

import {
  readTokens,
  useFieldCanvas,
  type Field,
  type FieldPointer,
} from "@/lib/use-field-canvas";

/**
 * GRADIENT FLOW.
 *
 * Particles advected along a slowly rotating vector field, leaving trails.
 * This is the crowd-pleaser of the set: it is the least specific to the
 * subject of this site, and the most immediately attractive.
 *
 * The one thing tying it to the work: the field is a sum of sinusoids rather
 * than true Perlin noise, which means it is cheap and, more usefully, it has
 * visible saddle points and basins. Particles pool in the basins and race
 * through the saddles, which is what gradient descent looks like from above.
 *
 * Trails come from fading the previous frame instead of clearing it, so this
 * is the one field that must own its own clear. That is why the host hook does
 * not clear for fields.
 *
 * The cursor pushes the flow aside, which on a trail-based field reads as
 * genuinely fluid.
 */

const PARTICLES = 700;
const TRAIL_FADE = 0.055;
const SPEED = 0.85;
const CURSOR_PUSH = 170;

type P = { x: number; y: number; life: number; hot: boolean };

function createFlowField(): Field {
  const tokens = { accent: "255 61 139", lattice: "150 155 168", series2: "42 160 208" };
  let ps: P[] = [];
  let W = 0;
  let H = 0;
  let t = 0;

  const reset = (p: P) => {
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.life = 60 + Math.random() * 190;
  };

  /** Angle of the field at a point. Two sinusoids, slowly counter-rotating. */
  const angle = (x: number, y: number) =>
    Math.sin(x * 0.0032 + t) * 1.7 + Math.cos(y * 0.0027 - t * 0.7) * 1.7;

  return {
    init(w, h) {
      W = w;
      H = h;
      Object.assign(tokens, readTokens());
      ps = Array.from({ length: PARTICLES }, () => {
        const p: P = { x: 0, y: 0, life: 0, hot: Math.random() < 0.09 };
        reset(p);
        p.life = Math.random() * 240;
        return p;
      });
    },

    step(dt, _now, pointer: FieldPointer) {
      t += 0.00035 * dt;
      for (const p of ps) {
        const a = angle(p.x, p.y);
        let vx = Math.cos(a) * SPEED;
        let vy = Math.sin(a) * SPEED;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_PUSH && d > 0.5) {
            const f = (1 - d / CURSOR_PUSH) ** 2 * 3.4;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }

        p.x += vx * dt;
        p.y += vy * dt;
        p.life -= dt;
        if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) reset(p);
      }
    },

    draw(ctx, w, h) {
      // Fade rather than clear, which is what leaves the trails.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgb(0 0 0 / ${TRAIL_FADE})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const cool = new Path2D();
      const warm = new Path2D();
      for (const p of ps) {
        const path = p.hot ? warm : cool;
        path.moveTo(p.x + 0.9, p.y);
        path.arc(p.x, p.y, 0.9, 0, Math.PI * 2);
      }
      ctx.fillStyle = `rgb(${tokens.lattice} / 0.22)`;
      ctx.fill(cool);
      ctx.fillStyle = `rgb(${tokens.accent} / 0.3)`;
      ctx.fill(warm);
    },
  };
}

export function FlowField() {
  const ref = useFieldCanvas(createFlowField);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
