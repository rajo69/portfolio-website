import type { Experience } from "./types";

/**
 * Work history, newest first.
 *
 * TODO(rajarshi): send me this and I'll fill it. Per role I need:
 *   company · role · start & end (YYYY-MM) · location · one-line scope
 *   · 2–4 highlight bullets · the tools you used
 *
 * On bullets: the reference site's entire credibility comes from quantified
 * outcomes ("$185M new-business revenue", "zero to $1M ARR in nine months").
 * Lead with a verb, land a number. "Built a RAG pipeline" is invisible;
 * "Cut retrieval latency 340ms → 90ms across 12k regulatory documents" is not.
 * If a number genuinely doesn't exist, say what changed instead — don't invent one.
 */
export const experience: Experience[] = [
  {
    company: "TODO(rajarshi)",
    role: "TODO(rajarshi)",
    start: "TODO", // YYYY-MM
    end: "present",
    location: "TODO(rajarshi)",
    summary: "TODO(rajarshi) — one sentence on what you owned.",
    highlights: [
      "TODO(rajarshi) — verb-led, with a number.",
      "TODO(rajarshi)",
    ],
    tech: [],
  },
];
