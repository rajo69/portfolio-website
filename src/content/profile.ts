import type { Profile } from "./types";

/**
 * The site's own base URL, resolved at build time. See the note on `meta`.
 *
 * Vercel gives `VERCEL_PROJECT_PRODUCTION_URL` as a bare host with no scheme,
 * so the protocol is added here rather than assumed by callers.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

/**
 * Identity and the connective copy between sections.
 *
 * STYLE RULES (non-negotiable, from Rajarshi):
 *   1. No em dashes or en dashes anywhere in any copy. Use commas, colons,
 *      semicolons or full stops. His CV build pipeline enforces the same rule
 *      on the rendered PDF, so this is a standing convention, not a whim.
 *   2. Do not oversell. The site states what was built and what it did; it
 *      does not campaign for the reader's trust.
 */
export const profile: Profile = {
  name: "Rajarshi Nandi",

  title: "Data & AI Engineer",

  /**
   * The thesis, and the thread that actually runs through the whole CV:
   * an accurate model that nobody trusts does not get used. It shows up at
   * IBM in 2021 (a churn model ignored until it could explain itself), and
   * again in 2026 (an accounting agent whose entire design is showing its
   * working to someone with professional liability).
   */
  headline: "I build AI people trust enough to use.",

  subhead:
    "A model that cannot show its working does not get adopted, however accurate it is. I build production AI for regulated work in accounting, compliance and financial services, where every decision has to be traceable, checkable and correctable by the person who signs it off.",

  location: "Sheffield, United Kingdom",

  email: "rajarshin264@gmail.com",

  socials: {
    github: "https://github.com/rajo69",
    linkedin: "https://www.linkedin.com/in/rajarshi-nandi/",
    kaggle: "https://www.kaggle.com/rajo1909",
    scholar: "",
  },

  /**
   * Three stats, all traceable to a repository or a stated engagement.
   * Deliberately business outcomes rather than volume counts.
   *
   * A VERIFIABILITY SWAP WAS TRIED HERE ON 4 AUGUST 2026 AND REVERTED THE SAME
   * DAY. Do not run it again without asking him.
   *
   * The argument for swapping was real: three cold readers, a hiring manager,
   * a professor and a business owner, were shown the site with no context and
   * all three discounted this row independently, because none of these three
   * numbers can be checked by the reader. The replacement row was 90.21% from
   * the published Hugging Face model, 10/11 from the forecast scored against
   * FRED, and 25,600 tokens from the gated-attention study.
   *
   * It failed for a reason the reviewers could not see, because they had
   * already read the whole page before judging the hero. A stat row gets about
   * two seconds. The replacements were checkable but not legible: "25,600
   * tokens measured" is a volume count that means nothing cold, and leading
   * on the number of months a forecast missed announces a failure before the
   * page has established a capability. All three were research artefacts, so
   * a reader scanning for "can this person build something for me" got no
   * answer at all.
   *
   * Rajarshi chose these back. The business outcome is the thing he wants
   * read first. The reviewers' underlying complaint, that the site caveats its
   * research numbers scrupulously and leaves its business numbers bare, is
   * still open and is better answered by adding a baseline to these than by
   * replacing them.
   */
  stats: [
    { value: "14%", caption: "Marketing ROI, forecasting build" },
    { value: "9%", caption: "Attrition cut, churn model" },
    { value: "3", caption: "Production AI systems shipped" },
  ],

  /**
   * The spine. Reframed away from "Research / Engineering / Product", which
   * described what the work is rather than what it is for. Trust is the
   * actual through-line and the actual business value.
   */
  spine: {
    intro:
      "Most of what decides whether an AI system works happens before the model runs, and most of what decides whether it gets used happens after. The pipeline that cleans and structures data is the same pipeline whether it ends in a dashboard or in an LLM's context window. I build the whole line.",
    nodes: [
      {
        label: "Pipeline",
        body: "SQL, ETL and data quality. A model is only as good as what reaches it, and a retrieval system is a data pipeline with a language model on the end.",
      },
      {
        label: "Model",
        body: "Agents, retrieval, fine-tuning, convolutional networks and statistical models. Usually the smallest of those that does the job.",
      },
      {
        label: "Trust",
        body: "Evals, interpretability, calibrated confidence and audit logs. The reasoning ships with the answer, so the person accountable can check it.",
      },
    ],
    kicker: "Accuracy gets you a demo.\nThe pipeline and the audit trail get you a user.",
  },

  /**
   * Rendered as a T: one foundations row that runs under everything, then the
   * three spikes. Grouped this way on purpose, because a flat tool list is the
   * thing the research says not to do.
   */
  stack: [
    {
      group: "Foundations",
      items: ["Python", "SQL", "ETL", "Statistics", "Git", "Docker"],
    },
    {
      group: "Data & pipelines",
      items: ["Power Query", "Power Automate", "Snowflake", "Power BI", "Tableau", "Dynamics 365", "Postgres"],
    },
    {
      group: "AI & agents",
      items: ["LangGraph", "Claude", "Instructor", "MCP", "pgvector", "LlamaIndex", "FastAPI"],
    },
    {
      group: "Models & research",
      items: ["PyTorch", "Transformers", "TRL / GRPO", "PPO", "XGBoost", "scikit-learn", "MATLAB"],
    },
    {
      group: "Trust & evaluation",
      items: ["InterpretML EBM", "Fuzzy logic", "Forward hooks", "Bootstrapped CIs", "Gymnasium"],
    },
  ],

  /**
   * NOT RENDERED. Nothing on the site imports `profile.faq`: grep it and the
   * only hits are this file and the type. The copy below is written and kept
   * against the day an FAQ section exists, but it is invisible today.
   *
   * A fourth entry, "What are you looking for?", used to sit here holding a
   * placeholder marker, which meant `npm run build` failed over copy that
   * never reached a page. It has been removed rather than answered: the
   * answer has to be in Rajarshi's own words, and there is no surface for it
   * to appear on yet. Write it when the section is built.
   *
   * HANDOFF.md §6 has the research on which questions earn their place.
   */
  faq: [
    {
      question: "What do you actually build?",
      answer:
        "Production AI for work that carries professional liability. The clearest example is an AI accountant built on Xero that categorises transactions, reconciles bank statements and drafts management letters, where every decision stores its own feature importances, a risk score and the model's reasoning in an audit log the accountant can inspect.",
    },
    {
      question: "Why the focus on explainability?",
      answer:
        "Because I have watched accurate models get ignored. At IBM I deployed a churn model that the client business team would not act on until I made the driving features legible in plain language. Same pattern with a reporting migration: the analyst adopted it only after seeing both systems reconcile to identical numbers side by side.",
    },
    {
      question: "Research or engineering?",
      answer:
        "Both, and they feed each other. The interpretability work on gated attention and sparse autoencoders is the same question as the accounting audit log, asked at a different level: what is this model actually doing, and can I show you?",
    },
  ],

  contact: {
    headline: "Got a workflow that needs to be automated and audited?",
    body: "One conversation, no deck.",
  },

  meta: {
    /**
     * NO HARDCODED DOMAIN. He does not own one yet, and a placeholder here is
     * actively harmful rather than merely untidy: this string is the base for
     * the sitemap, robots, every canonical URL, the JSON-LD `url`, and the OG
     * image URL. Shipping "rajarshinandi.com" from a vercel.app deploy would
     * point every canonical tag at a domain that does not resolve, which is
     * worse for indexing than having no canonical at all.
     *
     * Resolution order:
     *   1. NEXT_PUBLIC_SITE_URL, once he owns a domain. Set it and nothing else
     *      changes.
     *   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel injects at build time
     *      and which points at the stable production deployment rather than the
     *      per-commit preview URL.
     *   3. localhost, for `next build` on this machine.
     *
     * This also removes the last placeholder gate on `npm run build`.
     */
    siteUrl: resolveSiteUrl(),
    description:
      "Rajarshi Nandi, AI engineer in Sheffield, UK. Production AI for regulated work: agentic accounting on Xero, compliance retrieval, and interpretability research on gated attention.",
    ogImageAlt: "Rajarshi Nandi, AI Engineer",
  },
};
