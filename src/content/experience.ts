import type { Experience } from "./types";

/**
 * Work history, newest first.
 *
 * Bullets are short on purpose. Anything longer belongs on the CV, and the
 * site's job is to land the point fast.
 *
 * Every guardrail from the source profile is honoured:
 *   - Real job titles only. IBM is "Application Developer", not a retitle.
 *   - The Dynamics 365 migration was led by a technical stakeholder and
 *     supported by Rajarshi, who owned the data path in. Never "I led".
 *     The Copilot migration IS his to claim as led.
 *   - The 13% processing-time reduction is "one of the main contributors",
 *     not sole causation.
 *   - EMIS Web is user-level familiarity via NHS Smart Card, not developer
 *     or integration level, so it is not claimed here at all.
 *   - ADHDNET's ISO 27001 / 42001 status is not established. Describe the
 *     controls; never write "ISO 42001 compliant" or "Annex A".
 *   - The IBM forecasting algorithm is deliberately unnamed: he could not
 *     recall it, and an honest gap beats a guess.
 *   - The 17% decision-making figure has no baseline and is omitted. Do not
 *     reintroduce it without one.
 *
 * The source file also holds NI number, date of birth, home address, visa
 * status, salary, health and equality data, and referee contacts. None of it
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
      "Current employment, alongside independent AI engineering work.",
    highlights: [
      "Regulated retail environment: betting and gaming queries, transactions, responsible-gambling procedure at point of service.",
    ],
    tech: [],
    /**
     * Rendered, but last and without metrics.
     *
     * It does not sell the AI or data story, and Rajarshi did not name it when
     * scoping this section. It stays because it is current employment and
     * silently dropping it leaves an unexplained gap on a page that otherwise
     * runs to the present day. Set `hidden: true` to remove it.
     */
  },

  {
    company: "ADHDNET",
    role: "Data Analyst",
    start: "2025-04",
    end: "2025-09",
    location: "Leeds, UK",
    summary:
      "Owned the data path for NHS ADHD referrals, from the reporting pipeline through to the access controls over special category health data.",
    metrics: [
      { value: "500+", caption: "Referral cases validated monthly" },
      { value: "13%", caption: "Processing time cut, one of the main drivers" },
      { value: "30+", caption: "Clinicians, plus GPs and patients directly" },
    ],
    highlights: [
      "Built a Power Query validation layer over referral records that had been spread across separate spreadsheets, under GDPR.",
      "Power Automate flows over Outlook notifying admins on arrival and the allocated clinician on filing.",
      "Supported the migration from Excel to Dynamics 365, owning the data path in via Power Query extraction.",
      "Set up Entra ID with MFA and role-based SharePoint access so each clinician saw only their own referrals.",
      "Enabled version control and audit logging across the report edit cycle, giving a traceable record of every change.",
      "Configured ChatGPT Enterprise inside a data boundary, then led the admin workflow migration to Copilot.",
    ],
    tech: [
      "Power Query",
      "Power Automate",
      "Dynamics 365",
      "SharePoint",
      "Entra ID",
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
    metrics: [
      { value: "14%", caption: "Marketing ROI, and 6% revenue" },
      { value: "68%", caption: "Reporting migrated to Tableau in 3 months" },
      { value: "9%", caption: "Attrition cut by the churn model" },
    ],
    highlights: [
      "Led a demand-forecasting engagement, running six junior analysts across fortnightly sprints and owning delivery and stakeholder management.",
      "Deployed an XGBoost churn model the business ignored until I made the driving features legible in plain language.",
      "Migrated reporting from manual Excel to Tableau on an ETL pipeline from the warehouse, across three phases.",
      "Built an insurance performance dashboard in Power BI over Snowflake, pushing computation to the database tier with tuned SQL views.",
      "Caught roughly 15% of policy renewal dates missing from an ETL extract, traced it to an unmapped field and added a threshold alert.",
      "Maintained a RAID log on led engagements, tracking messy historical data and stakeholder scepticism as delivery risks.",
    ],
    tech: ["Python", "XGBoost", "Tableau", "Power BI", "Snowflake", "SQL", "ETL"],
  },

  // TODO(rajarshi): freelance engagements. For each one I need the client or
  // sector (anonymised is fine), what you built, roughly when, and one
  // outcome. Nothing is rendered for freelance until that arrives, because a
  // placeholder row would look worse than its absence.
];
