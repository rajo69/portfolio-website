import type { Certification } from "./types";

/**
 * Certifications, with live verification links.
 *
 * The URLs supplied were LinkedIn `safety/go` redirect wrappers; the real
 * targets are unwrapped here so they resolve directly and keep working if
 * LinkedIn changes its redirector.
 *
 * `featured: true` marks the four surfaced by default. That follows the rule
 * in Rajarshi's own application profile: cap the visible list at three or
 * four JD-matched credentials, because listing all thirteen dilutes the
 * signal. On an AI portfolio the JD-matched set is the agentic, GenAI, RAG
 * and multi-agent ones, so Power BI and Azure Fundamentals sit in the
 * collapsed group as supporting context.
 *
 * Deliberately absent: AWS and GCP certifications are held, but no exact
 * certificate title was supplied and the standing rule is not to name a
 * credential that cannot be verified.
 */
export const certifications: Certification[] = [
  // ── Surfaced ─────────────────────────────────────────────────────────────
  {
    name: "Claude Code in Action",
    issuer: "Anthropic",
    issued: "2026-03",
    credentialId: "c8cdj4gsp8sy",
    url: "https://verify.skilljar.com/c/c8cdj4gsp8sy",
    category: "Agentic coding",
    featured: true,
  },
  {
    name: "Oracle Cloud Infrastructure 2025 Generative AI Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1127-25",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=D6B54E5902AACC72DDF3AC2E9C5984F1497870604F2492FD5F8307E3A9B81CD0",
    category: "Generative AI",
    featured: true,
  },
  {
    name: "Oracle AI Vector Search Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-184-25",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=B37D8FCE75E52084A62CFFEF3D52EEF92C382FB101D949583BFCA671E74A9AA6",
    category: "Retrieval",
    featured: true,
  },
  {
    name: "Oracle Fusion AI Agent Studio Foundations Associate",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1145-1",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=6DB00B3C2A4ED60C16DAA40ED70387D207A49A59CDB9E53A88D72440609E51CB",
    category: "Agents",
    featured: true,
  },

  // ── Collapsed by default ─────────────────────────────────────────────────
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1110-25",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=A87E8197D8E99C73B9DE881CB14016309F4AF61FC855C612DA10E17FEFD45EEF",
    category: "Machine learning",
  },
  {
    name: "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    issuer: "Oracle",
    issued: "2025-10",
    credentialId: "1Z0-1122-25",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=B176F82D000159F0C287E9B22B49DE7ABB1BA74323ED34AFBD07A82588C67D9D",
    category: "AI foundations",
  },
  {
    name: "Oracle Data Platform 2025 Foundations Associate",
    issuer: "Oracle",
    issued: "2025-11",
    credentialId: "1Z0-1195-25",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=A87E8197D8E99C73B9DE881CB1401630AE9D9A4489F1D4F0A9CC5D8DCEFB2D49",
    category: "Data platform",
  },
  {
    name: "Microsoft Azure AI Essentials Professional Certificate",
    issuer: "Microsoft and LinkedIn",
    issued: "2025-09",
    url: "https://www.linkedin.com/learning/certificates/0c5c93e0427929448a6144a2c1d28fbb57ac7129b2dc00a35df55729fcd16a31/",
    category: "Cloud AI",
  },
  {
    name: "Multi AI Agent Systems with crewAI",
    issuer: "CrewAI",
    issued: "2024-10",
    url: "https://learn.deeplearning.ai/accomplishments/d4cbd952-1a87-458b-9ee5-488efeb3d752?usp=sharing",
    category: "Agents",
  },
  {
    name: "Power BI Essential Training",
    issuer: "National Association of State Boards of Accountancy (NASBA)",
    issued: "2024-10",
    credentialId:
      "d7be08af7f7662aa8638036fd9df6660b5bce84c6c061e9053ac50a23ea4b1ac",
    url: "",
    category: "Data",
  },
  {
    name: "Deep Learning Onramp",
    issuer: "MathWorks",
    issued: "2024-06",
    url: "https://matlabacademy.mathworks.com/progress/share/certificate.html?id=71e4a247-8c58-4419-b6c8-c18a85c857a2",
    category: "Machine learning",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    issued: "2022-12",
    url: "https://www.credly.com/badges/aae08f6f-f9d3-4e81-bcf9-62444c0f6c14",
    category: "Cloud",
  },
  {
    name: "Enterprise Design Thinking Practitioner",
    issuer: "IBM",
    issued: "2021-06",
    url: "",
    category: "Practice",
  },
];
