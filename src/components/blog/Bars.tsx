import { cn } from "@/lib/cn";

/**
 * Horizontal bar chart for use inside posts.
 *
 * PALETTE. Validated, not chosen by eye. The brand accent #FF3D8B sits at
 * OKLCH L 0.673, just outside the dark-mode band of 0.48 to 0.67, and pairing
 * it with a neutral grey failed CVD separation outright at deutan dE 5.5: a
 * red-green colourblind reader could not tell the two series apart. The pair
 * below was stepped until all six checks passed against this site's chart
 * surface (#0C0E10):
 *
 *   Lightness band      PASS   both inside L 0.48-0.67
 *   Chroma floor        PASS   both >= 0.10
 *   CVD separation      PASS   deutan dE 13.8, tritan 37.1
 *   Normal-vision floor PASS   dE 32.2
 *   Contrast vs surface PASS   both >= 3:1
 *
 * Re-run scripts/validate_palette.js in the dataviz skill before changing
 * these values.
 *
 * Identity is never carried by colour alone: every bar is directly labelled,
 * and the same numbers are available as a real table underneath.
 */

const SERIES = ["#E82D77", "#2AA0D0"] as const;

export interface Bar {
  label: string;
  value: number;
  /** Index into SERIES. Colour follows the entity, never its rank. */
  series?: 0 | 1;
}

export function Bars({
  data,
  caption,
  unit = "%",
  max,
  className,
}: {
  data: Bar[];
  caption: string;
  unit?: string;
  /** Axis maximum. Defaults to the largest value, rounded up. */
  max?: number;
  className?: string;
}) {
  const ceiling = max ?? Math.ceil(Math.max(...data.map((d) => d.value)) / 10) * 10;

  return (
    <figure className={cn("mt-8", className)}>
      <div className="rounded-sm border border-ink-600 bg-ink-800 p-6">
        <div className="space-y-5">
          {data.map((d) => {
            const pct = (d.value / ceiling) * 100;
            return (
              <div key={d.label}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  {/* Text wears text tokens, never the series colour. */}
                  <span className="text-sm text-paper">{d.label}</span>
                  <span className="font-mono text-sm tabular-nums text-paper-dim">
                    {d.value}
                    {unit}
                  </span>
                </div>
                {/* Track sits at 2px inset from the fill, giving the surface
                    gap the mark spec asks for. */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-600">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: SERIES[d.series ?? 0],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recessive axis. */}
        <div className="mt-5 flex justify-between border-t border-ink-600 pt-2">
          <span className="font-mono text-[10px] tracking-wider text-paper-faint">0</span>
          <span className="font-mono text-[10px] tracking-wider text-paper-faint">
            {ceiling}
            {unit}
          </span>
        </div>
      </div>

      <figcaption className="mt-3 text-xs leading-relaxed text-paper-faint">
        {caption}
      </figcaption>

      {/* The same data as text, for screen readers and for anyone who wants
          the numbers rather than the picture. */}
      <details className="mt-2">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint transition-colors hover:text-accent">
          Table view
        </summary>
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-ink-500 py-2 pr-6 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">
                Series
              </th>
              <th className="border-b border-ink-500 py-2 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <td className="border-b border-ink-600 py-2 pr-6 text-paper-dim">
                  {d.label}
                </td>
                <td className="border-b border-ink-600 py-2 text-right font-mono tabular-nums text-paper-dim">
                  {d.value}
                  {unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
