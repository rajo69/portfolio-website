import type { Project } from "./types";

/**
 * Seeded from your public GitHub repos (rajo69), newest first.
 *
 * What I need from you per project:
 *   - `proves`  — one line on what it demonstrates about you (featured only)
 *   - `metrics` — the real numbers, with the series behind them (featured only)
 *   - confirm `track`, `category` and `tech`
 *   - add `demo` URLs where they exist
 *
 * The four `featured: true` entries become the Lab section. Everything else
 * becomes a Work row. Reorder or re-flag freely — I picked the four that make
 * the strongest, most varied argument (agents / interpretability / fine-tuning
 * / applied RAG), not simply the four newest.
 */
export const projects: Project[] = [
  // ── FEATURED: THE LAB ────────────────────────────────────────────────────

  {
    slug: "job-apply-harness",
    title: "Job Apply Harness",
    summary:
      "One job link in, a completely filled application out — an autonomous agent where every invariant is executable.",
    description:
      "A reference architecture for autonomous agents: guards that raise, gates that block, and a knowledge base that makes run N+1 cheaper than run N. The point isn't the task, it's that correctness is enforced by code rather than by prompt.",
    // TODO(rajarshi)
    proves: "TODO(rajarshi) — e.g. 'I build agents that fail loudly instead of silently.'",
    track: "engineering",
    category: "Agents",
    period: "2026",
    tech: ["Python", "Claude", "Playwright"],
    repo: "https://github.com/rajo69/job-apply-harness",
    featured: true,
    caseStudy: true,
    metrics: [
      // TODO(rajarshi): real numbers + the series behind them.
      { label: "Cost per run", value: "TODO", baseline: "TODO", chart: "sparkline", series: [] },
      { label: "Guard pass rate", value: "TODO", chart: "gauge", series: [] },
    ],
  },

  {
    slug: "gated-attention",
    title: "Gate Sparsity in Gated Attention",
    summary:
      "An empirical analysis of gate distributions in gated-attention LLMs — and what breaks when you override them.",
    description:
      "Gates in gated-attention architectures are assumed to be doing something. This measures what: how sparse they actually are, which heads are functionally sensitive, and what degrades when you intervene.",
    proves: "TODO(rajarshi) — e.g. 'I test the assumptions everyone else inherits.'",
    track: "research",
    category: "Interpretability",
    period: "2026",
    tech: ["PyTorch", "Transformers", "Jupyter"],
    repo:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis",
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Gate sparsity", value: "TODO", chart: "histogram", series: [] },
      { label: "Δ perplexity on override", value: "TODO", chart: "sparkline", series: [] },
    ],
  },

  {
    slug: "text2cypher-grpo",
    title: "Text2Cypher GRPO Specialist",
    summary:
      "A sub-2B GRPO-tuned Cypher specialist for Neo4j text-to-query, trained entirely on free-tier compute.",
    description:
      "Reinforcement fine-tuning a small model to beat much larger ones on a narrow, verifiable task. Reward is execution correctness against a live graph, so there is nothing to game.",
    proves: "TODO(rajarshi) — e.g. 'Small models, correctly trained, beat big models on narrow tasks.'",
    track: "research",
    category: "Fine-tuning",
    period: "2026",
    tech: ["TRL", "GRPO", "Neo4j", "Unsloth"],
    repo: "https://github.com/rajo69/text2cypher-grpo-sub2b",
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Execution accuracy", value: "TODO", baseline: "TODO", chart: "sparkline", series: [] },
      { label: "Parameters", value: "<2B", chart: "gauge", series: [] },
    ],
  },

  {
    slug: "ukgc-lccp-rag",
    title: "UKGC LCCP Compliance Assistant",
    summary:
      "Retrieval-augmented querying over the UK Gambling Commission's Licence Conditions and Codes of Practice.",
    description:
      "Regulated-domain RAG where a wrong answer has consequences. Shipped three ways — API, Streamlit, and a TypeScript app — against the same retrieval core.",
    proves: "TODO(rajarshi) — e.g. 'I ship retrieval into domains where being wrong is expensive.'",
    track: "product",
    category: "RAG",
    period: "2026",
    tech: ["Python", "FastAPI", "TypeScript", "pgvector"],
    repo: "https://github.com/rajo69/ukgc-lccp-rag-api",
    demo: "", // TODO(rajarshi)
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Retrieval precision@5", value: "TODO", chart: "gauge", series: [] },
      { label: "Grounded-answer rate", value: "TODO", chart: "sparkline", series: [] },
    ],
  },

  // ── WORK LIST ────────────────────────────────────────────────────────────

  {
    slug: "uk-fca-financial-assistant",
    title: "UK FCA Financial Assistant",
    summary: "Retrieval over FCA handbook material for regulated financial guidance.",
    track: "product",
    category: "RAG",
    period: "2026",
    tech: ["Python", "Shell"],
    repo: "https://github.com/rajo69/uk-fca-financial-assistant",
  },
  {
    slug: "sae-adversarial-robustness",
    title: "Adversarial Robustness of SAE Interpretations",
    summary:
      "Do sparse-autoencoder feature interpretations survive adversarial pressure, or are they artefacts?",
    track: "research",
    category: "Interpretability",
    period: "2026",
    tech: ["PyTorch", "Jupyter"],
    repo: "https://github.com/rajo69/Adversarial-Robustness-of-SAE-Interpretations",
  },
  {
    slug: "clustering-stability",
    title: "Clustering Stability Analysis",
    summary:
      "When unsupervised clustering can be trusted — benchmarked on sklearn and single-cell RNA-seq data.",
    track: "research",
    category: "ML Methods",
    period: "2026",
    tech: ["scikit-learn", "Jupyter"],
    repo: "https://github.com/rajo69/Clustering-Stability-Analysis",
  },
  {
    slug: "adversarial-robustness-dissertation",
    title: "Hybrid Adversarial Training",
    summary:
      "Dissertation: enhancing neural-network robustness through hybrid adversarial training, verified in MATLAB.",
    track: "research",
    category: "Robustness",
    period: "2026",
    tech: ["MATLAB", "Deep Learning Toolbox"],
    repo:
      "https://github.com/rajo69/Enhancing-Neural-Network-Robustness-using-Hybrid-Adversarial-Training",
  },
  {
    slug: "banking77-llama",
    title: "Llama-3.2-1B on Banking77",
    summary: "Fine-tuning a 1B instruct model for 77-class banking intent classification.",
    track: "research",
    category: "Fine-tuning",
    period: "2026",
    tech: ["Llama", "PEFT", "Transformers"],
    repo:
      "https://github.com/rajo69/Fine-Tuning-Llama-3.2-1B-Instruct-on-Banking77-Intent-Classification",
  },
  {
    slug: "agentic-ai-accounting",
    title: "Agentic AI Accounting",
    summary:
      "An AI accountant with reinforcement-learning routing across specialist tools.",
    track: "engineering",
    category: "Agents",
    period: "2026",
    tech: ["Python", "RL"],
    repo: "https://github.com/rajo69/AI-Accountant-with-Reinforcement-Learning-Routing",
  },
  {
    slug: "chronoagent",
    title: "ChronoAgent",
    summary: "TODO(rajarshi) — repo has no description.",
    track: "engineering",
    category: "Agents",
    period: "2026",
    tech: ["Python"],
    repo: "https://github.com/rajo69/chronoagent",
  },
  {
    slug: "ai-content-engine",
    title: "AI Content Engine",
    summary: "TODO(rajarshi) — repo has no description.",
    track: "engineering",
    category: "Agents",
    period: "2026",
    tech: ["Python"],
    repo: "https://github.com/rajo69/ai-content-engine",
  },
  {
    slug: "voice-loop",
    title: "Voice Loop",
    summary: "TODO(rajarshi) — repo has no description.",
    track: "engineering",
    category: "Speech",
    period: "2026",
    tech: ["Python"],
    repo: "https://github.com/rajo69/voice-loop",
  },
  {
    slug: "job-lens-ai",
    title: "JobLens AI",
    summary:
      "End-to-end career platform: real-time job scraping, LLM resume matching, interview prep, and a Firebase credit system with an admin dashboard.",
    track: "product",
    category: "Product",
    period: "2025",
    tech: ["Python", "FastAPI", "Firebase"],
    repo: "https://github.com/rajo69/job_lens_ai",
  },
  {
    slug: "bidbrief",
    title: "BidBrief",
    summary:
      "Streamlining the UK tendering process for SMEs and bid writers.",
    track: "product",
    category: "Product",
    period: "2025",
    tech: ["Python"],
    repo: "https://github.com/rajo69/BidBrief",
  },
  {
    slug: "s5-web-co",
    title: "S5 Web Co",
    summary: "Hand-built websites for Sheffield small businesses.",
    track: "product",
    category: "Studio",
    period: "2026",
    tech: ["HTML", "CSS", "JS"],
    repo: "https://github.com/rajo69/S5-Web-Co",
  },
  {
    slug: "pii-anonymizer",
    title: "PII Anonymizer",
    summary: "Stripping patient identifiers from clinical letters.",
    track: "product",
    category: "NLP",
    period: "2025",
    tech: ["Python", "spaCy"],
    repo: "https://github.com/rajo69/PII-Anonymizer",
  },
  {
    slug: "football-analytics",
    title: "European Football Analytics",
    summary: "In-depth analysis of the top five European first divisions.",
    track: "research",
    category: "Data",
    period: "2026",
    tech: ["Python", "Polars"],
    repo: "https://github.com/rajo69/football-analytics-data",
  },

  // TODO(rajarshi): 40+ more repos exist. Tell me which are worth surfacing —
  // a portfolio that shows everything shows nothing. I'd cap Work at ~12 rows.
];
