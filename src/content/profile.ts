import type { Profile } from "./types";

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

  title: "AI Engineer",

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
    // TODO(rajarshi): send your LinkedIn URL for the footer.
    linkedin: "",
    scholar: "",
  },

  /**
   * Three stats, all traceable to a repository or a stated engagement.
   * Deliberately business outcomes rather than volume counts.
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
      "Getting a model to be accurate is the part that has a benchmark. The part that decides whether it ever runs in a real workflow is whether the person accountable for the output is willing to put their name on it. That question is answered in the design, not in a rollout meeting.",
    nodes: [
      {
        label: "Build",
        body: "Agents, retrieval and fine-tuned models in production. LangGraph, Claude, pgvector, FastAPI, on real systems of record.",
      },
      {
        label: "Explain",
        body: "Feature importances, calibrated confidence, immutable audit logs. The reasoning ships with the answer, not after it.",
      },
      {
        label: "Adopt",
        body: "Human in the loop by design. The professional reviews, corrects, and signs off, and the system learns from the correction.",
      },
    ],
    kicker: "Accuracy gets you a demo.\nExplainability gets you a user.",
  },

  stack: [
    { group: "Agents", items: ["LangGraph", "Claude", "Instructor", "MCP", "Gymnasium"] },
    { group: "Models", items: ["PyTorch", "Transformers", "TRL / GRPO", "XGBoost", "Unsloth"] },
    { group: "Retrieval", items: ["pgvector", "LlamaIndex", "Neo4j", "NVIDIA NIM"] },
    { group: "Serving", items: ["FastAPI", "Next.js", "Vercel", "Postgres"] },
    { group: "Interpretability", items: ["InterpretML EBM", "Fuzzy logic", "SHAP", "Forward hooks"] },
    { group: "Data", items: ["Power BI", "Tableau", "Snowflake", "Power Query", "SQL"] },
  ],

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
    {
      question: "What are you looking for?",
      answer:
        "TODO(rajarshi): what kind of role, and what you want to be working on. This one should be in your own words.",
    },
  ],

  contact: {
    headline: "Got a workflow that needs to be automated and audited?",
    body: "One conversation, no deck.",
  },

  meta: {
    // TODO(rajarshi): confirm the domain before launch.
    siteUrl: "https://rajarshinandi.com",
    description:
      "Rajarshi Nandi, AI engineer in Sheffield, UK. Production AI for regulated work: agentic accounting on Xero, compliance retrieval, and interpretability research on gated attention.",
    ogImageAlt: "Rajarshi Nandi, AI Engineer",
  },
};
