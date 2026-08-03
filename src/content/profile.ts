import type { Profile } from "./types";

/**
 * Identity + the connective copy between sections.
 *
 * Seeded from your GitHub profile. Everything marked TODO(rajarshi) is a
 * placeholder I wrote in your voice as a starting point — rewrite or approve.
 */
export const profile: Profile = {
  name: "Rajarshi Nandi",

  // TODO(rajarshi): confirm. This is the eyebrow above the hero.
  title: "AI Engineer & Interpretability Researcher",

  // TODO(rajarshi): the single most important line on the site. 6–10 words.
  // Candidates, all in the reference's declarative register:
  //   "I build the model and then open it up."
  //   "I ship agents and audit what's inside them."
  //   "Research that ships. Systems that hold."
  headline: "I build the model, then I open it up.",

  // TODO(rajarshi): 2–3 lines. The reference's version is:
  // "I own both sides: the AI that creates the capability, and the marketing
  //  that turns it into pipeline and P&L. In production, not slideware."
  subhead:
    "Most people either study models or deploy them. I do both — interpretability research on what attention heads actually do, and production agents where every invariant is executable. Measured, not asserted.",

  location: "Leeds, United Kingdom",

  // TODO(rajarshi): confirm the address you want public.
  email: "rajarshin264@gmail.com",

  socials: {
    github: "https://github.com/rajo69",
    // TODO(rajarshi): add these
    linkedin: "",
    scholar: "",
  },

  /**
   * Three hero stats, all drawn from the repositories and all checkable.
   *
   * "56 public repositories" was here and has been removed: it counts volume
   * rather than quality, which is the same vanity signal as a star count. A
   * number is only worth the hero if someone could go and falsify it.
   */
  stats: [
    { value: "30+", caption: "Applications, zero human fields" },
    { value: "22", caption: "Platforms driven live" },
    { value: "25,600", caption: "Tokens, bootstrapped CIs" },
  ],

  /**
   * The spine. The reference: AI → Marketing → Revenue, "one operator owns
   * all three, nothing leaks in the seams". Yours is the research-to-product
   * pipeline, owned end to end.
   */
  spine: {
    intro:
      "The hard part was never getting a model to run. It's the line from a research finding to a system someone depends on. That line crosses three jobs most teams split across three people, and the meaning leaks at every handoff. I hold all three.",
    nodes: [
      {
        label: "Research",
        body: "Gated attention, sparse autoencoders, robustness. What the model is actually doing, measured rather than assumed.",
      },
      {
        label: "Engineering",
        body: "Agents, evals, and harnesses where every invariant is executable. Guards that raise, gates that block.",
      },
      {
        label: "Product",
        body: "RAG systems and tools people use under real constraints. Regulated domains, real latency budgets.",
      },
    ],
    kicker: "One engineer owns all three.\nNothing gets lost in translation.",
  },

  /** TODO(rajarshi): prune to what you genuinely reach for. Honesty > length. */
  stack: [
    { group: "Models", items: ["PyTorch", "Transformers", "TRL / GRPO", "vLLM", "Unsloth"] },
    { group: "Agents", items: ["Claude", "LangGraph", "MCP", "Pydantic AI"] },
    { group: "Retrieval", items: ["Neo4j", "pgvector", "LlamaIndex", "Cohere Rerank"] },
    { group: "Serving", items: ["FastAPI", "Next.js", "Vercel", "Cloudflare Workers"] },
    { group: "Analysis", items: ["Jupyter", "scikit-learn", "Polars", "Weights & Biases"] },
  ],

  /** TODO(rajarshi): 4–5, answered in first person, no marketing register. */
  faq: [
    {
      question: "What do you actually do?",
      answer:
        "TODO(rajarshi) — Two things that are usually separate jobs. I run empirical analysis on how models behave internally, and I build the production systems that come out of it.",
    },
    {
      question: "Research or engineering?",
      answer: "TODO(rajarshi)",
    },
    {
      question: "What are you looking for?",
      answer: "TODO(rajarshi)",
    },
    {
      question: "What's the fastest way to judge the work?",
      answer:
        "TODO(rajarshi) — Every project here links to the repo. Open one and read the evals.",
    },
  ],

  contact: {
    // TODO(rajarshi): the reference uses "What's stuck? One conversation. No deck."
    headline: "Working on something hard?",
    body: "One conversation. No deck.",
  },

  meta: {
    // TODO(rajarshi): decide the domain — affects canonical URLs, OG tags, JSON-LD.
    siteUrl: "https://rajarshinandi.com",
    description:
      "Rajarshi Nandi — AI engineer and interpretability researcher in Leeds, UK. Gated attention, sparse autoencoders, production agents, and RAG in regulated domains.",
    ogImageAlt: "Rajarshi Nandi — AI Engineer & Interpretability Researcher",
  },
};
