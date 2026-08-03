import type { Certification } from "./types";

/**
 * Certifications.
 *
 * The source profile holds a much longer list and carries an explicit rule
 * against dumping all of it: listing everything dilutes the signal and reads
 * as padding. It also defines a role-family switch, and on an AI role the
 * GenAI and agent certifications are the JD-matched ones while Power BI and
 * Excel drop to secondary. This site is an AI portfolio, so it surfaces the
 * AI set and keeps the data ones as supporting context.
 *
 * Deliberately omitted: AWS and GCP certifications are held, but no exact
 * certificate title was supplied, and the standing rule is not to name a
 * credential that cannot be verified.
 *
 * TODO(rajarshi): credential IDs and verification URLs. The site's argument
 * is that things can be checked, so a cert that links to a live credential
 * page is worth considerably more than one that does not.
 */
export const certifications: Certification[] = [
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    issued: "2026-03",
    credentialId: "c8cdj4gsp8sy",
    url: "",
    category: "AI",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Generative AI Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1127-25",
    url: "",
    category: "AI",
  },
  {
    name: "Oracle AI Vector Search Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-184-25",
    url: "",
    category: "AI",
  },
  {
    name: "Oracle Fusion AI Agent Studio Foundations Associate",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1145-1",
    url: "",
    category: "AI",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1110-25",
    url: "",
    category: "ML",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    issuer: "Oracle",
    issued: "2025-10",
    credentialId: "1Z0-1122-25",
    url: "",
    category: "AI",
  },
  {
    name: "Microsoft Azure AI Essentials Professional Certificate",
    issuer: "Microsoft and LinkedIn",
    issued: "2025-09",
    url: "",
    category: "AI",
  },
  {
    name: "Multi AI Agent Systems with crewAI",
    issuer: "DeepLearning.AI",
    issued: "2024-10",
    url: "",
    category: "AI",
  },
  {
    name: "Power BI Essential Training",
    issuer: "LinkedIn Learning (NASBA CPE)",
    issued: "2024-10",
    credentialId:
      "d7be08af7f7662aa8638036fd9df6660b5bce84c6c061e9053ac50a23ea4b1ac",
    url: "",
    category: "Data",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    issued: "2022-12",
    url: "",
    category: "Cloud",
  },
];
