"use client";

import {
  readTokens,
  useFieldCanvas,
  type Field,
  type FieldPointer,
} from "@/lib/use-field-canvas";

/**
 * ATTENTION MATRIX.
 *
 * The most literal option: an actual attention map. A grid of query rows over
 * key columns, each cell an attention weight. Weights drift, and every couple
 * of seconds one head fires, sweeping a row bright from left to right the way
 * a causal mask fills in.
 *
 * Two properties fall out of the subject rather than being decoration. Column
 * 0 is permanently hotter than the rest, which is the attention sink, and the
 * upper triangle stays dark, which is causal masking. Anyone who works on
 * transformers will read both instantly; anyone who does not still sees an
 * ordered field with a diagonal.
 *
 * The cursor is a query: the row under it lights across its whole causal span.
 *
 * Denser than the lattice on purpose, so glass sitting on top has something to
 * refract.
 */

const CELL = 26;
const GAP = 2;
const FIRE_MS = 1500;
const SINK_BOOST = 0.42;

type Cell = { v: number; target: number };

function createMatrixField(): Field {
  const tokens = { accent: "255 61 139", lattice: "150 155 168", series2: "42 160 208" };
  let cells: Cell[] = [];
  let cols = 0;
  let rows = 0;
  let lastFire = 0;
  let sweepRow = -1;
  let sweepT = 0;

  const at = (r: number, c: number) => r * cols + c;

  return {
    init(w, h) {
      Object.assign(tokens, readTokens());
      cols = Math.ceil(w / (CELL + GAP)) + 1;
      rows = Math.ceil(h / (CELL + GAP)) + 1;
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Causal mask: a query at row r cannot attend to keys after it.
          const masked = c > r;
          const sink = c === 0 ? SINK_BOOST : 0;
          const base = masked ? 0 : 0.06 + Math.random() * 0.14 + sink;
          cells.push({ v: base, target: base });
        }
      }
    },

    step(dt, now, pointer: FieldPointer) {
      if (now - lastFire > FIRE_MS) {
        lastFire = now;
        sweepRow = Math.floor(Math.random() * rows);
        sweepT = 0;
        // Re-roll the drift targets for a scattering of cells so the map is
        // never quite the same twice.
        for (let k = 0; k < cells.length * 0.05; k++) {
          const i = Math.floor(Math.random() * cells.length);
          const r = Math.floor(i / cols);
          const c = i % cols;
          if (c > r) continue;
          cells[i].target = 0.06 + Math.random() * 0.16 + (c === 0 ? SINK_BOOST : 0);
        }
      }

      if (sweepRow >= 0) {
        sweepT += 0.05 * dt;
        const head = sweepT * cols;
        for (let c = 0; c < cols && c <= sweepRow; c++) {
          if (c < head && c > head - 7) {
            cells[at(sweepRow, c)].v = Math.min(1, cells[at(sweepRow, c)].v + 0.34);
          }
        }
        if (sweepT > 1.15) sweepRow = -1;
      }

      // The cursor is a query: its row lights across everything it may see.
      if (pointer.active) {
        const r = Math.floor(pointer.y / (CELL + GAP));
        const c = Math.floor(pointer.x / (CELL + GAP));
        if (r >= 0 && r < rows) {
          for (let k = 0; k <= Math.min(c, r); k++) {
            const i = at(r, k);
            if (i < cells.length) cells[i].v = Math.min(0.85, cells[i].v + 0.09 * dt);
          }
        }
      }

      for (const cell of cells) {
        cell.v += (cell.target - cell.v) * Math.min(1, 0.05 * dt);
      }
    },

    draw(ctx, w, h) {
      ctx.clearRect(0, 0, w, h);

      // Six alpha buckets, so this is six fills rather than a few thousand.
      const B = 6;
      const paths = Array.from({ length: B }, () => new Path2D());
      const hot = new Path2D();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = cells[at(r, c)];
          if (!cell || cell.v < 0.02) continue;
          const x = c * (CELL + GAP);
          const y = r * (CELL + GAP);
          if (cell.v > 0.5) {
            hot.rect(x, y, CELL, CELL);
          } else {
            const b = Math.min(B - 1, Math.floor((cell.v / 0.5) * B));
            paths[b].rect(x, y, CELL, CELL);
          }
        }
      }

      for (let b = 0; b < B; b++) {
        ctx.fillStyle = `rgb(${tokens.lattice} / ${(((b + 0.5) / B) * 0.5 * 0.34).toFixed(4)})`;
        ctx.fill(paths[b]);
      }
      // Only genuinely hot cells take the accent, which keeps a firing head
      // legible as an event against a neutral map.
      ctx.fillStyle = `rgb(${tokens.accent} / 0.2)`;
      ctx.fill(hot);
    },
  };
}

export function MatrixField() {
  const ref = useFieldCanvas(createMatrixField);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
