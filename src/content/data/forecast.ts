/**
 * US consumption forecasting, scored against what actually happened.
 *
 * PROVENANCE. Two independent sources, and nothing here is interpolated.
 *
 *   1. The forecast, the model accuracies and the topic model come verbatim
 *      from Rajarshi's published analysis at rpubs.com/rajo2024/1249519.
 *      Copied out of the rendered output blocks, not retyped from memory.
 *   2. The outturn comes from FRED series `PCE` (Personal Consumption
 *      Expenditures, monthly, seasonally adjusted annual rate, billions USD),
 *      pulled 4 August 2026.
 *
 * VINTAGE, AND WHY IT MATTERS. The model was fitted on a series whose last
 * observation, November 2023, read 18,858.9. FRED now reports 19,178.9 for
 * that same month, because BEA revised it after the fact. So the forecast
 * origin itself moved by 320.0 after the model was built. That accounts for
 * roughly half the eventual gap, and the block says so rather than charging
 * the whole miss to the model. It is also why the actual line on the chart is
 * labelled as the current vintage: it is not the series the model saw.
 *
 * Every summary figure below is COMPUTED from these two arrays at module load.
 * None is typed in by hand, so none can drift away from the data it describes.
 *
 * No em dashes anywhere in this file.
 */

/** The last observation the model was fitted on, in the vintage it was fitted on. */
export const FIT_ORIGIN = { month: "2023-11", label: "Nov 2023", value: 18858.9 };

/** What FRED reports for that same month today. */
export const FIT_ORIGIN_REVISED = 19178.9;

export interface ForecastRow {
  month: string;
  label: string;
  /** Holt point forecast. */
  point: number;
  lo80: number;
  hi80: number;
  lo95: number;
  hi95: number;
  /** FRED outturn, current vintage. */
  actual: number;
}

/**
 * The published forecast path, Dec 2023 to Oct 2024, with the outturn joined on.
 * Forecast columns: RPubs section 5. Actual column: FRED `PCE`.
 */
export const forecastPath: ForecastRow[] = [
  { month: "2023-12", label: "Dec 23", point: 18923.27, lo80: 18805.22, hi80: 19041.31, lo95: 18742.74, hi95: 19103.8, actual: 19283.5 },
  { month: "2024-01", label: "Jan 24", point: 18987.63, lo80: 18819.53, hi80: 19155.74, lo95: 18730.54, hi95: 19244.73, actual: 19303.3 },
  { month: "2024-02", label: "Feb 24", point: 19052.0, lo80: 18844.67, hi80: 19259.33, lo95: 18734.91, hi95: 19369.08, actual: 19446.5 },
  { month: "2024-03", label: "Mar 24", point: 19116.36, lo80: 18875.29, hi80: 19357.44, lo95: 18747.67, hi95: 19485.06, actual: 19581.8 },
  { month: "2024-04", label: "Apr 24", point: 19180.73, lo80: 18909.32, hi80: 19452.14, lo95: 18765.65, hi95: 19595.81, actual: 19665.7 },
  { month: "2024-05", label: "May 24", point: 19245.09, lo80: 18945.73, hi80: 19544.46, lo95: 18787.25, hi95: 19702.94, actual: 19758.0 },
  { month: "2024-06", label: "Jun 24", point: 19309.46, lo80: 18983.88, hi80: 19635.04, lo95: 18811.52, hi95: 19807.4, actual: 19844.5 },
  { month: "2024-07", label: "Jul 24", point: 19373.83, lo80: 19023.38, hi80: 19724.27, lo95: 18837.86, hi95: 19909.79, actual: 19949.5 },
  { month: "2024-08", label: "Aug 24", point: 19438.19, lo80: 19063.95, hi80: 19812.43, lo95: 18865.83, hi95: 20010.55, actual: 20001.3 },
  { month: "2024-09", label: "Sep 24", point: 19502.56, lo80: 19105.39, hi80: 19899.72, lo95: 18895.14, hi95: 20109.97, actual: 20147.6 },
  { month: "2024-10", label: "Oct 24", point: 19566.92, lo80: 19147.56, hi80: 19986.29, lo95: 18925.56, hi95: 20208.29, actual: 20226.0 },
];

/** Six months of FRED outturn before the forecast starts, for chart context. */
export const history: { month: string; label: string; actual: number }[] = [
  { month: "2023-06", label: "Jun 23", actual: 18773.0 },
  { month: "2023-07", label: "Jul 23", actual: 18884.2 },
  { month: "2023-08", label: "Aug 23", actual: 18953.3 },
  { month: "2023-09", label: "Sep 23", actual: 19048.1 },
  { month: "2023-10", label: "Oct 23", actual: 19109.4 },
  { month: "2023-11", label: "Nov 23", actual: 19178.9 },
];

/* ------------------------------------------------------------------ *
 * Scoring. Derived, never typed.
 * ------------------------------------------------------------------ */

export interface ScoredRow extends ForecastRow {
  /** Horizon in months, 1 based. */
  h: number;
  /** actual minus point. Positive means the forecast was too low. */
  error: number;
  /** Absolute percentage error against the outturn. */
  ape: number;
  insideBand80: boolean;
  insideBand95: boolean;
}

export const scored: ScoredRow[] = forecastPath.map((r, i) => {
  const error = r.actual - r.point;
  return {
    ...r,
    h: i + 1,
    error,
    ape: Math.abs(error / r.actual) * 100,
    insideBand80: r.actual <= r.hi80 && r.actual >= r.lo80,
    insideBand95: r.actual <= r.hi95 && r.actual >= r.lo95,
  };
});

const n = scored.length;

export const scoreSummary = {
  horizons: n,
  rmse: Math.sqrt(scored.reduce((a, r) => a + r.error * r.error, 0) / n),
  mae: scored.reduce((a, r) => a + Math.abs(r.error), 0) / n,
  mape: scored.reduce((a, r) => a + r.ape, 0) / n,
  outside80: scored.filter((r) => !r.insideBand80).length,
  outside95: scored.filter((r) => !r.insideBand95).length,
  firstApe: scored[0].ape,
  lastApe: scored[n - 1].ape,
  finalGap: scored[n - 1].error,
  /** How much of the final gap is the forecast origin being revised upward. */
  revision: FIT_ORIGIN_REVISED - FIT_ORIGIN.value,
  get revisionShare() {
    return (this.revision / this.finalGap) * 100;
  },
};

/* ------------------------------------------------------------------ *
 * Model selection. RPubs sections 4, 5 and 6.
 *
 * `holdout` is the 156 month validation window, forecast once and never
 * refitted. `rolling` is one step ahead over the same window with the
 * parameters held fixed. Same models, same data, different horizon.
 * ------------------------------------------------------------------ */

export interface ModelAccuracy {
  key: string;
  label: string;
  note: string;
  holdout: { rmse: number; mae: number; mape: number };
  rolling: { rmse: number; mae: number; mape: number };
}

export const models: ModelAccuracy[] = [
  {
    key: "drift",
    label: "Drift",
    note: "Random walk with the average historical change. No trend or seasonal structure.",
    holdout: { rmse: 2545.278, mae: 1926.576, mape: 12.592 },
    rolling: { rmse: 201.358, mae: 75.688, mape: 0.541 },
  },
  {
    key: "holt",
    label: "Holt",
    note: "Exponential smoothing with a linear trend. Chosen model, and it wins on both horizons.",
    holdout: { rmse: 1151.49, mae: 649.75, mape: 3.945 },
    rolling: { rmse: 200.122, mae: 69.409, mape: 0.501 },
  },
  {
    key: "arima",
    label: "ARIMA(3,2,2)",
    note: "Chosen by auto.arima. Assumes stationarity, which the ACF says this series does not have.",
    holdout: { rmse: 1592.717, mae: 1042.395, mape: 6.533 },
    rolling: { rmse: 221.228, mae: 73.835, mape: 0.536 },
  },
];

export const HORIZON_LABEL = {
  holdout: "13 year holdout, forecast once",
  rolling: "One step ahead, rolling",
} as const;

export type Horizon = keyof typeof HORIZON_LABEL;
export type MetricKey = "rmse" | "mae" | "mape";

export const METRIC_LABEL: Record<MetricKey, string> = {
  rmse: "RMSE",
  mae: "MAE",
  mape: "MAPE %",
};

/** Holt's error inflation between the two horizons, computed not claimed. */
export const horizonEffect = {
  rmse: models[1].holdout.rmse / models[1].rolling.rmse,
  mape: models[1].holdout.mape / models[1].rolling.mape,
};

/* ------------------------------------------------------------------ *
 * Part two: topic model over hotel reviews. RPubs sections 2 to 6.
 *
 * 10,000 reviews in, non-English dropped with textcat, score 3 treated as
 * neutral and dropped, then sampled. Positive and negative corpora modelled
 * separately, k chosen by ldatuning over 5 to 20 topics, LDA at 1,000
 * iterations. Labels are Rajarshi's, from the top ten terms of each topic.
 * ------------------------------------------------------------------ */

export interface Topic {
  index: number;
  label: string;
  terms: string[];
}

export interface Corpus {
  key: "positive" | "negative";
  label: string;
  /** Reviews in this corpus after filtering and sampling. */
  size: number;
  /** Optimal topic count chosen by ldatuning. */
  k: number;
  /** Why that k, in Rajarshi's own terms. */
  kReason: string;
  /** The three topics the reviews actually cluster into most. */
  top3: number[];
  topWords: { term: string; count: number }[];
  topics: Topic[];
}

export const corpora: Corpus[] = [
  {
    key: "positive",
    label: "Positive",
    size: 1760,
    k: 14,
    kReason:
      "Griffiths2004 reaches an elbow maximum at k=14 and Arun2010 stops converging beyond k=13.",
    top3: [12, 1, 14],
    topWords: [
      { term: "hotel", count: 2636 },
      { term: "room", count: 2219 },
      { term: "staff", count: 1352 },
      { term: "london", count: 1145 },
      { term: "good", count: 1090 },
      { term: "stay", count: 1059 },
      { term: "great", count: 973 },
      { term: "breakfast", count: 922 },
      { term: "location", count: 818 },
      { term: "rooms", count: 701 },
    ],
    topics: [
      { index: 1, label: "Staff and service quality", terms: ["staff", "friendly", "helpful", "clean", "stay", "comfortable", "excellent", "extremely", "pleasant", "stayed"] },
      { index: 2, label: "Business travel in London", terms: ["london", "rooms", "hotel", "hotels", "stayed", "well", "always", "business", "trip", "staying"] },
      { index: 3, label: "Overall guest impression", terms: ["get", "like", "can", "even", "quite", "want", "people", "little", "one", "really"] },
      { index: 4, label: "Room and bathroom facilities", terms: ["room", "shower", "bathroom", "bed", "small", "desk", "one", "water", "door", "front"] },
      { index: 5, label: "Recommendations on overall satisfaction", terms: ["great", "stay", "location", "stayed", "definitely", "service", "recommend", "hotel", "will", "staff"] },
      { index: 6, label: "Food and cleanliness", terms: ["good", "breakfast", "food", "clean", "comfortable", "value", "price", "location", "modern", "quality"] },
      { index: 7, label: "Complimentary amenities", terms: ["breakfast", "tea", "well", "also", "free", "nice", "lovely", "room", "lounge", "etc"] },
      { index: 8, label: "Check-in process and guest experiences", terms: ["room", "check", "day", "went", "arrived", "asked", "early", "first", "said", "told"] },
      { index: 9, label: "Stay experience", terms: ["hotel", "stay", "really", "time", "everything", "will", "next", "much", "back", "visit"] },
      { index: 10, label: "Hotel surroundings", terms: ["hotel", "nice", "street", "park", "around", "rooms", "well", "small", "near", "quiet"] },
      { index: 11, label: "Stay duration", terms: ["room", "night", "just", "one", "two", "floor", "bed", "nights", "got", "reception"] },
      { index: 12, label: "Accessibility and proximity to transport", terms: ["walk", "station", "tube", "close", "easy", "minutes", "restaurants", "walking", "distance", "minute"] },
      { index: 13, label: "Location and size of hotel", terms: ["hotel", "london", "area", "big", "location", "city", "also", "view", "large", "access"] },
      { index: 14, label: "Exceptional hospitality", terms: ["service", "perfect", "lovely", "experience", "wonderful", "staff", "made", "special", "amazing", "best"] },
    ],
  },
  {
    key: "negative",
    label: "Negative",
    size: 240,
    k: 11,
    kReason:
      "CaoJuan2009 hits a global minimum at k=11 and Griffiths2004 flattens with no further maximisation.",
    top3: [2, 6, 9],
    topWords: [
      { term: "room", count: 539 },
      { term: "hotel", count: 465 },
      { term: "staff", count: 146 },
      { term: "one", count: 142 },
      { term: "breakfast", count: 137 },
      { term: "stay", count: 135 },
      { term: "good", count: 133 },
      { term: "bed", count: 124 },
      { term: "london", count: 124 },
      { term: "rooms", count: 118 },
    ],
    topics: [
      { index: 1, label: "Overall hotel issues", terms: ["hotel", "will", "well", "time", "days", "many", "now", "problem", "phone", "small"] },
      { index: 2, label: "Breakfast and location problems", terms: ["breakfast", "good", "didnt", "small", "location", "close", "people", "enough", "poor", "coffee"] },
      { index: 3, label: "Value for money", terms: ["one", "even", "made", "desk", "going", "front", "well", "price", "just", "feel"] },
      { index: 4, label: "Cleanliness and maintenance", terms: ["room", "door", "area", "dirty", "looked", "however", "next", "stayed", "just", "stay"] },
      { index: 5, label: "Ventilation and temperature", terms: ["room", "night", "floor", "get", "couldnt", "hot", "sleep", "bad", "windows", "really"] },
      { index: 6, label: "London hotel experiences", terms: ["london", "hotel", "stayed", "hotels", "just", "can", "little", "station", "found", "tube"] },
      { index: 7, label: "Reception and staff issues", terms: ["reception", "told", "asked", "manager", "check", "said", "went", "left", "one", "morning"] },
      { index: 8, label: "Room comfort and bar issues", terms: ["rooms", "back", "bar", "like", "stay", "got", "get", "never", "put", "around"] },
      { index: 9, label: "Bathroom and shower issues", terms: ["bed", "shower", "water", "bathroom", "tiny", "room", "need", "really", "nothing", "think"] },
      { index: 10, label: "Overall stay experience", terms: ["staff", "stay", "clean", "nice", "place", "great", "friendly", "helpful", "walk", "away"] },
      { index: 11, label: "Staff and service quality", terms: ["room", "service", "booked", "also", "like", "first", "see", "much", "beds", "know"] },
    ],
  },
];

/** The imbalance is a real weakness of the study, so it is surfaced not buried. */
export const corpusImbalance = {
  ratio: corpora[0].size / corpora[1].size,
  docsPerNegativeTopic: corpora[1].size / corpora[1].k,
};
