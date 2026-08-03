import type { Experience } from "./types";

/**
 * Work history, newest first. Sourced from the council-application profile
 * and evidence packs, with every guardrail in those files honoured:
 *
 *   - Real job titles only. IBM is "Application Developer", not a retitle.
 *   - The Dynamics 365 migration was led by a technical stakeholder and
 *     supported by Rajarshi, who owned the data path in. Never "I led".
 *     The Copilot migration IS his to claim as led.
 *   - The 13% processing-time reduction is "one of the main contributors",
 *     not sole causation.
 *   - EMIS Web is user-level familiarity via NHS Smart Card, not developer
 *     or integration level.
 *   - ADHDNET's ISO 27001 / 42001 status is not established. Describe the
 *     controls; never write "ISO 42001 compliant" or "operationalised Annex A".
 *   - The IBM forecasting algorithm is deliberately unnamed: he could not
 *     recall it, and an honest gap beats a guess.
 *   - The 17% decision-making figure has no baseline and is omitted here.
 *     Do not reintroduce it without one.
 *
 * NOTE: the source file also holds NI number, date of birth, home address,
 * visa status, health and equality data, and referee contacts. None of that
 * belongs on a public site and none of it is imported here.
 */
export const experience: Experience[] = [
  {
    company: "William Hill",
    role: "Customer Service Representative",
    start: "2025-10",
    end: "present",
    location: "Bradford, UK",
    summary:
      "Customer-facing role alongside continued independent AI engineering work.",
    highlights: [
      "Handle betting and gaming queries and process transactions in a regulated retail environment.",
      "Support responsible-gambling compliance procedures at the point of service.",
    ],
    tech: [],
  },

  {
    company: "ADHDNET",
    role: "Data Analyst",
    start: "2025-04",
    end: "2025-09",
    location: "Leeds, UK",
    summary:
      "Owned the data path for NHS ADHD assessment referrals, covering the reporting pipeline and the access controls over special category health data.",
    highlights: [
      "Built a Power Query validation layer over 500+ referral cases a month under GDPR, consolidating records that had been spread across multiple spreadsheets.",
      "Built Power Automate flows over Outlook that notified admins on referral arrival and notified the allocated clinician once a referral was filed. These were one of the main contributors to a 13% reduction in processing time.",
      "Supported the migration from the Excel workflow to Microsoft Dynamics 365 as the single source of truth, owning the data path in by extracting Jane referral data with Power Query.",
      "Set up Microsoft Entra ID with MFA and role-based SharePoint access so each contracted clinician saw only their assigned referrals, with version control and audit logging over the report edit cycle.",
      "Configured ChatGPT Enterprise inside an enterprise data boundary, then led the migration of the admin workflow to Microsoft Copilot, standardising prompts so outputs stayed consistent and identifiers stayed out.",
      "Worked directly with patients, referring GP practices, 30+ contracted clinicians and an internal admin team of four.",
    ],
    tech: [
      "Power Query",
      "Power Automate",
      "Dynamics 365",
      "SharePoint",
      "Microsoft Entra ID",
      "Copilot",
    ],
  },

  {
    company: "IBM",
    role: "Application Developer",
    start: "2021-02",
    end: "2023-08",
    location: "India",
    summary:
      "Technology consulting for a US insurance carrier, moving from analytics delivery into leading engagements after promotion.",
    highlights: [
      "Led a 3 to 4 month demand-forecasting engagement, running six junior analysts across fortnightly sprints and owning planning, delivery and stakeholder management. The client used the output to redirect marketing investment, improving marketing ROI by 14% and revenue by 6%.",
      "Deployed an XGBoost churn model in Python that reduced attrition by 9%. The business team ignored it at first because it read as a black box, so I made the driving features legible in plain language and framed them as support for their judgement.",
      "Led a 68% migration of the client's reporting from manual Excel to Tableau in three months, built on an ETL pipeline from the data warehouse across requirements, dashboard development and structured handover.",
      "Built an Insurance Products Performance Dashboard in Power BI over Snowflake, pushing computation to the database tier with tuned SQL views and window functions so the reporting layer stayed light.",
      "Caught roughly 15% of policy renewal dates missing from an ETL extract via an automated null-detection check, traced it to an unmapped field left by a system migration, fixed it at source and added a threshold alert.",
    ],
    tech: ["Python", "XGBoost", "Tableau", "Power BI", "Snowflake", "SQL"],
  },
];
