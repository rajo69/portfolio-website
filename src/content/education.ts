import type { Education } from "./types";

/**
 * Education, newest first.
 *
 * Guardrail carried over from the source profile: R was used during the MSc
 * in taught coursework only. Claim working familiarity from study, never
 * professional use or "X years of R".
 */
export const education: Education[] = [
  {
    institution: "University of Leeds",
    degree: "MSc",
    field: "Data Science and Analytics",
    start: "2023-09",
    end: "2024-11",
    location: "Leeds, UK",
    grade: "Merit",
    thesis:
      "Enhancing Neural Network Robustness using Hybrid Adversarial Training",
    highlights: ["Python, SQL and R across taught modules and dissertation work."],
  },
  {
    institution: "Techno India Saltlake",
    degree: "BTech",
    field: "Electronics and Communication Engineering",
    start: "2016-07",
    end: "2020-07",
    location: "Kolkata, India",
    grade: "GPA 7.91 / 10",
    highlights: [],
  },
];
