"use client";

import { useEffect, useRef, useState } from "react";

import { Label } from "@/components/type";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import raw from "@/content/data/clusters3d.json";

/**
 * Interactive 3D view of the clustering study.
 *
 * PROVENANCE. The projections were regenerated with the same datasets and the
 * same pipelines as rajo69/Clustering-Stability-Analysis, and the generator
 * asserts that every ARI reproduces the value in that repo's
 * results_summary.csv before it will write the file. All eight match, so this
 * is Rajarshi's result rendered, not an approximation of it.
 *
 * WHAT IT SHOWS. PCA to three dimensions of the scaled feature space, which is
 * the space KMeans actually saw. Switch the scaler and the geometry changes
 * underneath the same points: with no scaling the clusters interpenetrate and
 * 53 of 178 wines land in the wrong group; with StandardScaler they separate
 * and only 6 do. That is the study's finding, visible rather than tabulated.
 *
 * Rendered on a 2D canvas with a hand-rolled projection rather than a 3D
 * library: a few hundred points do not justify shipping Three.js, and this
 * matches how the attention field is already drawn.
 */

const SERIES = ["#E82D77", "#2AA0D0", "#B08A00"] as const;
const MISS = "#F4F3F0";

type Run = { scaler: string; ari: number; points: number[][]; pred: number[]; err: number[] };
type Dataset = { k: number; truth: number[]; names: string[]; runs: Run[] };

const DATA = raw as unknown as Record<string, Dataset>;

const DATASETS = [
  { key: "wine", label: "Wine", blurb: "178 wines, 13 measurements, 3 cultivars" },
  { key: "breast_cancer", label: "Breast Cancer", blurb: "569 samples, 30 features, benign or malignant" },
];

type Mode = "clusters" | "truth" | "errors";

export function Clusters3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dsKey, setDsKey] = useState("wine");
  const [scalerIdx, setScalerIdx] = useState(1); // StandardScaler
  const [mode, setMode] = useState<Mode>("clusters");
  const reduced = useReducedMotion();

  const dataset = DATA[dsKey];
  const run = dataset.runs[scalerIdx];
  const misassigned = run.err.reduce((a, b) => a + b, 0);

  // Rotation lives in a ref so dragging never triggers a React render.
  const rot = useRef({ yaw: 0.6, pitch: -0.35, dragging: false, lx: 0, ly: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const { yaw, pitch } = rot.current;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const scale = Math.min(w, h) * 0.42;

      // Project, then paint back to front so nearer points overlap farther ones.
      const projected = run.points.map((p, i) => {
        const [x0, y0, z0] = p;
        const x1 = x0 * cy - z0 * sy;
        const z1 = x0 * sy + z0 * cy;
        const y1 = y0 * cp - z1 * sp;
        const z2 = y0 * sp + z1 * cp;
        const persp = 1 / (2.6 - z2 * 0.6);
        return {
          x: w / 2 + x1 * scale * persp * 4.4,
          y: h / 2 + y1 * scale * persp * 4.4,
          z: z2,
          i,
        };
      });
      projected.sort((a, b) => a.z - b.z);

      for (const pt of projected) {
        const depth = (pt.z + 1) / 2; // 0 far, 1 near
        const r = 1.8 + depth * 2.6;
        let colour: string;
        let alpha = 0.35 + depth * 0.5;

        if (mode === "errors") {
          if (run.err[pt.i]) {
            colour = MISS;
            alpha = 0.85;
          } else {
            colour = SERIES[run.pred[pt.i] % SERIES.length];
            alpha = 0.1 + depth * 0.12;
          }
        } else {
          const group = mode === "clusters" ? run.pred[pt.i] : dataset.truth[pt.i];
          colour = SERIES[group % SERIES.length];
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = () => {
      if (!rot.current.dragging && !reduced) rot.current.yaw += 0.0022;
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      rot.current.dragging = true;
      rot.current.lx = e.clientX;
      rot.current.ly = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!rot.current.dragging) return;
      rot.current.yaw += (e.clientX - rot.current.lx) * 0.008;
      rot.current.pitch = Math.max(
        -1.4,
        Math.min(1.4, rot.current.pitch + (e.clientY - rot.current.ly) * 0.008),
      );
      rot.current.lx = e.clientX;
      rot.current.ly = e.clientY;
    };
    const up = () => (rot.current.dragging = false);

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [run, dataset, mode, reduced]);

  const pill = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
      on
        ? "border-accent bg-accent text-on-accent"
        : "border-line-strong text-paper-dim hover:border-accent hover:text-paper"
    }`;

  return (
    <div className="surface rounded-lg p-5 sm:p-7">
      <div className="flex flex-wrap gap-2">
        {DATASETS.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDsKey(d.key)}
            aria-pressed={dsKey === d.key}
            className={pill(dsKey === d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        {dataset.runs.map((r, i) => (
          <button
            key={r.scaler}
            type="button"
            onClick={() => setScalerIdx(i)}
            aria-pressed={scalerIdx === i}
            className={pill(scalerIdx === i)}
          >
            {r.scaler.replace(/ \(.*\)| \[.*\]/, "")}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="mt-5 h-[340px] w-full cursor-grab touch-none rounded-sm active:cursor-grabbing sm:h-[420px]"
        role="img"
        aria-label={`3D projection of ${DATASETS.find((d) => d.key === dsKey)?.label}, ${run.scaler}, ARI ${run.ari}, ${misassigned} points misassigned`}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["clusters", "Clusters found"],
              ["truth", "True labels"],
              ["errors", `Misassigned (${misassigned})`],
            ] as [Mode, string][]
          ).map(([m, l]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={pill(mode === m)}
            >
              {l}
            </button>
          ))}
        </div>
        <Label>Drag to rotate</Label>
      </div>

      <dl className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-3">
        {[
          [run.ari.toFixed(3), "ARI vs ground truth"],
          [`${misassigned}`, `Of ${dataset.truth.length} points misassigned`],
          [run.scaler, "Preprocessing applied"],
        ].map(([v, l]) => (
          <div key={l}>
            <dd className="font-display text-xl font-bold leading-none tracking-tight text-accent">
              {v}
            </dd>
            <dt className="mt-1.5">
              <Label>{l}</Label>
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
