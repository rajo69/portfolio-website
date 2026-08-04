"use client";

import { useState } from "react";

import { AttentionField } from "@/components/layout/AttentionField";
import { EmbeddingField } from "@/components/layout/fields/EmbeddingField";
import { FlowField } from "@/components/layout/fields/FlowField";
import { MatrixField } from "@/components/layout/fields/MatrixField";
import { Label } from "@/components/type";

/**
 * Side-by-side chooser for the ambient background, with the glass treatment
 * switchable on top of it.
 *
 * The two decisions are coupled and that is the point of putting them on one
 * screen. Glass has to refract something. Over the current lattice at 6.8% lit
 * pixels there is almost nothing behind a card to bend, so glass reads as
 * "slightly paler panel". Over a denser field it reads as glass. Toggle both
 * and the dependency is obvious in about four seconds.
 */

const FIELDS = [
  {
    key: "lattice",
    label: "Lattice",
    node: <AttentionField />,
    blurb:
      "What ships today. Token nodes, attention edges, gates closing, and the cursor acting as the query. Sparse by design, which is why glass has nothing to work with.",
  },
  {
    key: "embedding",
    label: "Embedding drift",
    node: <EmbeddingField />,
    blurb:
      "A point cloud that reorganises. Centroids move, points migrate, clusters dissolve and reform. The clustering-stability finding as wallpaper: the same data grouped two ways, neither obviously right. Cursor is a gravity well.",
  },
  {
    key: "matrix",
    label: "Attention matrix",
    node: <MatrixField />,
    blurb:
      "An actual attention map. Causal mask keeps the upper triangle dark, column zero stays hot as the attention sink, and a head sweeps a row every second and a half. Cursor is a query and lights its own row.",
  },
  {
    key: "flow",
    label: "Gradient flow",
    node: <FlowField />,
    blurb:
      "Particles advected along a rotating field, with trails. The least specific to your work and the most immediately attractive. Basins and saddles make it look like gradient descent from above. Cursor pushes the flow aside.",
  },
] as const;

export function FieldLab() {
  const [key, setKey] = useState<(typeof FIELDS)[number]["key"]>("embedding");
  const [glass, setGlass] = useState(true);
  const field = FIELDS.find((f) => f.key === key)!;

  return (
    <>
      {/* The root layout paints AttentionField on every route, so without this
          the lab is comparing each candidate against the current background
          rather than against nothing. `body > canvas` hits only the layout's,
          because the lab's own field renders inside <main>. */}
      <style>{`body > canvas { display: none !important; }`}</style>

      {field.node}

      <div className="relative z-10 min-h-screen px-(--gutter) py-16">
        <div className="mx-auto w-full max-w-(--shell)">
          <Label as="h1" className="text-paper">
            Background lab
          </Label>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-paper-dim">
            Four candidates, on a real slab of page furniture. Toggle the glass
            to see why the two decisions are coupled: glass needs something
            behind it to refract.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Background"
              className="inline-flex flex-wrap gap-1 rounded-full border border-line p-1"
            >
              {FIELDS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={f.key === key}
                  onClick={() => setKey(f.key)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    f.key === key
                      ? "bg-accent text-on-accent"
                      : "text-paper-faint hover:text-paper"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-pressed={glass}
              onClick={() => setGlass((g) => !g)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                glass
                  ? "border-accent text-accent"
                  : "border-line-strong text-paper-faint hover:text-paper"
              }`}
            >
              Glass {glass ? "on" : "off"}
            </button>
          </div>

          <p className="mt-5 max-w-[68ch] text-sm leading-relaxed text-paper-dim">
            {field.blurb}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              { t: "Categorisation accuracy", v: "88%", d: "On 50 labelled UK transactions, Haiku alone." },
              { t: "Gate dimensions suppressed", v: "48.3%", d: "Welford over 25,600 tokens, split-half confirmed." },
              { t: "Clean-trained under PGD", v: "0.57%", d: "Down from 91.58% on unperturbed CIFAR-10." },
              { t: "Months outside the 95% band", v: "10 / 11", d: "Published forecast, scored against FRED." },
            ].map((c) => (
              <div key={c.t} className={`${glass ? "glass" : "surface"} rounded-lg p-7`}>
                <Label>{c.t}</Label>
                <p className="mt-3 font-display text-[2.6rem] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums">
                  {c.v}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">{c.d}</p>
              </div>
            ))}
          </div>

          <div className={`${glass ? "glass" : "surface"} mt-6 rounded-lg p-7`}>
            <Label as="h2">Body copy on the panel</Label>
            <p className="mt-3 max-w-[62ch] text-[1.0625rem] leading-relaxed text-paper-dim">
              A model that cannot show its working does not get adopted, however
              accurate it is. This paragraph is here to check that the field
              behind the panel never makes running text harder to read, which is
              the failure mode that matters more than whether the effect looks
              good in a screenshot.
            </p>
          </div>

          <div style={{ height: "70vh" }} />
        </div>
      </div>
    </>
  );
}
