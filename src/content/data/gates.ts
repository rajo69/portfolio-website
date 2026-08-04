/**
 * Measurements from the gated-attention study.
 *
 * PROVENANCE. Every figure is transcribed from the results tables in
 * rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis,
 * which in turn are written out of the `.pkl` files in that repo's `results/`
 * directory. Experiment numbers below match the README's own headings, so any
 * number on the site can be traced to the section that produced it.
 *
 * APPROXIMATE VALUES ARE MARKED. The README reports layer ablation perplexity
 * with a leading tilde, and gives layers 5 to 27 only as a range rather than
 * per layer. That distinction is carried through to `exact` and `layerTail`
 * here, and the UI renders the tail as a band. Inventing 23 per-layer numbers
 * to make a tidier chart would be exactly the thing this project is about not
 * doing.
 *
 * No em dashes anywhere in this file.
 */

export const setup = {
  params: "1.7B",
  layers: 28,
  heads: 16,
  headDim: 128,
  trainTokens: "3.5T",
  evalTokens: 25600,
  evalChunks: "50 x 512",
  corpus: "WikiText-2 test",
  bootstrap: 1000,
};

/** Experiment 2. Learned gates, no intervention. */
export const baseline = { ppl: 12.39, ci: [11.21, 13.6] as const };

/* ------------------------------------------------------------------ *
 * Experiment 2: force one layer's gates fully open, measure the damage.
 * ------------------------------------------------------------------ */

export interface LayerAblation {
  layer: number;
  ppl: number;
  delta: number;
  /** README reports these with a tilde. None is presented as precise. */
  exact: false;
}

export const layerAblation: LayerAblation[] = [
  { layer: 0, ppl: 148419, delta: 148407, exact: false },
  { layer: 1, ppl: 246, delta: 233, exact: false },
  { layer: 2, ppl: 98, delta: 86, exact: false },
  { layer: 3, ppl: 20, delta: 8, exact: false },
  { layer: 4, ppl: 22, delta: 10, exact: false },
];

/** Layers 5 to 27 are reported only as a range. Rendered as a band, never as bars. */
export const layerTail = {
  from: 5,
  to: 27,
  pplLow: 13,
  pplHigh: 16,
  deltaMax: 4,
  note: "Reported as a range in the source, not per layer. Shown as a band for that reason.",
};

export const layerZeroShare = 99.8;

/** Experiment 8. Is layer 0 an outlier on the trend, or off it entirely? */
export const discontinuity = {
  r2All: 0.3915,
  r2AllP: 0.0004,
  r2NoLayer0: 0.1255,
  r2NoLayer0P: 0.0699,
  cooksD: 9.1349,
  cooksThreshold: 0.143,
  spearmanAll: 0.4751,
  spearmanAllP: 0.012,
  spearmanNoLayer0: 0.4145,
  spearmanNoLayer0P: 0.0317,
};

/** Experiment 6. The control: same ablation on the ungated baseline model. */
export const architectural = {
  gatedShare: 79.6,
  baselineShare: 100.0,
  gatedPpl: 12.39,
  baselinePpl: 12.41,
};

/* ------------------------------------------------------------------ *
 * Experiment 4: clamp every gate to one fixed value and sweep it.
 * ------------------------------------------------------------------ */

export interface SweepPoint {
  value: number;
  ppl: number;
}

export const gateSweep: SweepPoint[] = [
  { value: 0.0, ppl: 303654 },
  { value: 0.05, ppl: 47582 },
  { value: 0.1, ppl: 621 },
  { value: 0.15, ppl: 111.6 },
  { value: 0.2, ppl: 175 },
  { value: 0.3, ppl: 9415 },
  { value: 0.5, ppl: 36392 },
  { value: 1.0, ppl: 251076 },
];

export const bestFixed = { value: 0.15, ppl: 111.6, gapToLearned: 99.21 };

/* ------------------------------------------------------------------ *
 * Experiment A: does opening layer 0's gate bring the attention sink back?
 * The hypothesis was that it would. It does not, and the block says so.
 * ------------------------------------------------------------------ */

export interface SinkCondition {
  key: "learned" | "layer0" | "all";
  label: string;
  short: string;
  attention: number;
  blurb: string;
}

export const sink: SinkCondition[] = [
  {
    key: "learned",
    label: "Gates as trained",
    short: "As trained",
    attention: 0.0526,
    blurb:
      "A sigmoid gate multiplies the attention output elementwise. First-token attention sits at 0.0526, far below the ungated 0.4670 the paper reports.",
  },
  {
    key: "layer0",
    label: "Layer 0's gate forced open",
    short: "Layer 0 open",
    attention: 0.0091,
    blurb:
      "My hypothesis was that layer 0, the most aggressively gated layer, drives the suppression, so opening it should push first-token attention back toward baseline. It does the opposite and falls to 0.0091.",
  },
  {
    key: "all",
    label: "Every gate forced open",
    short: "All open",
    attention: 0.0086,
    blurb:
      "Opening every gate in the model does the same thing, 0.0086. The suppression is not localised at layer 0, so the mechanism is distributed and still unexplained. Published as a null result.",
  },
];

/** From the original paper, figure 2. The ungated reference point. */
export const sinkBaseline = { label: "Ungated, from the paper", attention: 0.467 };

/* ------------------------------------------------------------------ *
 * Experiment 1: what the gates look like at rest.
 * ------------------------------------------------------------------ */

export const elementwise = {
  mean: 0.1369,
  sparsity: 60.62,
  stablySuppressed: 48.32,
  dynamic: 54.84,
  alwaysOpen: 0.03,
};

export const firstToken = { first: 0.0734, other: 0.2563, ratio: 3.49 };

/** Experiment 11, the same measurement on a code corpus. */
export const crossDomain = { wikitext: 3.73, code: 3.74 };

/** Experiment 1D. Four layers the README profiles individually. */
export const layerProfiles = [
  { layer: 0, mean: 0.08, nearlyClosed: 77, shape: "Almost everything near zero" },
  { layer: 7, mean: 0.225, nearlyClosed: 12, shape: "Smooth, centred on 0.15 to 0.25" },
  { layer: 14, mean: 0.238, nearlyClosed: 16, shape: "Widest spread, 0.05 to 0.55" },
  { layer: 27, mean: 0.137, nearlyClosed: 64, shape: "Two humps, most closed, a few open" },
];

/** Experiment 3. Heads killed one at a time across the three sensitive layers. */
export const headAblation = {
  tested: 48,
  noLoss: 8,
  mostCritical: { layer: 0, head: 12, delta: 0.36 },
  allHeadsLayer0: 148407,
};
