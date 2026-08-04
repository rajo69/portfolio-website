import type { Finding, Scar } from "./types";

/**
 * Supporting detail for the Method section.
 *
 * EARLIER VERSION WAS WRONG. This file used to drive a whole section headlined
 * "Nothing here is a claim", opening with "no stars, no download counts". That
 * argued with a reader who had not objected to anything, and the defensiveness
 * made the work look weaker than it is. Readers arrive willing to believe you.
 *
 * The numbers themselves have moved onto the project cards, where they belong.
 * What is left here is the engineering position, which is interesting in its
 * own right rather than as an argument for being trusted.
 *
 * No em dashes anywhere in this file.
 */

/**
 * Findings from the gated-attention study, with their confidence grades.
 *
 * Kept because a findings table that grades itself is genuinely uncommon and
 * genuinely useful, not because it proves anything about the author.
 */
export const findings: Finding[] = [
  {
    claim:
      "Elementwise gate dimensions have a near-binary structure: 48.3% stably suppressed, 54.8% dynamic, with overlap",
    confidence: "high",
    evidence: "Welford aggregation over 25,600 tokens, split-half stability confirmed",
  },
  {
    claim: "First-token gate suppression, 3.49x ratio",
    confidence: "high",
    evidence: "Consistent across 25,600 tokens with CI bands, domain-invariant",
  },
  {
    claim: "Layer 0 accounts for 99.8% of ablation damage",
    confidence: "high",
    evidence: "Bootstrapped CIs, consistent with the layer sparsity pattern",
  },
  {
    claim: "The best fixed gate value (0.15) is 99.21 PPL worse than learned",
    confidence: "high",
    evidence: "Direct measurement, large effect size",
  },
  {
    claim: "Sparsity predicts sensitivity, Spearman r = 0.475, p = 0.012",
    confidence: "moderate-high",
    evidence: "Permutation testing confirms significance, but a single model size",
  },
  {
    claim:
      "Forcing layer 0's gate open does not restore the attention sink, a null result",
    confidence: "moderate",
    evidence:
      "Attention weight hooks, mechanism unclear. Does not contradict the paper's system-level claim",
  },
  {
    claim: "Some heads show no quality loss when killed on WikiText-2",
    confidence: "low",
    evidence: "Single dataset, no retraining, no other benchmarks",
  },
];

/**
 * Failures observed while driving live recruitment portals, and the guard
 * that made each one impossible to repeat.
 */
export const scars: Scar[] = [
  {
    failure: "A click hit a stale id and silently did nothing for several tool calls",
    mechanism: "click_verified",
    behaviour: "Clicks, then proves the page changed, otherwise raises",
  },
  {
    failure:
      "Generated code broke on escaping, injection failed, and the unchanged text was saved over it",
    mechanism: "set_text",
    behaviour: "Text passes as a data argument, never interpolated into code",
  },
  {
    failure: "An undocumented length cap, discovered only when the save was rejected",
    mechanism: "probe_limits",
    behaviour: "Reads the real cap before writing",
  },
  {
    failure: "A saved value was never verified",
    mechanism: "assert_saved",
    behaviour: "Checks the portal's own printout, never the page",
  },
];

export const method = {
  principle: {
    quote:
      "A rule an agent must remember will eventually be skipped.\nA rule that raises will not.",
    body: "Most agent pipelines are a long prose runbook and a hopeful model. They demo well and fail quietly later, because prose is read partially and remembered selectively. So every rule that gets violated once becomes code that raises when it is violated again.",
  },
  taxonomy: {
    title: "Failures sorted by how they announce themselves",
    rows: [
      {
        kind: "Loud",
        example: "A form field gets the wrong value",
        cost: "A guard raises immediately. Cheap.",
      },
      {
        kind: "Silent",
        example: "A weak statement, or a wrong portal mechanic saved as knowledge",
        cost: "Nobody ever finds out. The cost repeats forever.",
      },
    ],
    note: "That single distinction decides both where the guards go and where the expensive model goes.",
  },
};
