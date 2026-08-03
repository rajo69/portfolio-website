import type { Finding, Measurement, Scar } from "./types";

/**
 * THE PROOF LAYER.
 *
 * These are personal research and production builds, not libraries chasing
 * adoption — so there are no stars, forks or download counts, and showing
 * them would only draw a line under their absence.
 *
 * What exists instead is better: falsifiable numbers with the receipt
 * attached, findings that carry their own confidence grade, and a table of
 * real failures paired with the code that made each impossible to repeat.
 *
 * Everything below was extracted from the repositories themselves. Nothing
 * here is estimated, rounded up, or written for effect. If a number changes
 * in a repo, change it here — never the other way round.
 */

/** The measurement wall. Every tile links to whatever produced it. */
export const measurements: Measurement[] = [
  {
    value: "30+",
    caption: "Real applications completed",
    source: "https://github.com/rajo69/job-apply-harness",
    sourceLabel: "job-apply-harness",
  },
  {
    value: "22",
    caption: "Recruitment platforms driven",
    source: "https://github.com/rajo69/job-apply-harness",
    sourceLabel: "job-apply-harness",
  },
  {
    value: "25,600",
    caption: "Tokens analysed, bootstrapped CIs",
    source:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis",
    sourceLabel: "gate-sparsity README",
  },
  {
    value: "99.8%",
    caption: "Ablation damage from layer 0",
    source:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis#summary-of-findings",
    sourceLabel: "Summary of findings",
  },
  {
    value: "<50ms",
    caption: "Grounded regulatory retrieval",
    // Was pointed at the deployed Swagger UI. That host is down — verified
    // 2026-08-03, no response in 120s, so not a cold start. On a page whose
    // whole claim is "open one and check", a dead link is worse than no link.
    // Repoint at the deployment once it is back up, and restore the "Live"
    // label then; the README still advertises the dead URL too.
    source: "https://github.com/rajo69/ukgc-lccp-rag-api#2-indexing--embeddings",
    sourceLabel: "Indexing & embeddings",
  },
  {
    value: "3 hrs",
    caption: "Full study, free Colab T4",
    source:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis#reproducibility",
    sourceLabel: "Reproducibility",
  },
];

/**
 * Findings from the gated-attention study, with the confidence column intact.
 *
 * The `low` row stays. Cutting it would make the section look stronger and
 * be worth less — the grading is the credential, not the results.
 */
export const findings: Finding[] = [
  {
    claim:
      "Elementwise gate dimensions have a near-binary structure — 48.3% stably suppressed, 54.8% dynamic, with overlap",
    confidence: "high",
    evidence: "Welford aggregation over 25,600 tokens; split-half stability confirmed",
  },
  {
    claim: "First-token gate suppression, 3.49× ratio",
    confidence: "high",
    evidence: "Consistent across 25,600 tokens with CI bands; domain-invariant",
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
    claim: "Sparsity predicts sensitivity — Spearman r = 0.475, p = 0.012",
    confidence: "moderate-high",
    evidence: "Permutation testing confirms significance, but a single model size",
  },
  {
    claim:
      "Forcing layer 0's gate open does not restore the attention sink — a null result",
    confidence: "moderate",
    evidence:
      "Attention weight hooks; mechanism unclear. Does not contradict the paper's system-level claim",
  },
  {
    claim: "Some heads show no quality loss when killed on WikiText-2",
    confidence: "low",
    evidence: "Single dataset, no retraining, no other benchmarks",
  },
];

/**
 * "Every guard here is a scar." Each row is a failure that happened while
 * driving live recruitment portals, and the mechanism that killed it.
 */
export const scars: Scar[] = [
  {
    failure: "A click hit a stale id and silently did nothing for several tool calls",
    mechanism: "click_verified",
    behaviour: "Clicks, then proves the page changed — otherwise raises",
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
    failure: "A saved value was never actually verified",
    mechanism: "assert_saved",
    behaviour: "Checks the portal's own printout, never the page",
  },
];

/** The method blocks. Two of these three are quoted from Rajarshi's own READMEs. */
export const method = {
  principle: {
    quote:
      "A rule an agent must remember will eventually be skipped.\nA rule that raises will not.",
    body: "Most agent pipelines are a long prose runbook and a hopeful model. They demo well and rot in production, because prose is read partially and remembered selectively. The fix isn't a longer runbook — it's converting memory into mechanism. Every rule that got violated once becomes code that raises when it's violated again.",
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
        example: "A weak statement; a wrong portal mechanic saved as knowledge",
        cost: "Nobody ever finds out. The cost repeats forever.",
      },
    ],
    note: "That single distinction decides both where the guards go and where the expensive model goes.",
  },
  scoping: {
    title: "What this is not",
    body: "Every project here states its limits before its results. The Cypher specialist is not the first sub-2B Cypher model and not the first GRPO-on-Cypher work — the closest prior art is named and linked. The gated-attention study is an analysis of released pretrained models, not a training-based improvement claim. Scope stated up front, so the results mean something specific.",
  },
};
