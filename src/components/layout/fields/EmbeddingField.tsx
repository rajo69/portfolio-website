"use client";

import {
  readTokens,
  useFieldCanvas,
  type Field,
  type FieldPointer,
} from "@/lib/use-field-canvas";

/**
 * EMBEDDING DRIFT.
 *
 * A point cloud that will not sit still. Points are pulled toward moving
 * centroids, and every few seconds the centroids jump, so the whole field
 * reorganises: clusters dissolve, points migrate, new groups settle. That is
 * the clustering-stability finding as wallpaper, the same data grouped two
 * ways and neither grouping being obviously the real one.
 *
 * Denser and more legible than the lattice by design, because glass cards need
 * something behind them to refract and near-black gives them nothing.
 *
 * The cursor is a gravity well: points within reach bend toward it and the
 * nearest few draw their assignment line, so pointing at the field shows you
 * which cluster owns what.
 */

const POINTS = 1500;
const CLUSTERS = 6;
const REASSIGN_MS = 5200;
const CURSOR_PULL = 190;

/**
 * `ox, oy` is the point's own seat inside its cluster. Without it every point
 * is attracted to the exact centroid, damping wins, and 1500 points collapse
 * into six dots. With it they settle into a cloud of the right shape.
 */
type P = { x: number; y: number; vx: number; vy: number; c: number; r: number; ox: number; oy: number };
type C = { x: number; y: number; tx: number; ty: number };

function createEmbeddingField(): Field {
  const tokens = { accent: "255 61 139", lattice: "150 155 168", series2: "42 160 208" };
  let pts: P[] = [];
  let cents: C[] = [];
  let W = 0;
  let H = 0;
  let lastReassign = 0;

  const gauss = () =>
    Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

  const place = (i: number) => {
    // Spread centroids on a jittered ring so they never all bunch centrally.
    const a = (i / CLUSTERS) * Math.PI * 2 + Math.random() * 0.8;
    const rad = 0.22 + Math.random() * 0.3;
    return { x: W * (0.5 + Math.cos(a) * rad), y: H * (0.5 + Math.sin(a) * rad * 0.9) };
  };

  return {
    init(w, h) {
      W = w;
      H = h;
      Object.assign(tokens, readTokens());
      cents = Array.from({ length: CLUSTERS }, (_, i) => {
        const p = place(i);
        return { x: p.x, y: p.y, tx: p.x, ty: p.y };
      });
      pts = Array.from({ length: POINTS }, () => {
        const c = Math.floor(Math.random() * CLUSTERS);
        return {
          x: cents[c].x + (Math.random() - 0.5) * 220,
          y: cents[c].y + (Math.random() - 0.5) * 220,
          vx: 0,
          vy: 0,
          c,
          r: 0.9 + Math.random() * 2.0,
          // Box-Muller, so clusters are Gaussian blobs rather than discs.
          ox: gauss() * 78,
          oy: gauss() * 66,
        };
      });
    },

    step(dt, now, pointer: FieldPointer) {
      if (now - lastReassign > REASSIGN_MS) {
        lastReassign = now;
        // Move two centroids and let their points follow. Reassigning every
        // point at once reads as a glitch; moving the attractors reads as the
        // data reorganising, which is the thing worth showing.
        for (let k = 0; k < 2; k++) {
          const i = Math.floor(Math.random() * CLUSTERS);
          const p = place(i);
          cents[i].tx = p.x;
          cents[i].ty = p.y;
        }
        // A slice of points switch allegiance to their now-nearest centroid.
        for (let n = 0; n < POINTS * 0.22; n++) {
          const p = pts[Math.floor(Math.random() * pts.length)];
          let best = p.c;
          let bd = Infinity;
          for (let i = 0; i < CLUSTERS; i++) {
            const d = (p.x - cents[i].x) ** 2 + (p.y - cents[i].y) ** 2;
            if (d < bd) {
              bd = d;
              best = i;
            }
          }
          p.c = best;
        }
      }

      for (const c of cents) {
        c.x += (c.tx - c.x) * Math.min(1, 0.012 * dt);
        c.y += (c.ty - c.y) * Math.min(1, 0.012 * dt);
      }

      for (const p of pts) {
        const c = cents[p.c];
        p.vx += (c.x + p.ox - p.x) * 0.00055 * dt;
        p.vy += (c.y + p.oy - p.y) * 0.00055 * dt;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_PULL && d > 1) {
            const f = (1 - d / CURSOR_PULL) ** 2 * 0.05 * dt;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        p.vx *= Math.pow(0.955, dt);
        p.vy *= Math.pow(0.955, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    },

    draw(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);

      // Assignment lines, only for points near the cursor, so the structure is
      // revealed where you look rather than drawn everywhere at once.
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = `rgb(${tokens.lattice} / 0.2)`;
      ctx.beginPath();
      let drawn = 0;
      for (const p of pts) {
        if (drawn > 420) break;
        const c = cents[p.c];
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d > 150) continue;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        drawn++;
      }
      ctx.stroke();

      // Points, bucketed by cluster so there are CLUSTERS fill calls, not 460.
      const paths = Array.from({ length: CLUSTERS }, () => new Path2D());
      for (const p of pts) {
        paths[p.c].moveTo(p.x + p.r, p.y);
        paths[p.c].arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      for (let i = 0; i < CLUSTERS; i++) {
        // One cluster carries the accent. The rest stay neutral, so the field
        // reads as structure rather than as a colour wheel.
        const colour = i === 0 ? tokens.accent : i === 3 ? tokens.series2 : tokens.lattice;
        ctx.fillStyle = `rgb(${colour} / ${i === 0 ? 0.6 : i === 3 ? 0.45 : 0.4})`;
        ctx.fill(paths[i]);
      }

      // Centroids.
      for (const c of cents) {
        ctx.strokeStyle = `rgb(${tokens.lattice} / 0.4)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
  };
}

export function EmbeddingField() {
  const ref = useFieldCanvas(createEmbeddingField);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
