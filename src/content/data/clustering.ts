/**
 * Real results from rajo69/Clustering-Stability-Analysis.
 *
 * Copied verbatim from `results_summary.csv` and `results.json` in that
 * repository. Nothing here is rounded for effect or re-derived. If the
 * analysis is re-run, update this file from those two artifacts rather than
 * editing numbers by hand.
 *
 * ARI  = Adjusted Rand Index against the ground-truth labels. Higher is better.
 * Sil  = Silhouette score, an internal metric computed without any labels.
 *        This is what you would actually use in practice, because in real
 *        unsupervised work there is no ground truth to check against.
 */

export interface PreprocStep {
  method: string;
  /** Adjusted Rand Index vs ground truth. */
  ari: number;
  /** Silhouette score, computed label-free. */
  silhouette: number;
}

export interface ClusteringDataset {
  key: string;
  label: string;
  /** What the data actually is, for anyone who does not know the set. */
  blurb: string;
  baseline: { method: string; ari: number; nmi: number };
  /** Bootstrap stability of the baseline pipeline, mean and standard deviation. */
  stability: { mean: number; std: number };
  /** Spread in ARI caused by the preprocessing choice alone. */
  ariRange: number;
  preprocessing: PreprocStep[];
}

export const clusteringDatasets: ClusteringDataset[] = [
  {
    key: "wine",
    label: "Wine",
    blurb: "178 wines, 13 chemical measurements, 3 known cultivars.",
    baseline: { method: "KMeans + StandardScaler, k=3", ari: 0.897, nmi: 0.876 },
    stability: { mean: 0.965, std: 0.042 },
    ariRange: 0.526,
    preprocessing: [
      { method: "No scaling (raw)", ari: 0.371, silhouette: 0.571 },
      { method: "StandardScaler (z-score)", ari: 0.897, silhouette: 0.285 },
      { method: "MinMaxScaler [0,1]", ari: 0.854, silhouette: 0.301 },
      { method: "RobustScaler (IQR)", ari: 0.895, silhouette: 0.265 },
    ],
  },
  {
    key: "breast_cancer",
    label: "Breast Cancer",
    blurb: "569 tumour samples, 30 features, benign or malignant.",
    baseline: { method: "KMeans + StandardScaler, k=2", ari: 0.654, nmi: 0.532 },
    stability: { mean: 0.95, std: 0.046 },
    ariRange: 0.239,
    preprocessing: [
      { method: "No scaling (raw)", ari: 0.491, silhouette: 0.697 },
      { method: "StandardScaler (z-score)", ari: 0.654, silhouette: 0.343 },
      { method: "MinMaxScaler [0,1]", ari: 0.73, silhouette: 0.385 },
      { method: "RobustScaler (IQR)", ari: 0.629, silhouette: 0.366 },
    ],
  },
  {
    key: "pbmc_3k",
    label: "PBMC 3k",
    blurb: "2,700 single cells, RNA sequencing counts, 8 annotated cell types.",
    baseline: { method: "KMeans + StandardScaler, k=8", ari: 0.779, nmi: 0.811 },
    stability: { mean: 0.766, std: 0.103 },
    ariRange: 0.279,
    preprocessing: [
      { method: "Raw counts (top 2000 var genes)", ari: 0.354, silhouette: 0.099 },
      { method: "Normalised only (no log)", ari: 0.45, silhouette: 0.072 },
      { method: "Normalised + log1p", ari: 0.579, silhouette: 0.01 },
      { method: "Normalised + log1p + scaled", ari: 0.633, silhouette: 0.005 },
    ],
  },
];

/**
 * The finding worth leading with, and it holds on all three datasets:
 * the pipeline with the BEST silhouette score has the WORST ARI, every time.
 *
 *   Wine           raw: Sil 0.571 (highest) -> ARI 0.371 (lowest)
 *   Breast Cancer  raw: Sil 0.697 (highest) -> ARI 0.491 (lowest)
 *   PBMC 3k        raw: Sil 0.099 (highest) -> ARI 0.354 (lowest)
 *
 * Silhouette is the metric you can compute without labels, so it is the one
 * people actually use to pick a pipeline. On this evidence it would have
 * chosen the worst option three times out of three.
 */
export function silhouetteWouldMislead(d: ClusteringDataset): boolean {
  const bestSil = [...d.preprocessing].sort((a, b) => b.silhouette - a.silhouette)[0];
  const worstAri = [...d.preprocessing].sort((a, b) => a.ari - b.ari)[0];
  return bestSil.method === worstAri.method;
}
