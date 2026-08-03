"use client";

import { useRef } from "react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Lede } from "@/components/type";
import { profile } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * THE SPINE, Research → Engineering → Product, owned end to end.
 *
 * Structurally this is the reference's "one operator owns all three" section:
 * a list of three capabilities on the left, a triangle diagram on the right,
 * and a two-line kicker underneath. The three nodes are the only thing that
 * changed, because the argument is the same shape, a pipeline whose value
 * leaks at the handoffs unless one person holds all of it.
 */

/** Triangle vertices, in the SVG's 320×300 viewBox. Order matches profile.spine.nodes. */
const VERTICES = [
  { x: 160, y: 44, r: 32 }, // top
  { x: 48, y: 246, r: 40 }, // bottom-left
  { x: 272, y: 246, r: 34 }, // bottom-right
];

const CENTRE = { x: 160, y: 162, r: 27 };

export function Spine() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const reduced = useReducedMotion();
  const nodes = profile.spine.nodes;

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      if (reduced || prefersReducedMotion()) return;

      const edges = Array.from(svg.querySelectorAll<SVGPathElement>("[data-edge]"));
      const marks = Array.from(svg.querySelectorAll<SVGGElement>("[data-node]"));

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 80%", toggleActions: "play none none none" },
      });

      // Draw the edges on, using each path's own length as the dash.
      for (const edge of edges) {
        const length = edge.getTotalLength();
        gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
      }
      tl.to(edges, {
        strokeDashoffset: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
      });

      tl.from(
        marks,
        { opacity: 0, scale: 0.6, transformOrigin: "center", duration: 0.5, stagger: 0.1, ease: "back.out(1.6)" },
        "-=0.55");

      // The centre keeps a slow pulse, the operator is the live part.
      tl.to(
        svg.querySelector("[data-centre-glow]"),
        { scale: 1.35, opacity: 0.12, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", transformOrigin: "center" },
        "-=0.2");
    },
    { scope: svgRef, dependencies: [reduced] });

  return (
    <Section id="spine">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>The spine</Eyebrow>
        {/* Two lines, per DESIGN.md §4, the measure is set to break it there. */}
        <SplitHeading size="h1" className="max-w-[21ch]">
          Running the model was never the hard part.
        </SplitHeading>
        <Lede className="max-w-[54ch]">{profile.spine.intro}</Lede>
      </Reveal>

      <div className="mt-20 grid items-center gap-16 lg:grid-cols-[1fr_auto]">
        <Reveal variant="stagger" className="max-w-lg space-y-10">
          {nodes.map((node) => (
            <div key={node.label}>
              <h3 className="t-display flex items-center gap-2.5 text-xl">
                <span aria-hidden="true" className="inline-block size-2 shrink-0 bg-accent" />
                {node.label}
              </h3>
              <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-paper-dim">
                {node.body}
              </p>
            </div>
          ))}
        </Reveal>

        <div className="justify-self-center lg:justify-self-end">
          <svg
            ref={svgRef}
            viewBox="0 0 320 300"
            className="h-auto w-[280px] overflow-visible sm:w-[340px]"
            role="img"
            aria-label={`Diagram: ${nodes
              .map((n) => n.label)
              .join(", ")} all connected to a single operator at the centre.`}
          >
            {/* Triangle edges */}
            {VERTICES.map((from, i) => {
              const to = VERTICES[(i + 1) % VERTICES.length];
              return (
                <path
                  key={`edge-${i}`}
                  data-edge
                  d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  stroke="var(--accent)"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                  fill="none"
                />
              );
            })}

            {/* Spokes from the centre */}
            {VERTICES.map((v, i) => (
              <path
                key={`spoke-${i}`}
                data-edge
                d={`M ${CENTRE.x} ${CENTRE.y} L ${v.x} ${v.y}`}
                stroke="var(--accent)"
                strokeOpacity="0.18"
                strokeWidth="1"
                fill="none"
              />
            ))}

            {/* Vertex nodes */}
            {VERTICES.map((v, i) => (
              <g key={`node-${i}`} data-node>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={v.r}
                  fill="var(--ink-900)"
                  stroke="var(--accent)"
                  strokeOpacity="0.7"
                  strokeWidth="1"
                />
                <text
                  x={v.x}
                  y={v.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--paper)"
                  style={{
                    fontFamily: "var(--ff-display), sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {nodes[i]?.label}
                </text>
              </g>
            ))}

            {/* Centre: the operator */}
            <g data-node>
              <circle
                data-centre-glow
                cx={CENTRE.x}
                cy={CENTRE.y}
                r={CENTRE.r}
                fill="var(--accent)"
                opacity="0.25"
                style={{ transformOrigin: `${CENTRE.x}px ${CENTRE.y}px` }}
              />
              <circle cx={CENTRE.x} cy={CENTRE.y} r={CENTRE.r} fill="var(--accent)" />
              <circle cx={CENTRE.x} cy={CENTRE.y} r="5" fill="var(--ink-900)" />
              <text
                x={CENTRE.x}
                y={CENTRE.y + CENTRE.r + 18}
                textAnchor="middle"
                fill="var(--paper-faint)"
                style={{
                  fontFamily: "var(--ff-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                }}
              >
                ONE ENGINEER
              </text>
            </g>
          </svg>
        </div>
      </div>

      <Reveal className="mt-24">
        <p className="t-display text-[clamp(1.5rem,3vw,2.5rem)]">
          {profile.spine.kicker.split("\n").map((line, i) => (
            <span key={line} className={i === 1 ? "block text-accent" : "block"}>
              {line}
            </span>
          ))}
        </p>
      </Reveal>
    </Section>
  );
}
