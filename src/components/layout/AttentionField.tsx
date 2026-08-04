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
 *   4. YOU ARE THE  The cursor is the query token. Structure brightens around
 *      QUERY        it with a distance falloff, and most heads now fire from
 *                   the node nearest the pointer instead of a random one.
 *   5. IT BREATHES  Every node drifts on its own slow phase, so the lattice is
 *                   alive between events rather than frozen.
 *
 * WHY THE CURSOR IS A QUERY AND NOT A REPULSOR. Pushing particles away from
 * the pointer is the stock effect and means nothing. In attention, a query
 * attends over keys with weights that fall off by similarity, so moving the
 * pointer moves the query and the field answers. That is the one interaction
 * that is actually about the subject of this site.
 *
 * PROXIMITY BRIGHTENS IN NEUTRAL, NEVER IN ACCENT. The cursor reveals
 * structure, it does not paint a pink blob across the page. Only a firing head
 * takes the accent, which is what keeps an event legible as an event and keeps
 * the accent budget for the numbers.
 *
 * Budget: ≤620 nodes, DPR capped at 2, paused when off-screen or on a hidden
 * tab, pointer work gated to fine pointers. Reads --accent at runtime, so
 * swapping the token restyles the canvas.
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
  /** Attention weight from the cursor-as-query, 0..1, lerped for smoothness. */
  attend: number;
  /** Per-node phase so the drift never looks like one synchronised wave. */
  phase: number;
  /** Current drift offset, recomputed each step and applied at draw time. */
  dx: number;
  dy: number;
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

const FIRE_INTERVAL = 900; // ms between attention heads firing
const GATE_INTERVAL = 2400; // ms between gate events

/** How far the cursor-query attends, in px. */
const ATTEND_RADIUS = 340;
/** Chance a head fires from the cursor rather than at random, when pointing. */
const ATTEND_FIRE_BIAS = 0.7;
/**
 * Alpha added at full attention. Tuned by sampling `getImageData`, not by eye.
 *
 * Measured in a 300px box around the cursor against an unattended box of the
 * same size: 2.45x the lit pixels, and 3.8x the total light once lit fraction
 * and mean alpha are combined. Whole-canvas resting density is unchanged at
 * 6.8% lit, so the field has not crept toward competing with the copy.
 *
 * The first pass at 0.5 / 0.24 measured 2.3x total and read as almost nothing
 * on a dark screen, which is the same failure mode DESIGN.md records from the
 * original build. Sample after any change to these two numbers.
 */
const ATTEND_NODE_GAIN = 0.72;
const ATTEND_EDGE_GAIN = 0.34;
/** Idle drift, so the lattice is alive between events. Peak offset in px. */
const DRIFT_AMP = 1.7;
const DRIFT_SPEED = 0.00035; // rad per ms

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
  if (clean.length !== 6) return "0 232 140"; // --accent fallback, #00e88c
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
const EDGE_BASE_ALPHA = 0.2;
const LONG_EDGE_BASE_ALPHA = 0.1;
const NODE_BASE_ALPHA = 0.34;

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

    const css = getComputedStyle(document.documentElement);
    const accent = parseHex(css.getPropertyValue("--accent"));
    // The resting lattice is deliberately NOT the accent. When every edge was
    // pink the page read as pink soup and a firing head was indistinguishable
    // from the background. Neutral at rest means an event actually reads as
    // an event, and it keeps the accent budget for the numbers.
    const lattice = css.getPropertyValue("--lattice").trim() || "150 155 168";

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let width = 0;
    let height = 0;

    /**
     * The cursor-as-query. Canvas is `fixed inset-0`, so client coordinates
     * are canvas coordinates and no rect maths is needed.
     */
    const pointer = { x: -9999, y: -9999, active: false };

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
            attend: 0,
            phase: Math.random() * Math.PI * 2,
            dx: 0,
            dy: 0,
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

    /** Nearest node to the cursor, or -1 if the pointer is away or idle. */
    function queryNode(): number {
      if (!pointer.active) return -1;
      let best = -1;
      let bestD = ATTEND_RADIUS * ATTEND_RADIUS;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - pointer.x;
        const dy = nodes[i].y - pointer.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    }

    /** One attention head fires: a query node lights its edges. */
    function fireHead() {
      if (!nodes.length) return;

      // Most of the time, fire from wherever the reader is pointing. That is
      // the whole interaction: the cursor is the query, so the field answers
      // where you are rather than somewhere you are not looking.
      let query = -1;
      if (Math.random() < ATTEND_FIRE_BIAS) query = queryNode();
      if (query < 0) query = Math.floor(Math.random() * nodes.length);

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
        // An edge is as attended as its more attended endpoint.
        const attend = Math.max(a.attend, b.attend);
        const alpha =
          (rest * edge.base + edge.flash * 0.28 + attend * ATTEND_EDGE_GAIN) * gate;
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
        edgePaths[bucket].moveTo(a.x + a.dx, a.y + a.dy);
        edgePaths[bucket].lineTo(b.x + b.dx, b.y + b.dy);
      }

      ctx!.lineWidth = 0.6;
      for (let b = 0; b < BUCKETS; b++) {
        const alpha = ((b + 0.5) / BUCKETS) * EDGE_MAX_ALPHA;
        ctx!.strokeStyle = `rgb(${lattice} / ${alpha})`;
        ctx!.stroke(edgePaths[b]);
      }

      for (const edge of hot) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const gate = Math.min(a.gate, b.gate);
        // Only genuinely hot edges get the accent, which is what makes a
        // firing head legible against a neutral field.
        ctx!.strokeStyle = `rgb(${accent} / ${Math.min(0.85, 0.25 + edge.flash * 0.4) * gate})`;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(a.x + a.dx, a.y + a.dy);
        ctx!.lineTo(b.x + b.dx, b.y + b.dy);
        ctx!.stroke();
      }

      /* --- Nodes ---
         Accent is decided by `flash`, NOT by which alpha bucket a node lands
         in. The previous version inferred "hot" from the top two buckets,
         which was fine while flash was the only thing that could push a node
         that bright. Cursor attention can now do it too, and keying off the
         bucket would turn the pointer into a travelling pink blob. Firing is
         accent; proximity is neutral and brighter. */
      const nodePaths = Array.from({ length: BUCKETS }, () => new Path2D());
      const nodePathsHot = Array.from({ length: BUCKETS }, () => new Path2D());

      for (const node of nodes) {
        const alpha =
          (NODE_BASE_ALPHA + node.flash * 0.5 + node.attend * ATTEND_NODE_GAIN) *
          node.gate;
        if (alpha < 0.004) continue;
        const bucket = Math.min(
          BUCKETS - 1,
          Math.floor((alpha / NODE_MAX_ALPHA) * BUCKETS));
        // Attention swells a node slightly as well as brightening it, which
        // is what makes the cursor feel like it has a field around it.
        const radius = node.r * (1 + node.flash * 0.8 + node.attend * 0.45);
        const path = node.flash > 0.25 ? nodePathsHot[bucket] : nodePaths[bucket];
        path.moveTo(node.x + node.dx + radius, node.y + node.dy);
        path.arc(node.x + node.dx, node.y + node.dy, radius, 0, Math.PI * 2);
      }

      for (let b = 0; b < BUCKETS; b++) {
        const alpha = ((b + 0.5) / BUCKETS) * NODE_MAX_ALPHA;
        ctx!.fillStyle = `rgb(${lattice} / ${alpha})`;
        ctx!.fill(nodePaths[b]);
        ctx!.fillStyle = `rgb(${accent} / ${alpha})`;
        ctx!.fill(nodePathsHot[b]);
      }

      // --- Pulses: never more than MAX_PULSES, so drawn individually ---
      for (const pulse of pulses) {
        const edge = edges[pulse.edge];
        if (!edge) continue;
        const from = pulse.dir === 1 ? nodes[edge.a] : nodes[edge.b];
        const to = pulse.dir === 1 ? nodes[edge.b] : nodes[edge.a];
        const gate = Math.min(from.gate, to.gate);
        if (gate < 0.05) continue;

        const fx = from.x + from.dx;
        const fy = from.y + from.dy;
        const x = fx + (to.x + to.dx - fx) * pulse.t;
        const y = fy + (to.y + to.dy - fy) * pulse.t;
        // Fade in and out across the traverse rather than popping.
        const fade = Math.sin(pulse.t * Math.PI);

        ctx!.fillStyle = `rgb(${accent} / ${0.75 * fade * gate})`;
        ctx!.beginPath();
        ctx!.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    /** Advance state. `dt` is normalised to 60fps so speed is frame-independent. */
    function step(dt: number, now: number) {
      const t = now * DRIFT_SPEED;
      const r2 = ATTEND_RADIUS * ATTEND_RADIUS;

      for (const node of nodes) {
        node.flash *= Math.pow(0.94, dt);
        node.gate += (node.gateTarget - node.gate) * Math.min(1, 0.06 * dt);

        // Idle drift. Two different frequencies so it wanders rather than
        // orbiting, and the phase is per node so the field never pulses as
        // one synchronised sheet.
        node.dx = Math.cos(t + node.phase) * DRIFT_AMP;
        node.dy = Math.sin(t * 0.8 + node.phase * 1.3) * DRIFT_AMP;

        // Attention weight from the cursor. Squared falloff, which is close
        // enough to a softmax over distance to read correctly and far cheaper.
        // Measured against the base position, not the drifted one, so the
        // field does not shimmer.
        let target = 0;
        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const f = 1 - Math.sqrt(d2) / ATTEND_RADIUS;
            target = f * f;
          }
        }
        node.attend += (target - node.attend) * Math.min(1, 0.14 * dt);
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
      // Static single frame: the page keeps its texture, nothing moves, and
      // no pointer listener is attached. Someone who asked for less motion
      // does not want the background tracking their cursor either.
      for (let k = 0; k < 6; k++) fireHead();
      step(1, performance.now());
      draw();
      return;
    }

    // Cursor-as-query, fine pointers only. On touch there is no hover state to
    // track, and a field that lit up under the last tap would be noise.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerOut = () => {
      // Let attention decay rather than snapping off.
      pointer.active = false;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerOut);
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

      step(dt, now);
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
      if (finePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerOut);
      }
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
