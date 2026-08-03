/**
 * Content contract.
 *
 * Every piece of copy on the site resolves to one of these types. If a field
 * is required here and missing in the data file, the build fails — that is
 * deliberate. Placeholders awaiting real content are marked `TODO(rajarshi)`
 * and caught by `npm run check:content`.
 */

/** Which side of the Research → Engineering → Product spine a project sits on. */
export type Track = "research" | "engineering" | "product";

/** A hero/section statistic. Renders as a big accent number + tracked caption. */
export interface Stat {
  /** The number itself, e.g. "56", "3.2×", "<2B". Counts up on scroll-in when numeric. */
  value: string;
  /** Uppercase caption under it, e.g. "PUBLIC REPOSITORIES". Keep under 4 words. */
  caption: string;
}

/**
 * A metric shown on a Lab card. This is the site's core credibility device —
 * it must be a number you can point at in a repo, not a claim.
 */
export interface Metric {
  label: string;
  value: string;
  /** Optional baseline, renders as "before → after". */
  baseline?: string;
  /**
   * Which chart primitive visualises it.
   * `sparkline` — a trend over steps/epochs
   * `histogram` — a distribution (e.g. gate sparsity)
   * `gauge`     — a single ratio out of a whole
   * `heatmap`   — a 2D grid (e.g. attention, contributions)
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
  /** 2–3 sentences. Shown on Lab cards only. */
  description?: string;
  /**
   * The "Proves:" line — what this project demonstrates about you as an
   * engineer. Borrowed from the reference; it is what turns a repo into an
   * argument. Featured projects must have one.
   */
  proves?: string;
  track: Track;
  /** Display category pill, e.g. "Interpretability", "Agents", "RAG". */
  category: string;
  /** Year or range, e.g. "2026" or "2025–26". */
  period: string;
  tech: string[];
  repo?: string;
  demo?: string;
  paper?: string;
  /** Featured projects become Lab cards; the rest become Work rows. */
  featured?: boolean;
  /** Required when `featured` is true — the card is built around it. */
  metrics?: Metric[];
  /** Set true to render a full /work/[slug] case study page. */
  caseStudy?: boolean;
}

export interface Experience {
  company: string;
  role: string;
  /** ISO `YYYY-MM`. */
  start: string;
  /** ISO `YYYY-MM`, or "present". */
  end: string;
  location: string;
  /** One sentence on scope — what you owned, not what the company does. */
  summary: string;
  /**
   * 2–4 bullets. Lead each with a verb and land a number where one exists.
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
  /** Dissertation/thesis title — worth surfacing for a research-track site. */
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
  /** Plain prose, 2–4 sentences, first person. No marketing register. */
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
  /** The hero headline. 6–10 words. Runs the logit-lens decode animation. */
  headline: string;
  /** 2–3 lines under the headline. This is your thesis. */
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
