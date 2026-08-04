"use client";

import { useMemo, useRef, useState } from "react";

import { Label } from "@/components/type";
import {
  guardsFor,
  harnessGuards,
  harnessMeta,
  harnessNodes,
  harnessStages,
  nodeById,
  pipelineEdges,
  type HarnessKind,
  type HarnessNode,
} from "@/content/data/harness";

/**
 * THE APPLICATION HARNESS, drawn two ways over one data set.
 *
 * WHY TWO VIEWS. The vault this comes from is an Obsidian graph, and the graph
 * is how Rajarshi thinks about the system, so it earns its place. But a
 * force-directed hairball of 40 nodes explains nothing to someone seeing it for
 * the first time: it shows that the system is large, which is the least
 * interesting thing about it. The pipeline view carries the argument, the graph
 * view carries the texture. The toggle exists because he wanted both, and
 * because they genuinely answer different questions.
 *
 * COLOUR ENCODES KIND, AND NOTHING ELSE. Deliberately the same vocabulary as
 * ArchitectureDiagram, so the two diagrams on this site do not speak different
 * languages: series-1 marks code that raises, a dashed stroke marks
 * persistence, and selection is carried by weight plus an accent underline
 * rather than by hue. That last rule is load bearing. Turning the selected node
 * accent would collide with series-1, and there would be no way to tell "this
 * node has teeth" from "this is the one you are pointing at".
 *
 * THE GRAPH LAYOUT IS PRECOMPUTED, NOT SIMULATED LIVE. A deterministic spring
 * relaxation runs once at module load with a fixed seed and a fixed iteration
 * count, so the server and the client produce identical coordinates and there
 * is no hydration mismatch, no animation loop, and nothing to disable for
 * prefers-reduced-motion. Dragging moves one node and never restarts a
 * simulation. See `layout()`.
 *
 * WITHOUT JAVASCRIPT: the same contract as ArchitectureDiagram. Every node
 * label ships in the server-rendered SVG, and the detail panel renders for the
 * default selection. Nothing here starts at opacity 0.
 */

/* ------------------------------------------------------------------ *
 * Shared visual vocabulary.
 * ------------------------------------------------------------------ */

/** series-1 is reserved for the things that raise. Everything else is ink. */
function strokeFor(kind: HarnessKind) {
  return kind === "component" ? "var(--series-1)" : "var(--ink-500)";
}

function fillFor(kind: HarnessKind) {
  if (kind === "component") return "var(--series-1-band-wide)";
  if (kind === "principle") return "var(--ink-800)";
  return "var(--ink-700)";
}

function dashFor(kind: HarnessKind) {
  if (kind === "store") return "4 3";
  if (kind === "skill") return "1 3";
  return undefined;
}

/**
 * The graph needs a lighter neutral than the pipeline does, and this is not a
 * style preference. --ink-500 reads fine as the border of a 104px box; on a
 * 6px dot and a hairline edge, over a translucent panel with a canvas moving
 * behind it, it disappeared. Measured on the rendered page: the first version
 * showed accent edges from the selection and essentially no others, so forty
 * linked notes read as forty unconnected dots. Kind is still the only thing
 * carried by hue; this is the same vocabulary at a legible weight.
 */
const GRAPH_NODE_STROKE = "var(--paper-faint)";
const GRAPH_EDGE_STROKE = "var(--line-strong)";

const KIND_LABEL: Record<HarnessKind, string> = {
  stage: "Pipeline stage",
  component: "Code that raises",
  store: "Persistence",
  principle: "Design principle",
  skill: "Judgement half",
};

const LEGEND: HarnessKind[] = ["stage", "component", "store", "principle", "skill"];

/* ------------------------------------------------------------------ *
 * Pipeline geometry. Ten stages, one branch, one loop back.
 * ------------------------------------------------------------------ */

const P_W = 1180;
const P_H = 300;
const COL_W = 104;
const COL_GAP = 16;
const BOX_H = 62;
const MID_Y = 118;

/**
 * Column per stage, except Statement and Tailored CV, which share a column
 * because Scout genuinely fans out to both and they both feed Fill. Drawing
 * them in series would be tidier and would misstate the pipeline.
 */
const COLUMN: Record<string, number> = {
  recon: 0,
  register: 1,
  harvest: 2,
  scout: 3,
  statement: 4,
  cv: 4,
  fill: 5,
  gate: 6,
  finish: 7,
  kb: 8,
};

const STACKED = new Set(["statement", "cv"]);

function pipeX(id: string) {
  return 24 + COLUMN[id] * (COL_W + COL_GAP);
}

function pipeY(id: string) {
  if (id === "statement") return MID_Y - 44;
  if (id === "cv") return MID_Y + 44;
  return MID_Y;
}

/* ------------------------------------------------------------------ *
 * Graph layout, computed once, deterministically.
 * ------------------------------------------------------------------ */

const G_W = 1000;
const G_H = 660;

/**
 * Spring-electrical constants, tuned by measuring the result rather than by
 * eye. The first attempt used rep 5200 / att 260 / gravity 0.012 and collapsed
 * all forty nodes into roughly a third of the canvas, which is the hairball
 * this view exists to avoid.
 *
 * For a connected pair the equilibrium separation is (REP * ATT) ^ 0.25, so
 * these give a nominal edge around 90px before aggregate repulsion from the
 * other 38 nodes pushes it wider. GRAVITY only has to stop a disconnected
 * cluster drifting off-canvas; anything stronger fights the repulsion and the
 * clump comes back.
 */
const REP = 62000;
const ATT = 700;
const GRAVITY = 0.0035;

interface Pt {
  x: number;
  y: number;
}

function layout(): Record<string, Pt> {
  const ids = harnessNodes.map((n) => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const n = ids.length;

  // Deterministic seed spiral. Golden-angle spacing keeps the start spread
  // even, and starting wide costs nothing since the sim only has to relax.
  const pos: Pt[] = ids.map((_, i) => {
    const a = i * 2.399963;
    const r = 70 + (i / n) * 290;
    return { x: G_W / 2 + Math.cos(a) * r, y: G_H / 2 + Math.sin(a) * r * 0.66 };
  });

  // Undirected edge list, deduplicated. A link in either note counts once.
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const node of harnessNodes) {
    const a = idx.get(node.id)!;
    for (const target of node.links) {
      const b = idx.get(target);
      if (b === undefined || b === a) continue;
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([a, b]);
    }
  }

  // Spring relaxation. Fixed iteration count, no randomness, so this is a pure
  // function of the data and produces the same layout everywhere it runs.
  const ITER = 600;
  for (let step = 0; step < ITER; step++) {
    const cool = 1 - step / ITER;
    const disp: Pt[] = pos.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i].x - pos[j].x;
        let dy = pos[i].y - pos[j].y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          // Deterministic nudge, never Math.random, or the layout would differ
          // between server and client and React would complain about it.
          dx = ((i % 7) - 3) * 0.5 || 0.5;
          dy = ((j % 5) - 2) * 0.5 || 0.5;
          d2 = dx * dx + dy * dy;
        }
        const rep = REP / d2;
        const d = Math.sqrt(d2);
        disp[i].x += (dx / d) * rep;
        disp[i].y += (dy / d) * rep;
        disp[j].x -= (dx / d) * rep;
        disp[j].y -= (dy / d) * rep;
      }
    }

    for (const [a, b] of edges) {
      const dx = pos[a].x - pos[b].x;
      const dy = pos[a].y - pos[b].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const att = (d * d) / ATT;
      disp[a].x -= (dx / d) * att;
      disp[a].y -= (dy / d) * att;
      disp[b].x += (dx / d) * att;
      disp[b].y += (dy / d) * att;
    }

    for (let i = 0; i < n; i++) {
      // Gentle pull to centre, so disconnected clusters cannot drift off-canvas.
      disp[i].x += (G_W / 2 - pos[i].x) * GRAVITY;
      disp[i].y += (G_H / 2 - pos[i].y) * GRAVITY;

      const dl = Math.sqrt(disp[i].x ** 2 + disp[i].y ** 2) || 1;
      const cap = Math.min(dl, 46 * cool);
      pos[i].x += (disp[i].x / dl) * cap;
      pos[i].y += (disp[i].y / dl) * cap;
      pos[i].x = Math.max(58, Math.min(G_W - 58, pos[i].x));
      pos[i].y = Math.max(30, Math.min(G_H - 30, pos[i].y));
    }
  }

  /**
   * Normalise into the canvas. Without this the relaxed graph settles wherever
   * the seed spiral happened to leave it: the first tuned run occupied x 102 to
   * 737 of 1000 and left the right third empty. Fitting the bounding box makes
   * the layout independent of the force constants, so retuning them cannot
   * reintroduce dead space or push a label off the edge.
   */
  const PAD_X = 74;
  const PAD_Y = 34;
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  // Uniform scale, so the graph is not stretched into a different shape.
  const s = Math.min(
    (G_W - PAD_X * 2) / Math.max(maxX - minX, 1),
    (G_H - PAD_Y * 2) / Math.max(maxY - minY, 1)
  );
  const offX = (G_W - (maxX - minX) * s) / 2 - minX * s;
  const offY = (G_H - (maxY - minY) * s) / 2 - minY * s;

  return Object.fromEntries(
    ids.map((id, i) => [id, { x: pos[i].x * s + offX, y: pos[i].y * s + offY }])
  );
}

const BASE_LAYOUT = layout();

const GRAPH_EDGES: [string, string][] = (() => {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const node of harnessNodes) {
    for (const target of node.links) {
      if (!nodeById.has(target)) continue;
      const key = node.id < target ? `${node.id}:${target}` : `${target}:${node.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([node.id, target]);
    }
  }
  return out;
})();

/* ------------------------------------------------------------------ *
 * Component.
 * ------------------------------------------------------------------ */

type View = "pipeline" | "graph";

export function HarnessMap() {
  const [view, setView] = useState<View>("pipeline");
  const [selId, setSelId] = useState<string>("fill");
  const [drag, setDrag] = useState<Record<string, Pt>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef<string | null>(null);

  const node: HarnessNode = nodeById.get(selId) ?? nodeById.get("fill")!;
  const guards = useMemo(() => guardsFor(node.id), [node.id]);
  const at = (id: string) => drag[id] ?? BASE_LAYOUT[id];

  /** Pointer drag in the graph view, in viewBox units. */
  function toViewBox(e: React.PointerEvent): Pt | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * G_W,
      y: ((e.clientY - r.top) / r.height) * G_H,
    };
  }

  return (
    <div className="surface rounded-lg p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Label as="h4">The application harness</Label>
          <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-paper-dim">
            {harnessMeta.contract}
          </p>
        </div>

        <div
          role="group"
          aria-label="View"
          className="inline-flex flex-wrap gap-1 rounded-full border border-line p-1"
        >
          {(
            [
              ["pipeline", "Pipeline"],
              ["graph", "Graph"],
            ] as [View, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 motion-reduce:transition-none ${
                view === key
                  ? "bg-accent text-on-accent"
                  : "text-paper-faint hover:text-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- PIPELINE ---------------- */}
      {view === "pipeline" && (
        <div className="mt-7 overflow-x-auto">
          <svg
            viewBox={`0 0 ${P_W} ${P_H}`}
            className="h-auto w-full min-w-[820px]"
            role="img"
            aria-label={`The pipeline runs ${harnessStages
              .map((s) => s.label)
              .join(", then ")}. A human submits between Gate and Handover and Finish. Write-back loops back to Recon.`}
          >
            <defs>
              <marker id="hm-arw" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--ink-500)" />
              </marker>
            </defs>

            <text
              x={24}
              y={30}
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11, letterSpacing: "0.1em" }}
            >
              JOB_URL
            </text>
            <text
              x={P_W - 24}
              y={30}
              textAnchor="end"
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11, letterSpacing: "0.1em" }}
            >
              FILLED, VERIFIED, NOT SUBMITTED
            </text>

            {pipelineEdges.map(([a, b]) => {
              const ax = pipeX(a) + COL_W;
              const ay = pipeY(a) + BOX_H / 2;
              const bx = pipeX(b) - 8;
              const by = pipeY(b) + BOX_H / 2;
              const mx = (ax + bx) / 2;
              return (
                <path
                  key={`${a}-${b}`}
                  d={
                    ay === by
                      ? `M ${ax} ${ay} L ${bx} ${by}`
                      : `M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`
                  }
                  fill="none"
                  stroke="var(--ink-500)"
                  markerEnd="url(#hm-arw)"
                />
              );
            })}

            {/* The loop back. Dashed, because it is knowledge rather than control
                flow: the next run is cheaper, it does not re-enter this one. */}
            <path
              d={`M ${pipeX("kb") + COL_W / 2} ${MID_Y + BOX_H} L ${pipeX("kb") + COL_W / 2} ${P_H - 42} L ${pipeX("recon") + COL_W / 2} ${P_H - 42} L ${pipeX("recon") + COL_W / 2} ${MID_Y + BOX_H}`}
              fill="none"
              stroke="var(--ink-500)"
              strokeDasharray="3 4"
              markerEnd="url(#hm-arw)"
            />
            <text
              x={(pipeX("kb") + pipeX("recon")) / 2 + COL_W / 2}
              y={P_H - 50}
              textAnchor="middle"
              fill="var(--paper-faint)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
            >
              run N+1 is cheaper
            </text>

            {/* The human, between Gate and Finish. */}
            <text
              x={(pipeX("gate") + COL_W + pipeX("finish")) / 2}
              y={MID_Y - 12}
              textAnchor="middle"
              fill="var(--accent)"
              style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10, letterSpacing: "0.1em" }}
            >
              HUMAN
            </text>

            {harnessStages.map((s) => {
              const active = s.id === node.id;
              const x = pipeX(s.id);
              const y = pipeY(s.id);
              const h = STACKED.has(s.id) ? BOX_H - 14 : BOX_H;
              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => setSelId(s.id)}
                  onPointerEnter={() => setSelId(s.id)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={COL_W}
                    height={h}
                    rx={4}
                    fill={fillFor("stage")}
                    stroke={strokeFor("stage")}
                    strokeWidth={active ? 2 : 1}
                  />
                  {active && (
                    <rect
                      x={x + COL_W / 2 - 16}
                      y={y + h + 6}
                      width={32}
                      height={2}
                      rx={1}
                      fill="var(--accent)"
                    />
                  )}
                  <text
                    x={x + COL_W / 2}
                    y={y + (STACKED.has(s.id) ? 20 : 26)}
                    textAnchor="middle"
                    fill="var(--paper-faint)"
                    style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
                  >
                    {String(s.step).padStart(2, "0")}
                  </text>
                  <text
                    x={x + COL_W / 2}
                    y={y + (STACKED.has(s.id) ? 38 : 46)}
                    textAnchor="middle"
                    fill="var(--paper)"
                    style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 12 }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ---------------- GRAPH ---------------- */}
      {view === "graph" && (
        <div className="mt-7 overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${G_W} ${G_H}`}
            className="h-auto w-full min-w-[720px] touch-none"
            role="img"
            aria-label={`Graph of ${harnessMeta.counts.nodes} notes and their links. Select a node to read it.`}
            onPointerMove={(e) => {
              if (!dragging.current) return;
              const p = toViewBox(e);
              if (p) setDrag((d) => ({ ...d, [dragging.current!]: p }));
            }}
            onPointerUp={() => (dragging.current = null)}
            onPointerLeave={() => (dragging.current = null)}
          >
            {GRAPH_EDGES.map(([a, b]) => {
              const pa = at(a);
              const pb = at(b);
              const lit = a === node.id || b === node.id;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={lit ? "var(--accent)" : GRAPH_EDGE_STROKE}
                  strokeOpacity={lit ? 0.7 : 1}
                  strokeWidth={lit ? 1.4 : 0.9}
                />
              );
            })}

            {harnessNodes.map((nd) => {
              const p = at(nd.id);
              const active = nd.id === node.id;
              const linked =
                node.links.includes(nd.id) || nd.links.includes(node.id);
              const r = nd.kind === "stage" ? 9 : nd.kind === "principle" ? 7 : 6;
              return (
                <g
                  key={nd.id}
                  className="cursor-pointer"
                  onPointerDown={(e) => {
                    dragging.current = nd.id;
                    (e.target as Element).releasePointerCapture?.(e.pointerId);
                    setSelId(nd.id);
                  }}
                  onClick={() => setSelId(nd.id)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + 8}
                    fill="transparent"
                    stroke="none"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill={fillFor(nd.kind)}
                    stroke={
                      active
                        ? "var(--accent)"
                        : nd.kind === "component"
                          ? "var(--series-1)"
                          : GRAPH_NODE_STROKE
                    }
                    strokeWidth={active ? 2.5 : 1.2}
                    strokeDasharray={dashFor(nd.kind)}
                  />
                  {/* Labels are selective, the way Obsidian's own graph fades
                      them when zoomed out. Naming all forty at once produced
                      unreadable soup. The ten stages stay named because they
                      are the spine, and everything else names itself when it
                      is selected or adjacent to the selection. */}
                  {(nd.kind === "stage" || active || linked) && (
                    <text
                      x={p.x}
                      y={p.y + r + 13}
                      textAnchor="middle"
                      fill={
                        active
                          ? "var(--paper)"
                          : linked
                            ? "var(--paper-dim)"
                            : "var(--paper-faint)"
                      }
                      style={{
                        fontFamily: "var(--ff-mono), monospace",
                        fontSize: active ? 11 : 9.5,
                      }}
                    >
                      {nd.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="mt-3 font-mono text-[10px] tracking-wider text-paper-faint">
            {harnessMeta.counts.nodes} NOTES · {GRAPH_EDGES.length} LINKS · CLICK A NODE, OR DRAG IT
          </p>
        </div>
      )}

      {/* Legend */}
      <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {LEGEND.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-2.5 w-4 rounded-[2px] border"
              style={{
                borderColor: strokeFor(k),
                background: fillFor(k),
                borderStyle:
                  k === "store" ? "dashed" : k === "skill" ? "dotted" : "solid",
              }}
            />
            <Label>{KIND_LABEL[k]}</Label>
          </li>
        ))}
      </ul>

      {/* Selected note */}
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-sm text-paper">{node.title}</p>
          <Label>{KIND_LABEL[node.kind]}</Label>
        </div>

        <p className="mt-2.5 max-w-[72ch] text-sm leading-relaxed text-paper-dim">
          {node.blurb}
        </p>

        <ul className="mt-4 space-y-2">
          {node.points.map((pt) => (
            <li
              key={pt}
              className="flex max-w-[72ch] gap-3 text-sm leading-snug text-paper-dim"
            >
              <span
                aria-hidden="true"
                className="mt-[0.45rem] block size-1 shrink-0 rounded-full bg-paper-faint"
              />
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        {/* The guards that fire here. This is the thing a flat list of guards
            could not show: where each one actually runs. */}
        {guards.length > 0 && (
          <div className="mt-6">
            <Label as="h5">Guards firing at this stage</Label>
            {/* Two lines per guard, not three. Stage 7 has seven of them, and
                at three lines each the panel buried the diagram above it. The
                guard's name and what it does belong on one line; the scar it
                came from sits under it in the recessive tone. */}
            <ul className="mt-3 space-y-2.5">
              {guards.map((g) => (
                <li key={g.name} className="border-l-2 border-line-strong pl-4">
                  <p className="max-w-[70ch] text-sm leading-snug text-paper">
                    <code className="font-mono text-accent">{g.name}</code>{" "}
                    {g.behaviour}
                  </p>
                  <p className="mt-0.5 max-w-[70ch] text-xs leading-snug text-paper-faint">
                    Scar: {g.failure}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Wikilinks, so the graph's structure is usable from the pipeline view
            too, and so a keyboard user can reach every node without the SVG. */}
        {node.links.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
            <Label className="mr-1">Links to</Label>
            {node.links
              .filter((l) => nodeById.has(l))
              .map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSelId(l)}
                  className="rounded-sm border border-line-strong px-2 py-0.5 font-mono text-[10px] text-paper-faint transition-colors duration-200 hover:border-accent hover:text-paper motion-reduce:transition-none"
                >
                  {nodeById.get(l)!.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <p className="mt-6 border-t border-line pt-5 font-mono text-[11px] leading-relaxed text-paper-faint">
        {harnessMeta.counts.stages} stages · {harnessMeta.counts.nodes} notes ·{" "}
        {harnessGuards.length} guards, each one a failure that happened first
        <br />
        Transcribed from <span className="text-paper-dim">{harnessMeta.source}</span>. It
        documents the machine: no candidate data, no job data, no credentials.
      </p>
    </div>
  );
}
