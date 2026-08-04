"use client";

import { useState } from "react";

import { Label } from "@/components/type";
import {
  auditSink,
  legend,
  paths,
  platform,
  type FlowNode,
  type NodeKind,
} from "@/content/data/architecture";

/**
 * AI Accountant, how it is put together.
 *
 * WHAT IT DRAWS, AND WHY NOT THE OTHER THING. An infrastructure diagram here
 * would show Next.js talking to FastAPI talking to Postgres, which is true of
 * roughly every application ever built and says nothing about this one. The
 * property worth drawing is where the model is *allowed to be*. It decides
 * categories. It never touches a reconciliation match. It never computes a
 * figure it is later asked to narrate. Colour carries that distinction, so the
 * argument is legible before a single label is read.
 *
 * Three paths, because the system genuinely has three and they have different
 * trust properties. Switching between them is the interaction: Reconcile has
 * no accent in it anywhere, and that absence is the point.
 *
 * Node names are the literal LangGraph node names from the repo. See the
 * provenance header in content/data/architecture.ts, including the one place
 * the repo's own architecture doc has gone stale against its code.
 */

const VB_W = 1000;
const VB_H = 250;
const PAD = 10;
const GAP = 34;
const NODE_Y = 52;
const NODE_H = 74;
const SINK_Y = 182;
const SINK_H = 46;

/**
 * Colour encodes KIND and nothing else.
 *
 * The first version also turned the selected node accent, and back when
 * --accent was Plasma pink (#ff3d8b) it was all but the same colour as
 * --series-1 (#e82d77), so there was no way to tell "this node has a model in
 * it" from "this node is the one you are pointing at". Selection is carried by
 * weight and an underline instead.
 *
 * The accent went green on 4 August 2026, so that collision no longer exists
 * and hue would now be safe here. Leaving it as weight anyway: the underline
 * reads fine, and selection-by-weight is the convention HarnessMap copied, so
 * changing one of them alone would make the two diagrams disagree.
 */
function strokeFor(kind: NodeKind) {
  return kind === "model" ? "var(--series-1)" : "var(--ink-500)";
}

function fillFor(kind: NodeKind) {
  return kind === "model" ? "var(--series-1-band-wide)" : "var(--ink-700)";
}

export function ArchitectureDiagram() {
  const [pathKey, setPathKey] = useState<(typeof paths)[number]["key"]>("categorise");
  const path = paths.find((p) => p.key === pathKey)!;

  // Default to the node that carries the path's argument.
  const defaultNode =
    path.nodes.find((n) => n.kind === "model")?.id ?? path.nodes[1].id;
  const [nodeId, setNodeId] = useState<string>(defaultNode);
  const node: FlowNode =
    path.nodes.find((n) => n.id === nodeId) ??
    path.nodes.find((n) => n.id === defaultNode)!;

  const n = path.nodes.length;
  const nodeW = (VB_W - PAD * 2 - GAP * (n - 1)) / n;
  const x = (i: number) => PAD + i * (nodeW + GAP);

  return (
    <div className="surface rounded-lg p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Label as="h4">How it is put together</Label>
          <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-paper-dim">
            Three paths through the same system, with different trust
            properties. Colour marks where a language model is in the path.
          </p>
        </div>
        <div
          role="group"
          aria-label="Path"
          className="inline-flex flex-wrap gap-1 rounded-full border border-line p-1"
        >
          {paths.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={p.key === pathKey}
              onClick={() => {
                setPathKey(p.key);
                setNodeId(
                  p.nodes.find((x2) => x2.kind === "model")?.id ?? p.nodes[1].id
                );
              }}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 motion-reduce:transition-none ${
                p.key === pathKey
                  ? "bg-accent text-on-accent"
                  : "text-paper-faint hover:text-paper"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label={`${path.label} path: ${path.from}, then ${path.nodes
            .map((d) => d.name)
            .join(", then ")}, ending at ${path.to}. Every decision is written to the audit log. ${path.verdict}`}
        >
          <defs>
            <marker id="arch-arw" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--ink-500)" />
            </marker>
          </defs>

          {/* Where the work comes from and where it lands. */}
          <text
            x={PAD}
            y={26}
            fill="var(--paper-faint)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11, letterSpacing: "0.1em" }}
          >
            {path.from.toUpperCase()}
          </text>
          <text
            x={VB_W - PAD}
            y={26}
            textAnchor="end"
            fill="var(--paper-faint)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 11, letterSpacing: "0.1em" }}
          >
            {path.to.toUpperCase()}
          </text>

          {/* Connectors sit under the boxes. */}
          {path.nodes.slice(0, -1).map((d, i) => (
            <line
              key={`edge-${d.id}`}
              x1={x(i) + nodeW}
              y1={NODE_Y + NODE_H / 2}
              x2={x(i + 1) - 8}
              y2={NODE_Y + NODE_H / 2}
              stroke="var(--ink-500)"
              markerEnd="url(#arch-arw)"
            />
          ))}

          {path.nodes.map((d, i) => {
            const active = d.id === node.id;
            return (
              <g
                key={d.id}
                className="cursor-pointer"
                onClick={() => setNodeId(d.id)}
                onPointerEnter={() => setNodeId(d.id)}
              >
                <rect
                  x={x(i)}
                  y={NODE_Y}
                  width={nodeW}
                  height={NODE_H}
                  rx={4}
                  fill={fillFor(d.kind)}
                  stroke={strokeFor(d.kind)}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={d.kind === "store" ? "4 3" : undefined}
                />
                {/* Selection, carried by weight and this bar rather than hue. */}
                {active && (
                  <rect
                    x={x(i) + nodeW / 2 - 16}
                    y={NODE_Y + NODE_H + 6}
                    width={32}
                    height={2}
                    rx={1}
                    fill="var(--accent)"
                  />
                )}
                <text
                  x={x(i) + nodeW / 2}
                  y={NODE_Y + 29}
                  textAnchor="middle"
                  fill={d.kind === "model" ? "var(--series-1)" : "var(--paper)"}
                  style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 12 }}
                >
                  {d.name}
                </text>
                <text
                  x={x(i) + nodeW / 2}
                  y={NODE_Y + 50}
                  textAnchor="middle"
                  fill="var(--paper-faint)"
                  style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
                >
                  {d.caption}
                </text>
              </g>
            );
          })}

          {/* Invariant 2 in the repo: the path terminates in the audit log.
              Drawn from the last node, not the diagram's midpoint, because
              that is where the write actually happens. Stubs from every node
              would look tidier and would be a lie. */}
          <line
            x1={x(n - 1) + nodeW / 2}
            y1={NODE_Y + NODE_H}
            x2={x(n - 1) + nodeW / 2}
            y2={SINK_Y}
            stroke="var(--ink-500)"
            strokeDasharray="3 3"
            markerEnd="url(#arch-arw)"
          />
          <rect
            x={PAD}
            y={SINK_Y}
            width={VB_W - PAD * 2}
            height={SINK_H}
            rx={4}
            fill="var(--ink-800)"
            stroke="var(--ink-500)"
          />
          <text
            x={PAD + 18}
            y={SINK_Y + 27}
            fill="var(--paper)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 12 }}
          >
            {auditSink.label}
          </text>
          <text
            x={VB_W - PAD - 18}
            y={SINK_Y + 27}
            textAnchor="end"
            fill="var(--paper-faint)"
            style={{ fontFamily: "var(--ff-mono), monospace", fontSize: 10 }}
          >
            {auditSink.caption}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {legend.map((l) => (
          <li key={l.kind} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-2.5 w-4 rounded-[2px] border"
              style={{
                borderColor: l.kind === "model" ? "var(--series-1)" : "var(--ink-500)",
                background:
                  l.kind === "model" ? "var(--series-1-band-wide)" : "var(--ink-700)",
                borderStyle: l.kind === "store" ? "dashed" : "solid",
              }}
            />
            <Label>{l.label}</Label>
          </li>
        ))}
      </ul>

      {/* Selected node */}
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-sm text-paper">{node.name}</p>
          <Label>{node.kind === "model" ? "LLM in the path" : node.kind === "store" ? "Persistence" : "Deterministic"}</Label>
        </div>
        <p className="mt-2.5 max-w-[70ch] text-sm leading-relaxed text-paper-dim">
          {node.detail}
        </p>
      </div>

      <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-paper-dim">
        <span className={path.modelInPath ? "text-paper" : "text-accent"}>
          {path.label}.
        </span>{" "}
        {path.verdict}
      </p>

      <p className="mt-5 font-mono text-[11px] leading-relaxed text-paper-faint">
        {platform.join("  ·  ")}
        <br />
        {/* Deliberately not "LangGraph nodes": Categorise and Reconcile are
            compiled graphs, Report is plain service functions. One phrasing
            that is true of all three beats one that is true of two. */}
        Names are taken verbatim from{" "}
        <span className="text-paper-dim">{path.source}</span>.
      </p>
    </div>
  );
}
