import { ArrowUpRight } from "lucide-react";

import { Label } from "@/components/type";
import { models, setup, summary } from "@/content/data/robustness";

/**
 * The MSc dissertation result, compact, sitting under the Leeds entry.
 *
 * It was a full flagship block with a three-tab interactive artifact. Rajarshi
 * did not want it there: a taught dissertation is education, not a flagship
 * project, and putting it sixth in the Flagship section both buried it and
 * overstated it. This is the same result at the size it deserves.
 *
 * A table, because the finding IS the table. Three models by three attacks,
 * and the ranking inverts depending on which column you read: v1 leads on
 * clean data and is last by a factor of sixty-eight under PGD. Prose would
 * take four sentences to say what nine cells say at a glance.
 *
 * FGSM is a range because the repository reports bounds across epsilon and
 * publishes no intermediate points. The per-epsilon curve is in the report PDF
 * only. Interpolating it would look tidier and would be invented.
 *
 * Every number is imported from content/data/robustness.ts, transcribed from
 * the repository README. `summary.inversion` is computed, not typed.
 */

const REPO =
  "https://github.com/rajo69/Enhancing-Neural-Network-Robustness-using-Hybrid-Adversarial-Training";

export function DissertationCard() {
  return (
    /* min-w-0 here as well as on the grid item in Experience. The table sets a
       min-width so its columns stay readable, and without breaking the
       min-content chain at BOTH levels that width propagates all the way up
       and widens the page instead of scrolling inside the card. It overflowed
       by 103px at 375 until this was added. */
    <div className="surface mt-6 min-w-0 rounded-lg p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Label as="h4">Dissertation result</Label>
        <Label>
          {setup.architecture} on {setup.dataset}
        </Label>
      </div>

      {/* Header row, then one row per model. Scrolls rather than wraps on
          narrow screens: a wrapped numeric table stops being readable. */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="pb-2 pr-4">
                <Label>Trained on</Label>
              </th>
              <th className="pb-2 pr-4 text-right">
                <Label>Clean</Label>
              </th>
              <th className="pb-2 pr-4 text-right">
                <Label>FGSM</Label>
              </th>
              <th className="pb-2 text-right">
                <Label>PGD</Label>
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.key} className="border-b border-line last:border-b-0">
                <td className="py-2.5 pr-4">
                  <span className="font-mono text-xs text-paper">{m.label}</span>
                  {/* Not lowercased: it turns FGSM into fgsm. */}
                  <span className="ml-2 text-xs text-paper-faint">
                    {m.training}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs tabular-nums text-paper-dim">
                  {m.clean.toFixed(2)}%
                </td>
                <td className="py-2.5 pr-4 text-right font-mono text-xs tabular-nums text-paper-faint">
                  {m.fgsm.high.toFixed(2)} to {m.fgsm.low.toFixed(2)}%
                </td>
                <td
                  className={`py-2.5 text-right font-mono text-xs tabular-nums ${
                    m.key === "v1" ? "text-accent" : "text-paper-dim"
                  }`}
                >
                  {m.pgd.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-[64ch] text-sm leading-relaxed text-paper-dim">
        Clean accuracy ranks them backwards. The model trained only on clean
        data leads that column and is {summary.inversion.toFixed(0)} times worse
        than the adversarially trained one under PGD, which is the attack none
        of them was trained against. The hybrid is a trade, not a win: it
        recovers {summary.hybridVsAdversarial.cleanGain.toFixed(2)} points of
        clean accuracy for {summary.hybridVsAdversarial.pgdLoss.toFixed(2)} points
        of PGD robustness.
      </p>

      <a
        href={REPO}
        target="_blank"
        rel="noreferrer"
        className="group mt-5 inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors duration-200 hover:text-paper"
      >
        Read the analysis
        <ArrowUpRight
          className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
