import type { Project } from "./types";

/**
 * `featured: true` means "this project has a hand-written block in the
 * Flagship section". Work renders everything else, so flipping the flag before
 * the block exists would make a project disappear from the site entirely.
 *
 * Flagship blocks today: AI Accountant, Clustering Stability, Banking77,
 * Gated Attention. Queued: the dissertation.
 *
 * The IBM engagement is not here at all: it is told in the Experience
 * section, where a client engagement belongs.
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
      "Automates the three most time-consuming manual jobs in a small practice. A LangGraph agent categorises transactions against the chart of accounts using few-shot examples from the firm's own history; reconciliation is deterministic with no LLM in the matching path; document generation computes the figures in Python and only uses the model for narrative. A PPO routing study sits on top of it, asking whether a learned policy beats the hand-tuned confidence thresholds.",
    proves:
      "An AI decision an accountant cannot inspect is worthless to someone with professional liability for the accounts they sign. Every prediction stores its feature importances, a risk score and its own reasoning in an immutable audit log.",
    track: "product",
    capabilities: ["ai", "data"],
    category: "Agentic AI",
    period: "2026",
    tech: ["LangGraph", "Claude", "FastAPI", "pgvector", "InterpretML EBM", "Xero API"],
    repo: "https://github.com/rajo69/agentic-ai-accounting",
    demo: "https://agentic-ai-accounting.vercel.app",
    featured: true,
    caseStudy: true,
    metrics: [
      // From backend/evals/README.md. The old 94% and "<2s" were in no repo
      // artifact anywhere; see the note on the block's stats in Flagship.tsx.
      { label: "Categorisation accuracy, 44 of 50 fixtures", value: "88%", chart: "gauge", series: [] },
      { label: "Accuracy above the 0.85 auto-accept threshold", value: "95%", chart: "gauge", series: [] },
    ],
  },


  {
    slug: "gated-attention",
    title: "Gate Sparsity in Gated Attention",
    summary:
      "An empirical study of what the gates in gated-attention models actually do, and what breaks when you override them.",
    description:
      "The original paper shows that gating helps. This asks what the trained gates are doing internally, using forward hooks, layer ablations and cross-domain validation over 25,600 tokens. Every finding carries a confidence grade and the evidence behind it, including the ones graded low.",
    proves:
      "The same question as the accounting audit log, asked one level down: what is this model actually doing, and can I show you?",
    track: "research",
    capabilities: ["research", "ai"],
    category: "Interpretability",
    period: "2026",
    tech: ["PyTorch", "Transformers", "Forward hooks", "Bootstrapped CIs"],
    featured: true,
    repo:
      "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis",
    caseStudy: true,
    metrics: [
      { label: "Gate dimensions stably suppressed", value: "48.3%", chart: "histogram", series: [] },
      { label: "Ablation damage from layer 0", value: "99.8%", chart: "gauge", series: [] },
    ],
  },

  {
    slug: "pce-forecast-scored",
    title: "The Forecast I Got Wrong",
    summary:
      "A 2024 forecast of US consumption expenditure, scored two years later against the actual outturn, with the miss decomposed into model error and data revision.",
    description:
      "Three forecasting models over 779 monthly readings from 1959: drift, Holt exponential smoothing and an auto-selected ARIMA(3,2,2). Holt won and produced an eleven month forecast to October 2024. FRED has since published what happened, so the forecast is scored here rather than left standing. A second half applies LDA topic modelling to 10,000 hotel reviews.",
    proves:
      "The same argument as the audit log, turned on my own work. A forecast nobody scores is a claim, not a result, and the honest version of this project is the one where the reader can check it in thirty seconds and find the page already agrees with them.",
    track: "research",
    capabilities: ["data", "research"],
    category: "Time series and NLP",
    period: "2024, scored 2026",
    tech: ["R", "forecast", "imputeTS", "topicmodels", "ldatuning", "tm"],
    demo: "https://rpubs.com/rajo2024/1249519",
    featured: true,
    caseStudy: true,
    metrics: [
      { label: "Months outside the 95% interval", value: "10 / 11", chart: "gauge", series: [] },
      { label: "One step ahead MAPE, same model", value: "0.50%", chart: "sparkline", series: [] },
    ],
  },

  {
    slug: "adversarial-robustness-dissertation",
    title: "Hybrid Adversarial Training",
    summary:
      "MSc dissertation on making convolutional image classifiers hold up under adversarial attack, reviewed by an academic and an industrial supervisor.",
    description:
      "Neural networks that classify images correctly can be broken by perturbations a human cannot see. This trains and formally verifies convolutional networks under a hybrid adversarial regime, measuring where robustness genuinely improves and where it only appears to.",
    proves:
      "The only formally reviewed research here, assessed by both an academic and an industrial supervisor. It is also the vision half of the work: convolutional networks and verification, not just language models.",
    track: "research",
    capabilities: ["research", "vision"],
    category: "Computer vision",
    period: "2024",
    tech: ["MATLAB", "Deep Learning Toolbox", "CNNs", "Formal verification"],
    repo:
      "https://github.com/rajo69/Enhancing-Neural-Network-Robustness-using-Hybrid-Adversarial-Training",
    caseStudy: true,
    // `featured: true` here is deliberate but does NOT mean a flagship block.
    // This one renders as a compact card under the University of Leeds entry
    // in Experience, because a taught dissertation is education rather than a
    // flagship project. The flag stays true only to keep it out of the Work
    // list, since it already has a hand-written surface and appearing twice
    // was a mistake made once before.
    metrics: [
      // The robustness numbers were listed as blocked on Rajarshi, needing
      // Project_Report.pdf. They were not: the repository README publishes all
      // nine cells of the model-by-attack matrix, and they are now in
      // content/data/robustness.ts driving the card under Leeds.
      { label: "Clean-trained ResNet-18 under PGD, from 91.58%", value: "0.57%", chart: "gauge", series: [] },
      { label: "MSc Data Science, University of Leeds", value: "Merit", chart: "gauge", series: [] },
    ],
  },

  // ── WORK LIST ────────────────────────────────────────────────────────────

  {
    slug: "ai-accountant-rl-routing",
    title: "Learned Routing via RL",
    summary:
      "Can a PPO agent make better escalate-or-approve decisions than a hand-tuned confidence threshold? A research extension to the AI Accountant.",
    track: "research",
    capabilities: ["research", "ai"],
    category: "Reinforcement learning",
    period: "2026",
    tech: ["PPO", "Gymnasium", "Stable-Baselines3"],
    repo:
      "https://github.com/rajo69/AI-Accountant-with-Reinforcement-Learning-Routing",
  },
  {
    slug: "clustering-stability",
    title: "Clustering Stability Analysis",
    summary:
      "When can unsupervised clustering be trusted? Benchmarked on sklearn datasets and single-cell RNA-seq data.",
    track: "research",
    capabilities: ["research", "data"],
    category: "Statistical methods",
    period: "2026",
    tech: ["scikit-learn", "Python", "Jupyter"],
    repo: "https://github.com/rajo69/Clustering-Stability-Analysis",
    featured: true,
  },
  {
    slug: "job-apply-harness",
    title: "The Application Harness",
    /**
     * Retitled twice on 4 August 2026, and this is the settled name because it
     * is the one his own vault uses.
     *
     * It was "Job Apply Harness", and the summary led with "thirty-plus
     * applications across twenty-two portals". Two of three cold reviewers read
     * that as a job-hunting funnel rather than a project: the hiring manager
     * wondered whether the page was written for him or for a pipeline, and the
     * prospective client worried the freelancer would take a salaried role in
     * month two. The portal count stays, because it is the evidence of
     * robustness rather than of applying.
     *
     * `featured: true` here is the real thing, not the exception the
     * dissertation makes: this now HAS a hand-written flagship block, number 05,
     * built on HarnessMap. Without the flag it would render both as block 05 and
     * as a Work row, which is the duplication rule 10 exists to prevent.
     */
    summary:
      "An autonomous agent that drives long multi-step forms end to end and stops before submitting, hardened against twenty-two different portal implementations. Every action verifies that the page actually changed.",
    featured: true,
    track: "engineering",
    capabilities: ["ai"],
    category: "Agents",
    period: "2026",
    tech: ["Python", "Claude", "Playwright"],
    repo: "https://github.com/rajo69/job-apply-harness",
  },
  {
    slug: "ukgc-lccp-rag",
    title: "UKGC LCCP Compliance Assistant",
    summary:
      "Retrieval over the UK Gambling Commission's Licence Conditions, answering with the specific condition cited and linked.",
    track: "product",
    capabilities: ["ai", "data"],
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
    capabilities: ["ai", "data"],
    category: "RAG",
    period: "2026",
    tech: ["Python", "Retrieval"],
    repo: "https://github.com/rajo69/uk-fca-financial-assistant",
  },
  {
    slug: "sae-adversarial-robustness",
    title: "Adversarial Robustness of SAE Interpretations",
    summary:
      "Do sparse-autoencoder feature interpretations survive adversarial pressure, or are they artefacts?",
    track: "research",
    capabilities: ["research", "ai"],
    category: "Interpretability",
    period: "2026",
    tech: ["PyTorch", "Jupyter"],
    repo: "https://github.com/rajo69/Adversarial-Robustness-of-SAE-Interpretations",
  },
  {
    slug: "text2cypher-grpo",
    title: "Text2Cypher GRPO Specialist",
    summary:
      "A sub-2B GRPO Cypher specialist for Neo4j on free-tier compute. Scaffold complete, first training run pending.",
    track: "research",
    capabilities: ["research", "ai", "data"],
    category: "Fine-tuning",
    period: "2026",
    tech: ["TRL", "GRPO", "Neo4j", "Unsloth"],
    repo: "https://github.com/rajo69/text2cypher-grpo-sub2b",
  },
  {
    slug: "banking77-llama",
    title: "Banking77 Llama-1B LoRA",
    summary:
      "QLoRA fine-tune taking a 1B instruct model from 0% to 90.21% exact match on 77-class banking intent classification. Published to Hugging Face.",
    track: "research",
    capabilities: ["research", "ai"],
    category: "Fine-tuning",
    period: "2026",
    tech: ["QLoRA", "rsLoRA", "NEFTune", "Unsloth", "TRL", "PEFT"],
    repo:
      "https://github.com/rajo69/Fine-Tuning-Llama-3.2-1B-Instruct-on-Banking77-Intent-Classification",
    demo: "https://huggingface.co/rajo0113/banking77-llama-1b-lora",
    featured: true,
  },
  {
    slug: "image-captioning",
    title: "Image Captioning with ResNet-152",
    summary:
      "An encoder-decoder that generates descriptive captions for images, using a convolutional encoder and a recurrent decoder.",
    track: "research",
    capabilities: ["vision", "research"],
    category: "Computer vision",
    period: "2025",
    tech: ["PyTorch", "ResNet-152", "RNN"],
    repo:
      "https://github.com/rajo69/Image-Caption-Generator-using-ResNet-152-and-RNN",
  },
  {
    slug: "football-analytics",
    title: "European Football Analytics",
    summary:
      "Statistical analysis across the top five European first divisions, from ingestion through to findings.",
    track: "research",
    capabilities: ["data"],
    category: "Analysis",
    period: "2026",
    tech: ["Python", "Polars", "Statistics"],
    repo: "https://github.com/rajo69/football-analytics-data",
  },
  {
    slug: "brexit-breakdown",
    title: "Brexit Breakdown",
    summary:
      "A statistical exploration of demographic influences on Brexit voting patterns.",
    track: "research",
    capabilities: ["data", "research"],
    category: "Statistical modelling",
    period: "2024",
    tech: ["R", "Statistics"],
    repo: "https://github.com/rajo69/Brexit-Breakdown",
  },
  {
    slug: "customer-segmentation",
    title: "Business Intelligence and Customer Segmentation",
    summary: "Segmentation and BI reporting over transactional customer data.",
    track: "product",
    capabilities: ["data"],
    category: "Business intelligence",
    period: "2024",
    tech: ["Python", "scikit-learn", "Jupyter"],
    repo: "https://github.com/rajo69/Business-Intelligence-and-Customer-Segmentation",
  },
  {
    slug: "job-lens-ai",
    title: "JobLens AI",
    summary:
      "Career platform with real-time job scraping, LLM resume matching and a Firebase credit system.",
    track: "product",
    capabilities: ["ai", "data"],
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
    capabilities: ["ai"],
    category: "Product",
    period: "2025",
    tech: ["Python"],
    repo: "https://github.com/rajo69/BidBrief",
  },
];
