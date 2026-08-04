/**
 * AI Accountant architecture, as built.
 *
 * PROVENANCE. Read out of rajo69/agentic-ai-accounting rather than out of its
 * prose. Node names and their order are the literal `workflow.add_node` and
 * `workflow.add_edge` calls in the two agent modules, so this diagram cannot
 * drift into describing a system that was refactored away:
 *
 *   backend/app/agents/categoriser.py       lines 303 to 314
 *   backend/app/agents/reconciler.py        lines 264 to 275
 *   backend/app/services/document_service.py
 *   backend/app/xai/{explainer,fuzzy_engine}.py
 *   docs/ARCHITECTURE.md sections 6, 7 and 11
 *
 * ONE CORRECTION TO THE REPO'S OWN DOC. `docs/ARCHITECTURE.md` is dated
 * 2026-03-22 and still says embeddings are 1536-dim (section 6.3, and
 * invariant 9). The code disagrees: `embedding_service.py` pins
 * all-MiniLM-L6-v2 at 384, and there is a migration named
 * `b2c3d4e5f6a7_resize_embedding_vector_to_384`. The code wins, so 384 is what
 * this file carries.
 *
 * WHY THIS DIAGRAM AND NOT AN INFRASTRUCTURE ONE. A box diagram of Next.js to
 * FastAPI to Postgres describes every other application ever built and says
 * nothing about this one. The interesting property here is *where the model is
 * allowed to be*: it decides categories, it never touches a reconciliation
 * match, and it never computes a figure it is asked to narrate. That is the
 * project's actual argument and it is checkable line by line, so that is what
 * the diagram draws.
 *
 * No em dashes anywhere in this file.
 */

export type NodeKind = "model" | "deterministic" | "store";

export interface FlowNode {
  id: string;
  /** The literal LangGraph node name where one exists. */
  name: string;
  kind: NodeKind;
  /** One line, shown inside the box. */
  caption: string;
  /** Shown in the readout when selected. */
  detail: string;
}

export interface FlowPath {
  key: "categorise" | "reconcile" | "report";
  label: string;
  /** Where the work arrives from. */
  from: string;
  /** Where it ends up. */
  to: string;
  /** The headline property of this path, and the reason it is drawn. */
  verdict: string;
  /** True when an LLM sits anywhere in the decision path. */
  modelInPath: boolean;
  source: string;
  nodes: FlowNode[];
}

export const paths: FlowPath[] = [
  {
    key: "categorise",
    label: "Categorise",
    from: "Xero sync",
    to: "3 confidence bands",
    modelInPath: true,
    verdict:
      "The only path where a model decides anything. It is wrapped: retrieval feeds it, validation checks it against the real chart of accounts, and thresholds decide whether a human ever sees it.",
    source: "backend/app/agents/categoriser.py",
    nodes: [
      {
        id: "fetch_context",
        name: "fetch_context",
        kind: "deterministic",
        caption: "pgvector, 5 nearest",
        detail:
          "Pulls the organisation's chart of accounts and the five most similar already-categorised transactions by cosine distance, all-MiniLM-L6-v2 at 384 dimensions, computed in process. When an accountant corrects a category the transaction is re-embedded, so the vector store is the training set and no fine-tuning is involved.",
      },
      {
        id: "classify",
        name: "classify",
        kind: "model",
        caption: "Haiku, Sonnet if under 0.85",
        detail:
          "Haiku 4.5 first. If its confidence is below the 0.85 auto-accept threshold, Sonnet 4.6 gets a second attempt at pushing it into the auto band rather than leaving a human to review it. If the Sonnet call throws, Haiku's answer is kept, so a prediction is never lost. Output is structured through Instructor, never parsed out of free text.",
      },
      {
        id: "validate",
        name: "validate",
        kind: "deterministic",
        caption: "Code must exist",
        detail:
          "The predicted account code or name has to appear in that organisation's real chart of accounts, and confidence has to fall in [0, 1]. A prediction that fails is not discarded, it is rewritten to confidence 0.0 with the reason recorded, which drops it into needs_review rather than silently vanishing.",
      },
      {
        id: "decide",
        name: "decide",
        kind: "deterministic",
        caption: "0.85 / 0.50 bands",
        detail:
          "Above 0.85 auto-categorised and written without a human. Between 0.50 and 0.85 suggested, shown with accept and reject. Below 0.50 needs_review with no suggestion displayed at all, because a confident-looking wrong guess costs more than an honest blank. Thresholds are config, not constants.",
      },
      {
        id: "explain",
        name: "explain",
        kind: "deterministic",
        caption: "EBM + fuzzy risk",
        detail:
          "Three layers of explanation on every decision: the model's own reasoning text, EBM feature importances once 50 categorised transactions exist, and a risk score from a hand-rolled Mamdani fuzzy engine, 8 readable rules with triangular membership functions and centroid defuzzification. Fuzzy was chosen over a neural anomaly detector precisely because an accountant can read and challenge the rules.",
      },
    ],
  },
  {
    key: "reconcile",
    label: "Reconcile",
    from: "Bank statement",
    to: "Matched or not",
    modelInPath: false,
    verdict:
      "No LLM is invoked at any stage, including the explanation. Identical inputs give an identical answer every time.",
    source: "backend/app/agents/reconciler.py",
    nodes: [
      {
        id: "find_candidates",
        name: "find_candidates",
        kind: "deterministic",
        caption: "Narrow the field",
        detail:
          "Pulls plausible counterpart transactions for the statement line before any scoring happens. Money is Decimal throughout, never float, because float rounding produces penny errors that surface as failed reconciliations.",
      },
      {
        id: "score_candidates",
        name: "score_candidates",
        kind: "deterministic",
        caption: "0.5 amount, 0.2 date, 0.3 text",
        detail:
          "Combined score is amount times 0.5, plus date times 0.2, plus description times 0.3. Amount scores 1.0 on an exact Decimal match and 0.8 within one percent. Date scores 1.0 same day and loses 0.15 per day. Description is RapidFuzz token_sort_ratio over 100. Amount is weighted hardest because in UK bank reconciliation an exact amount with a near date is almost always right.",
      },
      {
        id: "decide",
        name: "decide",
        kind: "deterministic",
        caption: "Match or leave open",
        detail:
          "Takes the highest scoring candidate and decides whether it clears the bar. No model is consulted, so the same statement line reconciled twice cannot produce two different answers.",
      },
      {
        id: "explain",
        name: "explain",
        kind: "deterministic",
        caption: "Fixed template",
        detail:
          "Builds its sentence from an f-string over the actual match scores: matched to TESCO STORES on 14 Mar, amount matches exactly, same day, description 87% similar. Readable without being generated. An LLM rewrite for more natural phrasing on edge cases is tracked as open work, deliberately not shipped.",
      },
      {
        id: "save",
        name: "save",
        kind: "store",
        caption: "Write and audit",
        detail:
          "Persists the match and writes the audit record. Every decision the system makes reaches the audit log, which is invariant 2 in the repo and exists for legal accountability and the GDPR right to explanation.",
      },
    ],
  },
  {
    key: "report",
    label: "Report",
    from: "Categorised ledger",
    to: "PDF",
    modelInPath: true,
    verdict:
      "The model writes prose and only prose. Every figure it narrates was computed in Python before it was called, so there is no arithmetic for it to get wrong.",
    source: "backend/app/services/document_service.py",
    nodes: [
      {
        id: "figures",
        name: "_calculate_figures",
        kind: "deterministic",
        caption: "Python, Decimal",
        detail:
          "Income, expenses, per-category totals and percentages, summed in Decimal. This runs to completion before the model is called at all, so the numbers exist independently of anything the model says about them.",
      },
      {
        id: "narrative",
        name: "_generate_narrative",
        kind: "model",
        caption: "Sonnet, prose only",
        detail:
          "Sonnet 4.6 receives the computed figures and returns a structured ManagementLetterNarrative. It writes the commentary. It does not produce, adjust or recompute a single number, which removes the failure mode where a plausible sentence carries a hallucinated total.",
      },
      {
        id: "render",
        name: "_render_html",
        kind: "deterministic",
        caption: "Jinja template",
        detail:
          "Figures and narrative are merged into one of three Jinja templates: management letter, profit and loss, or VAT summary. Money formatting happens here, in code, not in the prompt.",
      },
      {
        id: "pdf",
        name: "WeasyPrint",
        kind: "store",
        caption: "PDF, then audit",
        detail:
          "Rendered to PDF, stored against the organisation, and written to the audit log with the model version recorded so any generated document can be traced back to what produced it.",
      },
    ],
  },
];

/** Invariant 2 in the repo: every path terminates here, without exception. */
export const auditSink = {
  label: "audit_log",
  caption: "Every decision, with its model version, confidence and reasoning",
};

export const legend: { kind: NodeKind; label: string }[] = [
  { kind: "model", label: "LLM in the path" },
  { kind: "deterministic", label: "Deterministic" },
  { kind: "store", label: "Persistence" },
];

/** Where the whole thing runs. Kept short: it is the least interesting part. */
export const platform = [
  "Next.js on Vercel",
  "FastAPI on Railway",
  "Postgres 16 with pgvector",
  "Redis",
  "Xero OAuth2",
];
