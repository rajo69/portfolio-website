/**
 * MSc dissertation results, University of Leeds.
 *
 * PROVENANCE. Every figure is transcribed from the results sections of
 * rajo69/Enhancing-Neural-Network-Robustness-using-Hybrid-Adversarial-Training,
 * which reports them per experiment. Nothing is derived except the three
 * comparisons at the bottom of this file, and those are plain arithmetic over
 * the numbers above them, computed at module load so they cannot drift.
 *
 * HANDOFF.md listed these as blocked on Rajarshi, needing `Project_Report.pdf`.
 * They were not blocked: the repository README carries all nine cells of the
 * matrix. The PDF would add the per-epsilon FGSM curve, which is the one thing
 * still missing, see FGSM_NOTE.
 *
 * FGSM IS A RANGE, NOT A POINT. The README reports FGSM accuracy as varying
 * between two bounds "depending on the strength of epsilon" and does not
 * publish the intermediate points. So FGSM renders as a band. Interpolating a
 * curve through two endpoints would look better and would be invented data.
 *
 * No em dashes anywhere in this file.
 */

export interface AttackResult {
  /** Single measured value, for clean and PGD. */
  value?: number;
  /** Reported bounds, for FGSM. */
  range?: { high: number; low: number };
}

export interface ModelRun {
  key: "v1" | "v2" | "v3";
  label: string;
  training: string;
  /** What the experiment was for, in the dissertation's own framing. */
  objective: string;
  clean: number;
  fgsm: { high: number; low: number };
  pgd: number;
  detail: string;
}

export const models: ModelRun[] = [
  {
    key: "v1",
    label: "v1",
    training: "Clean data only",
    objective: "Baseline. Establishes what ResNet-18 does on unperturbed CIFAR-10.",
    clean: 91.58,
    fgsm: { high: 61.31, low: 16.84 },
    pgd: 0.57,
    detail:
      "The control, and the reason the whole study exists. It is the most accurate model in the set on clean data and the only one that is effectively destroyed by PGD: 0.57% is worse than guessing at random on ten classes. Accuracy on the test set tells you nothing about what happens under attack.",
  },
  {
    key: "v2",
    label: "v2",
    training: "100% adversarial (FGSM)",
    objective: "Tests robustness when every training image is adversarial.",
    clean: 85.81,
    fgsm: { high: 76.0, low: 46.01 },
    pgd: 38.75,
    detail:
      "Trained entirely on FGSM examples at epsilon 2. It is the most robust model in the set under PGD, and it pays for that with 5.77 points of clean accuracy against v1. Worth noting against the dissertation's own conclusion: v2 beats the hybrid on PGD, not the other way round.",
  },
  {
    key: "v3",
    label: "v3",
    training: "Hybrid, 50 epochs clean then 50 adversarial",
    objective: "Balance the two, rather than win either outright.",
    clean: 88.75,
    fgsm: { high: 77.3, low: 43.78 },
    pgd: 35.66,
    detail:
      "The proposed approach. It recovers 2.94 points of clean accuracy over v2 and gives back 3.09 points of PGD robustness to do it, so it is a trade rather than a free win. It also holds the best upper bound under FGSM of the three at 77.30%. Grad-CAM on v2 and v3 shows attention spread over broader and more relevant regions than v1, which is the qualitative half of the same finding.",
  },
];

export const FGSM_NOTE =
  "Reported as a range across epsilon, not per step. The intermediate points are in the dissertation, not the repository, so they are drawn as a band rather than a curve.";

export const setup = {
  architecture: "ResNet-18",
  dataset: "CIFAR-10",
  environment: "MATLAB R2022a, Deep Learning Toolbox",
  compute: "ARC4, University of Leeds HPC",
  epochs: 100,
  learnRate: 0.01,
  batch: 128,
  /** Every image upscaled before training, and augmented identically. */
  preprocessing: "32x32x3 upscaled to 224x224x3, shifted up to 4px, flipped",
  fgsmTrain: "epsilon 2, alpha 2, 1 step",
  pgdTest: "epsilon 8, alpha 8, 30 iterations",
};

export type AttackKey = "clean" | "fgsm" | "pgd";

export const attacks: { key: AttackKey; label: string; blurb: string }[] = [
  {
    key: "clean",
    label: "Clean",
    blurb:
      "Unperturbed CIFAR-10. This is the number a model gets reported with, and on its own it ranks the three models in exactly the wrong order for robustness.",
  },
  {
    key: "fgsm",
    label: "FGSM",
    blurb:
      "One gradient step. The attack the adversarially trained models were trained against, so a strong showing here is partly expected rather than surprising.",
  },
  {
    key: "pgd",
    label: "PGD",
    blurb:
      "Thirty iterations, projected back inside the epsilon ball each step. No model here was trained on PGD, so this is the honest generalisation test, and it is where v1 falls apart.",
  },
];

/* ------------------------------------------------------------------ *
 * Derived. Arithmetic over the values above, never typed by hand.
 * ------------------------------------------------------------------ */

const v1 = models[0];
const v2 = models[1];
const v3 = models[2];

export const summary = {
  /** How far the clean-trained model falls when attacked properly. */
  collapse: { from: v1.clean, to: v1.pgd },
  /** Hybrid robustness against the baseline's, as a multiple. */
  robustnessGain: v3.pgd / v1.pgd,
  /** Clean accuracy surrendered to get it. */
  cleanCost: v1.clean - v3.clean,
  /** The trade the hybrid actually makes, against pure adversarial training. */
  hybridVsAdversarial: {
    cleanGain: v3.clean - v2.clean,
    pgdLoss: v2.pgd - v3.pgd,
  },
  /**
   * The inversion, stated exactly. v1 leads on clean data and trails on PGD;
   * v2 is the reverse. This is the ratio between them under PGD, and it is
   * computed because a hand-typed version of it was wrong twice.
   */
  inversion: v2.pgd / v1.pgd,
};
