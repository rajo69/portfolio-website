import { ArrowUpRight } from "lucide-react";

import { Label } from "@/components/type";

/**
 * The published Hugging Face model, shown as a card.
 *
 * WHY THIS IS NOT AN IFRAME. huggingface.co responds with
 * `X-Frame-Options: DENY`, so the model page cannot be embedded, and unlike
 * the accounting app that header is not ours to change. A blocked frame
 * renders an empty box, which would look broken.
 *
 * So the card is rebuilt natively from the model's own metadata: the same
 * repo id, tags, base model and eval table that the real page shows, in this
 * site's palette, linking straight out. It reads as "this is published and
 * here it is" without pretending to be a live embed.
 *
 * If a Gradio Space is ever created, that IS embeddable, because Spaces are
 * served from *.hf.space rather than the main domain. Swap this for the
 * iframe then and keep the card as the fallback.
 */

const MODEL = "rajo0113/banking77-llama-1b-lora";
const URL = `https://huggingface.co/${MODEL}`;

const TAGS = ["peft", "lora", "qlora", "rslora", "neftune", "unsloth", "trl", "text-classification"];

const RESULTS = [
  { setting: "Base model, zero-shot", accuracy: "0.00%", correct: "0 / 3,076", best: false },
  { setting: "Fine-tuned, free generation", accuracy: "90.21%", correct: "2,775 / 3,076", best: false },
  { setting: "Fine-tuned, constrained decoding", accuracy: "90.28%", correct: "2,777 / 3,076", best: true },
];

export function ModelCard() {
  return (
    <a
      href={URL}
      target="_blank"
      rel="noreferrer"
      className="surface group block overflow-hidden rounded-lg transition-colors duration-300 hover:border-accent/40"
    >
      {/* Header, mirroring how the model is identified on the hub */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
        <span aria-hidden="true" className="text-lg leading-none">
          🤗
        </span>
        <span className="font-mono text-sm text-paper">{MODEL}</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Label className="transition-colors group-hover:text-accent">
            Published on Hugging Face
          </Label>
          <ArrowUpRight
            className="size-3.5 text-paper-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="px-5 py-6 sm:px-7">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <Label className="block">Base model</Label>
            <span className="mt-1 block font-mono text-xs text-paper-dim">
              unsloth/Llama-3.2-1B-Instruct
            </span>
          </div>
          <div>
            <Label className="block">Dataset</Label>
            <span className="mt-1 block font-mono text-xs text-paper-dim">
              mteb/banking77
            </span>
          </div>
          <div>
            <Label className="block">Licence</Label>
            <span className="mt-1 block font-mono text-xs text-paper-dim">llama3.2</span>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {TAGS.map((t) => (
            <li
              key={t}
              className="rounded-sm border border-line-strong px-2 py-0.5 font-mono text-[10px] text-paper-faint"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* The eval table, as published */}
        <div className="mt-7 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Setting", "Accuracy", "Correct"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-line-strong py-2 pr-6 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((r) => (
                <tr key={r.setting}>
                  <td className="border-b border-line py-2.5 pr-6 text-paper-dim">
                    {r.setting}
                  </td>
                  <td
                    className={`border-b border-line py-2.5 pr-6 font-mono tabular-nums ${
                      r.accuracy === "0.00%" ? "text-paper-faint" : "text-accent"
                    }`}
                  >
                    {r.accuracy}
                  </td>
                  <td className="border-b border-line py-2.5 pr-6 font-mono text-xs tabular-nums text-paper-faint">
                    {r.correct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-paper-faint">
          Evaluated on the full Banking77 test split. Constrained decoding uses a
          token-level prefix trie over all 77 valid label names, which makes an
          invalid label impossible to generate.
        </p>
      </div>
    </a>
  );
}
