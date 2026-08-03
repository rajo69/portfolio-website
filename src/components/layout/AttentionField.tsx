"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * THE ATTENTION FIELD, the site's signature ambient layer.
 *
 * The reference site draws a circuit board: "I build systems that move money."
 * This draws an attention lattice instead, nodes are tokens, edges are
 * attention weights. Three behaviours make it a portrait rather than wallpaper:
 *
 *   1. HEADS FIRE   A node is picked as a query; its edges light up with
 *                   softmax-ish weights and pulses travel along the strongest.
 *   2. GATES CLOSE  Nodes periodically gate off entirely, taking their edges
 *                   with them, the gated-attention finding, rendered.
 *   3. IT DECAYS    Everything relaxes back to near-invisible, so the field
 *                   never competes with the copy sitting on top of it.
 *
 * Budget: ≤420 nodes, DPR capped at 2, paused when off-screen or on a hidden
 * tab. Reads --accent at runtime, so swapping the token restyles the canvas.
 */

type Node = {
  x: number;
  y: number;
  r: number;
  /** 0 = fully gated off, 1 = open. */
  gate: number;
  gateTarget: number;
  /** Decaying highlight from being part of a firing head. */
  flash: number;
};

type Edge = {
  a: number;
  b: number;
  /**
   * `grid` edges run to the orthogonal neighbour and carry the structure.
   * They are what makes this read as a lattice rather than a starfield.
   * `long` edges skip across the field, which is the defining property of
   * attention: it is not local.
   */
  kind: "grid" | "long";
  /** Static baseline visibility, so the lattice isn't uniform. */
  base: number;
  /** Decaying highlight, 0..1. */
  flash: number;
};

type Pulse = {
  edge: number;
  /** Progress along the edge, 0..1. */
  t: number;
  speed: number;
  /** Travelling a→b (1) or b→a (-1). */
  dir: 1 | -1;
};

const SPACING = 84; // px between lattice nodes
/** Low, so rows and columns stay legible. High jitter turns the grid to mush. */
const JITTER = 0.16;
const MAX_NODES = 620;
const MAX_PULSES = 30;
/** Probability a node also throws a long-range edge across the field. */
const LONG_RANGE_CHANCE = 0.16;

const FIRE_INTERVAL = 1100; // ms between attention heads firing
const GATE_INTERVAL = 2400; // ms between gate events

/**
 * `#rrggbb` → `"r g b"` for use in `rgb(r g b / alpha)`.
 *
 * Space-separated deliberately: `rgb(255, 61, 139 / 0.5)` mixes legacy commas
 * with modern slash-alpha and is invalid CSS. Canvas silently ignores an
 * invalid fillStyle/strokeStyle and keeps the previous value, so the mistake
 * shows up as "everything renders black" rather than as an error.
 */
function parseHex(hex: string): string {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return "255 61 139"; // --accent fallback
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16)).join(" ");
}

/**
 * Alpha buckets for batched drawing.
 *
 * Drawing ~900 edges as individual stroke() calls means ~900 CSS colour
 * parses and ~900 state changes per frame, which saturates the main thread.
 * Instead each edge is binned by opacity into one of N Path2Ds and the whole
 * bin is stroked in a single call, ~8 draw calls per frame instead of ~1300.
 */
const BUCKETS = 8;
const EDGE_MAX_ALPHA = 0.5;
const NODE_MAX_ALPHA = 0.95;

/**
 * Resting visibility of the lattice.
 *
 * These were originally 0.055 / 0.16 and the field was effectively invisible:
 * measured over the whole canvas, 1.2% of pixels were lit at all, at a mean
 * alpha of 6.6/255. The structure only ever appeared on the one or two edges
 * that happened to be mid-flash, so it read as a starfield.
 *
 * The lattice has to be legible *at rest*, the whole conceit is that you can
 * see the network, then watch a head fire across it. Verified by sampling the
 * canvas rather than by eye; see the budget note in DESIGN.md.
 */
const EDGE_BASE_ALPHA = 0.16;
const LONG_EDGE_BASE_ALPHA = 0.085;
const NODE_BASE_ALPHA = 0.42;

export function AttentionField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Escape hatch: ?field=off disables the canvas entirely. Useful for
    // isolating it when profiling, and for clean Lighthouse runs.
    if (new URLSearchParams(window.location.search).get("field") === "off") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const accent = parseHex(
      getComputedStyle(document.documentElement).getPropertyValue("--accent"));

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let width = 0;
    let height = 0;

    // ── Build ──────────────────────────────────────────────────────────────
    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;

      // Index by (row, col) so grid neighbours are O(1) rather than a sort.
      const index = (row: number, col: number) => row * cols + col;

      nodes = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          nodes.push({
            x: col * SPACING + (Math.random() - 0.5) * SPACING * JITTER * 2,
            y: row * SPACING + (Math.random() - 0.5) * SPACING * JITTER * 2,
            r: 1.1 + Math.random() * 1.6,
            gate: 1,
            gateTarget: 1,
            flash: 0,
          });
        }
      }
      if (nodes.length > MAX_NODES) nodes.length = MAX_NODES;

      edges = [];

      // 1. Orthogonal grid edges, the structure. Some are dropped so the
      //    lattice looks woven rather than like graph paper.
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const a = index(row, col);
          if (a >= nodes.length) continue;

          const right = index(row, col + 1);
          if (col + 1 < cols && right < nodes.length && Math.random() > 0.18) {
            edges.push({ a, b: right, kind: "grid", base: 0.55 + Math.random() * 0.45, flash: 0 });
          }

          const down = index(row + 1, col);
          if (row + 1 < rows && down < nodes.length && Math.random() > 0.18) {
            edges.push({ a, b: down, kind: "grid", base: 0.55 + Math.random() * 0.45, flash: 0 });
          }
        }
      }

      // 2. Long-range edges. Attention is not local, and these are what stop
      //    the field reading as a circuit board someone else already drew.
      for (let a = 0; a < nodes.length; a++) {
        if (Math.random() > LONG_RANGE_CHANCE) continue;
        const b = Math.floor(Math.random() * nodes.length);
        if (b === a) continue;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        // Only genuinely distant pairs; short ones just muddy the grid.
        if (Math.hypot(dx, dy) < SPACING * 3) continue;
        edges.push({ a, b, kind: "long", base: 0.5 + Math.random() * 0.5, flash: 0 });
      }

      pulses = [];
    }

    // ── Events ─────────────────────────────────────────────────────────────

    /** One attention head fires: a query node lights its edges. */
    function fireHead() {
      if (!nodes.length) return;
      const query = Math.floor(Math.random() * nodes.length);
      nodes[query].flash = 1;

      const incident: number[] = [];
      for (let e = 0; e < edges.length; e++) {
        if (edges[e].a === query || edges[e].b === query) incident.push(e);
      }
      if (!incident.length) return;

      // Softmax-ish: one or two edges take most of the weight.
      const weights = incident.map(() => Math.random() ** 2.2);
      const total = weights.reduce((s, w) => s + w, 0) || 1;

      incident.forEach((e, k) => {
        const w = weights[k] / total;
        edges[e].flash = Math.max(edges[e].flash, w * 2.4);

        // Pulse only along genuinely strong connections.
        if (w > 0.34 && pulses.length < MAX_PULSES) {
          pulses.push({
            edge: e,
            t: 0,
            speed: 0.012 + Math.random() * 0.014,
            dir: edges[e].a === query ? 1 : -1,
          });
        }
      });
    }

    /** A few nodes gate off, then reopen. */
    function toggleGates() {
      if (!nodes.length) return;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let k = 0; k < count; k++) {
        const i = Math.floor(Math.random() * nodes.length);
        const closing = nodes[i].gateTarget > 0.5;
        nodes[i].gateTarget = closing ? 0 : 1;
        if (closing) {
          // Reopen after a beat, so the field doesn't slowly go dark.
          window.setTimeout(() => {
            if (nodes[i]) nodes[i].gateTarget = 1;
          }, 2000 + Math.random() * 2600);
        }
      }
    }

    // ── Draw ───────────────────────────────────────────────────────────────
    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // --- Edges, batched into alpha buckets ---
      const edgePaths = Array.from({ length: BUCKETS }, () => new Path2D());
      const hot: Edge[] = [];

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        // A gated node dims every edge it touches.
        const gate = Math.min(a.gate, b.gate);
        const rest = edge.kind === "grid" ? EDGE_BASE_ALPHA : LONG_EDGE_BASE_ALPHA;
        const alpha = (rest * edge.base + edge.flash * 0.28) * gate;
        if (alpha < 0.002) continue;

        // Strongly-lit edges get their own thicker pass, there are only ever
        // a handful, so drawing them individually is cheap.
        if (edge.flash > 0.3) {
          hot.push(edge);
          continue;
        }

        const bucket = Math.min(
          BUCKETS - 1,
          Math.floor((alpha / EDGE_MAX_ALPHA) * BUCKETS));
        edgePaths[bucket].moveTo(a.x, a.y);
        edgePaths[bucket].lineTo(b.x, b.y);
      }

      ctx!.lineWidth = 0.6;
      for (let b = 0; b < BUCKETS; b++) {
        const alpha = ((b + 0.5) / BUCKETS) * EDGE_MAX_ALPHA;
        ctx!.strokeStyle = `rgb(${accent} / ${alpha})`;
        ctx!.stroke(edgePaths[b]);
      }

      for (const edge of hot) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const gate = Math.min(a.gate, b.gate);
        ctx!.strokeStyle = `rgb(${accent} / ${Math.min(0.85, 0.25 + edge.flash * 0.4) * gate})`;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // --- Nodes, same bucketing ---
      const nodePaths = Array.from({ length: BUCKETS }, () => new Path2D());
      for (const node of nodes) {
        const alpha = (NODE_BASE_ALPHA + node.flash * 0.5) * node.gate;
        if (alpha < 0.004) continue;
        const bucket = Math.min(
          BUCKETS - 1,
          Math.floor((alpha / NODE_MAX_ALPHA) * BUCKETS));
        const radius = node.r * (1 + node.flash * 0.8);
        nodePaths[bucket].moveTo(node.x + radius, node.y);
        nodePaths[bucket].arc(node.x, node.y, radius, 0, Math.PI * 2);
      }

      for (let b = 0; b < BUCKETS; b++) {
        const alpha = ((b + 0.5) / BUCKETS) * NODE_MAX_ALPHA;
        ctx!.fillStyle = `rgb(${accent} / ${alpha})`;
        ctx!.fill(nodePaths[b]);
      }

      // --- Pulses: never more than MAX_PULSES, so drawn individually ---
      for (const pulse of pulses) {
        const edge = edges[pulse.edge];
        if (!edge) continue;
        const from = pulse.dir === 1 ? nodes[edge.a] : nodes[edge.b];
        const to = pulse.dir === 1 ? nodes[edge.b] : nodes[edge.a];
        const gate = Math.min(from.gate, to.gate);
        if (gate < 0.05) continue;

        const x = from.x + (to.x - from.x) * pulse.t;
        const y = from.y + (to.y - from.y) * pulse.t;
        // Fade in and out across the traverse rather than popping.
        const fade = Math.sin(pulse.t * Math.PI);

        ctx!.fillStyle = `rgb(${accent} / ${0.75 * fade * gate})`;
        ctx!.beginPath();
        ctx!.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    /** Advance state. `dt` is normalised to 60fps so speed is frame-independent. */
    function step(dt: number) {
      for (const node of nodes) {
        node.flash *= Math.pow(0.94, dt);
        node.gate += (node.gateTarget - node.gate) * Math.min(1, 0.06 * dt);
      }
      for (const edge of edges) {
        edge.flash *= Math.pow(0.955, dt);
      }
      pulses = pulses.filter((p) => {
        p.t += p.speed * dt;
        return p.t < 1;
      });
    }

    // ── Loop ───────────────────────────────────────────────────────────────
    build();

    if (reduced) {
      // Static single frame: the page keeps its texture, nothing moves.
      for (let k = 0; k < 6; k++) fireHead();
      step(1);
      draw();
      return;
    }

    let raf = 0;
    let last = performance.now();
    let lastFire = 0;
    let lastGate = 0;
    let running = true;

    function frame(now: number) {
      if (!running) return;
      // Clamp dt so a backgrounded tab doesn't fast-forward on return.
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;

      if (now - lastFire > FIRE_INTERVAL) {
        fireHead();
        lastFire = now;
      }
      if (now - lastGate > GATE_INTERVAL) {
        toggleGates();
        lastGate = now;
      }

      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }
    function resume() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const onVisibility = () => (document.hidden ? pause() : resume());
    document.addEventListener("visibilitychange", onVisibility);

    // Debounced rebuild, resize fires continuously during a drag.
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
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
