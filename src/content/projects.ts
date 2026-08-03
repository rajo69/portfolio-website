import type { Project } from "./types";

/**
 * The four `featured: true` entries become the Lab. Ordered by how strong an
 * argument they make, not by date.
 *
 * AI Accountant leads because it is the most complete and most polished thing
 * here: production grade, deployed, CI, an evaluation framework, a cost model,
 * GDPR notes, and an explainability layer that is the whole point rather than
 * a bolt-on. The RL routing study is its research extension, which is a rare
 * and genuinely good pairing: a shipped system, then a proper investigation
 * into one of its hand-tuned decisions.
 *
 * text2cypher-grpo has moved out of the Lab and into the Work list. Its first
 * training run has not been executed, and with two completed production
 * systems available there is no reason to lead with unfinished work.
 *
 * No em dashes anywhere in this file.
 */
export const projects: Project[] = [
  // ── FEATURED: THE LAB ────────────────────────────────────────────────────

  {
    slug: "agentic-ai-accounting",
    title: "AI Accountant",
    summary:
      "Production AI assistant for UK accountants on Xero: categorisation, reconciliation and management letters, with every decision auditable.",
    description:
      "Automates the three most time-consuming manual jobs in a small practice. A LangGraph agent categorises transactions against the chart of accounts using few-shot examples from the firm's own history; reconciliation is deterministic with no LLM in the matching path; document generation computes the figures in Python and only uses the model for narrative.",
    proves:
      "An AI decision an accountant cannot inspect is worthless to someone with professional liability for the accounts they sign. Every prediction here stores its feature importances, a risk score and its own reasoning in an immutable audit log.",
    track: "product",
    category: "Agents",
    period: "2026",
    tech: [
      "LangGraph",
      "Claude",
      "FastAPI",
      "pgvector",
      "InterpretML EBM",
      "Xero API",
    ],
    repo: "https://github.com/rajo69/agentic-ai-accounting",
    demo: "https://agentic-ai-accounting.vercel.app",
    featured: true,
    caseStudy: true,
    metrics: [
      // TODO(rajarshi): the repo has an evaluation framework. Send the headline
      // numbers (categorisation accuracy, auto-approve rate, review rate) and
      // I will wire the charts to them.
      { label: "Categorisation accuracy", value: "TODO", chart: "gauge", series: [] },
      { label: "Auto-approved vs escalated", value: "TODO", chart: "sparkline", series: [] },
    ],
  },

  {
    slug: "ai-accountant-rl-routing",
    title: "Learned Routing via RL",
    summary:
      "Can a PPO agent make better escalate-or-approve decisions than a hand-tuned confidence threshold?",
    description:
      "A research extension to the AI Accountant. The parent system routes on two fixed thresholds that were never learned from data and do not adapt to workload, transaction difficulty, or the stakes of getting it wrong. This frames routing as a Markov decision process, trains a PPO policy against three reward designs, and compares them to the hand-tuned baseline on a held-out set.",
    proves:
      "Confidence-gated autonomy, deciding when a system should act and when it should ask a human, is unsolved across production agents. I would rather measure that decision than tune it by feel.",
    track: "research",
    category: "Reinforcement learning",
    period: "2026",
    tech: ["PPO", "Gymnasium", "Stable-Baselines3", "Python"],
    repo:
      "https://github.com/rajo69/AI-Accountant-with-Reinforcement-Learning-Routing",
    featured: true,
    caseStudy: true,
    metrics: [
      // TODO(rajarshi): the eval compares three PPO variants against the
      // 0.85 / 0.50 baseline. Send the reward curves and the final numbers.
      { label: "Policy vs hand-tuned baseline", value: "TODO", chart: "sparkline", series: [] },
      { label: "Reward variants trained", value: "3", chart: "gauge", series: [] },
    ],
  },

  {
    slug: "job-apply-harness",
    title: "Job Apply Harness",
    summary:
      "An autonomous agent that completes a job application end to end and stops at the review page. It never submits.",
    description:
      "One job link in, a filled application out. It registers on the portal, reads the verification code, drafts the supporting statement against the person spec, fills every field from verified facts, and proves each save actually persisted. It stops at a CAPTCHA and at any declaration that is the candidate's to make.",
    proves:
      "A rule an agent has to remember will eventually be skipped. A rule that raises will not. Every guard in this repository is a failure that happened once on a live portal.",
    track: "engineering",
    category: "Agents",
    period: "2026",
    tech: ["Python", "Claude", "Playwright"],
    repo: "https://github.com/rajo69/job-apply-harness",
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Applications completed", value: "30+", chart: "gauge", series: [] },
      { label: "Recruitment platforms", value: "22", chart: "histogram", series: [] },
    ],
  },

  {
    slug: "gated-attention",
    title: "Gate Sparsity in Gated Attention",
    summary:
      "An empirical study of what the gates in gated-attention models actually do, and what breaks when you override them.",
    description:
      "The original paper shows that gating helps. This asks what the trained gates are doing internally, using forward hooks, layer ablations and cross-domain validation over 25,600 tokens. Every finding carries a confidence grade and the evidence behind it.",
    proves:
      "The same question as the accounting audit log, asked one level down: what is this model actually doing, and can I show you?",
    track: "research",
    category: "Interpretability",
    period: "2026",
    tech: ["PyTorch", "Transformers", "Forward hooks"],
    repo:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis",
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Gate dimensions stably suppressed", value: "48.3%", chart: "histogram", series: [] },
      { label: "Ablation damage from layer 0", value: "99.8%", chart: "gauge", series: [] },
    ],
  },

  // ── WORK LIST ────────────────────────────────────────────────────────────

  {
    slug: "ukgc-lccp-rag",
    title: "UKGC LCCP Compliance Assistant",
    summary:
      "Retrieval over the UK Gambling Commission's Licence Conditions, answering with the specific condition cited and linked.",
    track: "product",
    category: "RAG",
    period: "2026",
    tech: ["FastAPI", "LlamaIndex", "NVIDIA NIM", "Llama 3.3 70B"],
    repo: "https://github.com/rajo69/ukgc-lccp-rag-api",
  },
  {
    slug: "uk-fca-financial-assistant",
    title: "UK FCA Financial Assistant",
    summary: "Retrieval over FCA handbook material for regulated financial guidance.",
    track: "product",
    category: "RAG",
    period: "2026",
    tech: ["Python"],
    repo: "https://github.com/rajo69/uk-fca-financial-assistant",
  },
  {
    slug: "text2cypher-grpo",
    title: "Text2Cypher GRPO Specialist",
    summary:
      "A sub-2B GRPO Cypher specialist for Neo4j, designed to run on free-tier compute. Scaffold complete, first training run pending.",
    track: "research",
    category: "Fine-tuning",
    period: "2026",
    tech: ["TRL", "GRPO", "Neo4j", "Unsloth"],
    repo: "https://github.com/rajo69/text2cypher-grpo-sub2b",
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
      "When unsupervised clustering can be trusted, benchmarked on sklearn and single-cell RNA-seq data.",
    track: "research",
    category: "ML methods",
    period: "2026",
    tech: ["scikit-learn", "Jupyter"],
    repo: "https://github.com/rajo69/Clustering-Stability-Analysis",
  },
  {
    slug: "adversarial-robustness-dissertation",
    title: "Hybrid Adversarial Training",
    summary:
      "MSc dissertation: enhancing neural network robustness through hybrid adversarial training, verified in MATLAB.",
    track: "research",
    category: "Robustness",
    period: "2024",
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
    slug: "job-lens-ai",
    title: "JobLens AI",
    summary:
      "Career platform with real-time job scraping, LLM resume matching and a Firebase credit system.",
    track: "product",
    category: "Product",
    period: "2025",
    tech: ["Python", "FastAPI", "Firebase"],
    repo: "https://github.com/rajo69/job_lens_ai",
  },
  {
    slug: "bidbrief",
    title: "BidBrief",
    summary: "Streamlining the UK tendering process for SMEs and bid writers.",
    track: "product",
    category: "Product",
    period: "2025",
    tech: ["Python"],
    repo: "https://github.com/rajo69/BidBrief",
  },
];
