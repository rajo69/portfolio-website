/**
 * Content contract.
 *
 * Every piece of copy on the site resolves to one of these types. If a field
 * is required here and missing in the data file, the build fails, that is
 * deliberate. Placeholders awaiting real content are marked `TODO(rajarshi)`
 * and caught by `npm run check:content`.
 */

/** Which side of the Research, Engineering, Product spine a project sits on. */
export type Track = "research" | "engineering" | "product";

/**
 * The capability a project demonstrates. Deliberately a list, not a single
 * value: the whole argument of this portfolio is that the interesting work
 * sits where these overlap, so a project that is both data and AI should say
 * so rather than being filed under one.
 *
 * These are the vertical spikes of a T. The horizontal bar (SQL, ETL, Python,
 * statistics) runs under all of them and is shown in the stack, not here.
 */
export type Capability = "ai" | "data" | "research" | "vision";

export const CAPABILITY_LABEL: Record<Capability, string> = {
  ai: "AI & agents",
  data: "Data & pipelines",
  research: "Research",
  vision: "Vision & robustness",
};

/** A hero/section statistic. Renders as a big accent number + tracked caption. */
export interface Stat {
  /** The number itself, e.g. "56", "3.2×", "<2B". Counts up on scroll-in when numeric. */
  value: string;
  /** Uppercase caption under it, e.g. "PUBLIC REPOSITORIES". Keep under 4 words. */
  caption: string;
}

/**
 * A metric shown on a Lab card. It must be a number you can point at in a
 * repository, not a claim.
 */
export interface Metric {
  label: string;
  value: string;
  /** Optional baseline, renders as "before → after". */
  baseline?: string;
  /**
   * Which chart primitive visualises it.
   * `sparkline`, a trend over steps/epochs
   * `histogram`, a distribution (e.g. gate sparsity)
   * `gauge`, a single ratio out of a whole
   * `heatmap`, a 2D grid (e.g. attention, contributions)
   */
  chart?: "sparkline" | "histogram" | "gauge" | "heatmap";
  /** Raw series backing the chart. Normalised at render; any scale is fine. */
  series?: number[];
}

export interface Project {
  slug: string;
  title: string;
  /** One sentence. Shown in the Work list. */
  summary: string;
  /** 2, 3 sentences. Shown on Lab cards only. */
  description?: string;
  /**
   * The "Proves:" line, what this project demonstrates about you as an
   * engineer. Borrowed from the reference; it is what turns a repo into an
   * argument. Featured projects must have one.
   */
  proves?: string;
  track: Track;
  /** Capabilities this demonstrates. Drives the Work list filter. */
  capabilities: Capability[];
  /** Display category pill, e.g. "Interpretability", "Agents", "RAG". */
  category: string;
  /** Year or range, e.g. "2026" or "2025, 26". */
  period: string;
  tech: string[];
  repo?: string;
  demo?: string;
  paper?: string;
  /** Featured projects become Lab cards; the rest become Work rows. */
  featured?: boolean;
  /** Required when `featured` is true, the card is built around it. */
  metrics?: Metric[];
  /** Set true to render a full /work/[slug] case study page. */
  caseStudy?: boolean;
}

/**
 * A measurement with a link to whatever produced it.
 *
 * This is the site's answer to having no stars, forks or downloads. Those
 * count how many people noticed; these are falsifiable claims with the
 * receipt attached. `source` is non-optional on purpose, a number without
 * one doesn't belong on this page.
 */
export interface Measurement {
  value: string;
  caption: string;
  /** Deep link: README anchor, notebook cell, eval file, or live endpoint. */
  source: string;
  /** Short human label for the link, e.g. "job-apply-harness README". */
  sourceLabel: string;
}

/** How far a finding can actually be pushed. Rendered as a graded bar. */
export type Confidence = "high" | "moderate-high" | "moderate" | "low";

/**
 * A research finding carrying its own confidence grade and the evidence
 * behind it, lifted from the structure of the gate-sparsity README.
 *
 * Keeping the `low` rows in is the entire point. Anyone can list results;
 * publishing the ones you don't yet trust is the part that's hard to fake.
 */
export interface Finding {
  claim: string;
  confidence: Confidence;
  evidence: string;
}

/**
 * A failure that actually happened, and the mechanism that made it
 * impossible to repeat. "Every guard here is a scar."
 */
export interface Scar {
  failure: string;
  /** The guard's name, rendered as code. */
  mechanism: string;
  /** What that guard does. */
  behaviour: string;
}

export interface Experience {
  company: string;
  role: string;
  /** ISO `YYYY-MM`. */
  start: string;
  /** ISO `YYYY-MM`, or "present". */
  end: string;
  location: string;
  /** One sentence on scope, what you owned, not what the company does. */
  summary: string;
  /**
   * 2, 4 bullets. Lead each with a verb and land a number where one exists.
   * The reference's whole credibility comes from quantified outcomes.
   */
  highlights: string[];
  tech?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  location: string;
  /** e.g. "Distinction", "First Class Honours", "3.9/4.0". */
  grade?: string;
  /** Dissertation/thesis title, worth surfacing for a research-track site. */
  thesis?: string;
  highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** ISO `YYYY-MM`. */
  issued: string;
  /** ISO `YYYY-MM`. Omit if it does not expire. */
  expires?: string;
  credentialId?: string;
  /** Public verification URL. Renders the badge as a link when present. */
  url?: string;
  /** Optional grouping, e.g. "Cloud", "ML", "Data". */
  category?: string;
  /**
   * Surfaced by default. The rest collapse behind a "show all" toggle.
   *
   * Rajarshi's own application profile carries a rule against listing every
   * certification he holds: dumping the pile dilutes the signal and reads as
   * padding. Four JD-matched ones do more work than thirteen.
   */
  featured?: boolean;
}

export interface WritingItem {
  title: string;
  /** One-line hook. */
  summary: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  url: string;
  kind: "post" | "paper" | "notebook" | "talk";
}

export interface FaqItem {
  question: string;
  /** Plain prose, 2, 4 sentences, first person. No marketing register. */
  answer: string;
}

/** One node of the Research → Engineering → Product spine. */
export interface SpineNode {
  label: string;
  /** Two short sentences, matching the reference's cadence. */
  body: string;
}

export interface Profile {
  name: string;
  /** Eyebrow above the hero. Uppercase at render. */
  title: string;
  /** The hero headline. 6, 10 words. Runs the logit-lens decode animation. */
  headline: string;
  /** 2, 3 lines under the headline. This is your thesis. */
  subhead: string;
  location: string;
  email: string;
  socials: { github: string; linkedin?: string; scholar?: string; x?: string };
  stats: Stat[];
  spine: { intro: string; nodes: SpineNode[]; kicker: string };
  /** Tools you genuinely work in. Rendered as a tracked-out mono grid. */
  stack: { group: string; items: string[] }[];
  faq: FaqItem[];
  contact: { headline: string; body: string };
  /** SEO. */
  meta: { siteUrl: string; description: string; ogImageAlt: string };
}
