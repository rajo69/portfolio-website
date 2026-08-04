/**
 * The application harness, as documented in Rajarshi's Obsidian vault.
 *
 * PROVENANCE. Every node below is one note in `harness-system-vault`, and every
 * blurb and bullet is condensed from that note's own words. The guard table is
 * transcribed from `Failure Modes Ledger.md`, which lists fifteen failures that
 * happened during live runs and the primitive that killed each one. Nothing
 * here is invented. If the vault changes, update this file from it rather than
 * editing by hand.
 *
 * WHAT IS DELIBERATELY ABSENT. The vault carries a note called `Personal Data
 * Boundary` stating that it documents the machine and contains no candidate
 * data and no job data: no name, contact details, identifiers, qualifications,
 * employers, immigration status, referees, credentials, or real job listings.
 * Every store note describes its schema and its disciplines, never its values.
 * That boundary is why this is publishable at all, and it is also why
 * `data-boundary` is included as a node rather than quietly omitted: the
 * discipline is part of the system, not scaffolding around it.
 *
 * The vault's own test, applied to every note: "would this note still be true
 * and useful for a completely different person applying to a completely
 * different sector?" That is the same test to apply to anything added here.
 *
 * No em dashes anywhere in this file.
 */

/** Five kinds. Colour and stroke encode this and nothing else. */
export type HarnessKind = "stage" | "component" | "store" | "principle" | "skill";

export interface HarnessNode {
  id: string;
  /** Short label, for the node itself. */
  label: string;
  /** The vault note's own title. */
  title: string;
  kind: HarnessKind;
  /** Pipeline position, stages only. */
  step?: number;
  /** One or two sentences. */
  blurb: string;
  /** Two to four bullets. Never prose. */
  points: string[];
  /** Other node ids this note links to. Drives the graph edges. */
  links: string[];
}

/**
 * A failure that actually happened, and the primitive that made it impossible
 * to repeat. `firesAt` maps each one onto the stages where it runs, which is
 * the thing the vault knows and a flat list of guards cannot show.
 */
export interface HarnessGuard {
  /** The primitive's real name in the source. */
  name: string;
  /** What went wrong, in the ledger's own framing. */
  failure: string;
  /** What the guard does instead. */
  behaviour: string;
  firesAt: string[];
}

/* ------------------------------------------------------------------ *
 * The ten stages. This is the spine.
 * ------------------------------------------------------------------ */

const stages: HarnessNode[] = [
  {
    id: "recon",
    label: "Recon",
    title: "Stage 1 - Recon",
    kind: "stage",
    step: 1,
    blurb:
      "Resolve the portal and decide the route before any expensive work starts. Entirely offline, near zero cost.",
    points: [
      "Engine resolved from the URL by longest-substring match, so a vanity domain beats a generic one pointing at the same engine",
      "Emits the route, every human-gate reason as a separate flag, and the per-phase model plan",
      "Emits live checks: the things the knowledge base cannot answer and the page must, such as the real character limit",
      "Split in two, a deterministic half in recon.py and a reading half as a skill, so only genuine judgement is paid for",
    ],
    links: ["route-decision", "model-allocation", "recon-py", "recon-skill"],
  },
  {
    id: "register",
    label: "Register",
    title: "Stage 2 - Register Job",
    kind: "stage",
    step: 2,
    blurb:
      "One command owns every piece of state a new job creates, so no agent has to remember any of it.",
    points: [
      "The tracker row is appended before any browser work, because browser work is the part that fails",
      "A job must never be able to exist on disk without existing in the tracker",
      "One job-number assigner, scanning the tracker and both directories, so a number cannot be reused after archiving",
      "Tracker writes go to a temporary file and swap into place, so it is never left half-written",
    ],
    links: ["apply-job", "job-list", "job-folder", "job-manifest", "check-job"],
  },
  {
    id: "harvest",
    label: "Harvest",
    title: "Stage 3 - Harvest Documents",
    kind: "stage",
    step: 3,
    blurb:
      "Fetch the specification, because the specification is the scoring rubric. Drafting from advert blurb instead is a silent quality failure.",
    points: [
      "Links qualify by file extension or by text that reads like a specification, with a skip list for navigation noise",
      "Fetched through the live browser session, never a bare client, since many portals gate documents on session or referrer",
      "A frameset brief has its child frames searched, largest text wins",
      "Anything unfetchable is reported, never dropped, and re-surfaced later by the folder gate",
    ],
    links: ["job-manifest", "check-job", "phase-contracts"],
  },
  {
    id: "scout",
    label: "Scout",
    title: "Stage 4 - Portal Scout and Session",
    kind: "stage",
    step: 4,
    blurb:
      "Follow the advert through to the real form, get authenticated, and capture what the portal demands before writing a word.",
    points: [
      "Account handling is fully machine-owned: register, read the verification code from mail, or run the reset flow",
      "Whatever credential actually worked is written back at the moment it worked",
      "Captures the on-screen guidance verbatim, and the real limits read off the field rather than assumed",
      "Sessions expiring mid-run is normal and recovered in-flight, escalating only when recovery genuinely fails",
    ],
    links: ["accounts", "portal-lib", "three-interrupts", "browser-substrate"],
  },
  {
    id: "statement",
    label: "Statement",
    title: "Stage 5 - Statement Refinement Loop",
    kind: "stage",
    step: 5,
    blurb:
      "The highest-value artifact in the run, and the place where a mistake is most silent. Strongest model, and a loop that runs on every job unprompted.",
    points: [
      "Coverage and regression check: every criterion evidenced, and no evidence silently dropped by a later edit",
      "Unmet criteria with no basis in the profile go to the human as one batched question set, never invented to close a gap",
      "A de-AI pass gated by the style linter, then truth and format gated by the validator, both until zero errors",
      "A blind panel sees the criteria and the finished text only, because a panel that watched the drafting is not independent",
    ],
    links: ["style-lint", "validator", "phase-contracts", "supporting-statement", "text-gates"],
  },
  {
    id: "cv",
    label: "Tailored CV",
    title: "Stage 6 - Tailored CV",
    kind: "stage",
    step: 6,
    blurb:
      "Tailored per job and matched against that job's specification, with the exact uploaded file saved under a job-specific name.",
    points: [
      "The archive must show what was actually sent, not something like it",
      "Regenerated from the profile layer, which is the single source of truth, not from presentation-oriented CV text",
      "Density presets are tried roomy to tight and the first that fits is kept. No content is cut to fit, only layout gives way",
      "If the engine requires an upload, the run is classified human-gated and everything else is still filled and saved",
    ],
    links: ["cv-generator", "profile", "route-decision"],
  },
  {
    id: "fill",
    label: "Fill & Verify",
    title: "Stage 7 - Fill and Verify",
    kind: "stage",
    step: 7,
    blurb:
      "Fill every section using the primitives, then prove each save against the portal's own record rather than against the page.",
    points: [
      "Resolve by role and accessible name, not by a framework-generated id, because ids drift between screens of one form",
      "A click that changes nothing is a wrong selector, not a human gate. It raises, and is never retried blindly",
      "Text is passed as data, never interpolated into code, so backslashes, quotes and regex characters are inert",
      "Nothing is saved on top of an injection that did not land, and a destructive control is never clicked",
    ],
    links: ["portal-lib", "ground-truth", "trac-driver", "profile"],
  },
  {
    id: "gate",
    label: "Gate & Handover",
    title: "Stage 8 - Gate and Handover",
    kind: "stage",
    step: 8,
    blurb:
      "The run ends when the form is full, provable, and checked. The machine never submits.",
    points: [
      "Save the filled-form PDF, the record of exactly what was entered",
      "Run the folder gate, which must come back clean",
      "Hand over at the review page with a field-by-field summary",
      "Every value that could not be independently verified is flagged explicitly, never quietly left in the form",
    ],
    links: ["check-job", "three-interrupts", "job-folder"],
  },
  {
    id: "finish",
    label: "Finish",
    title: "Stage 9 - Finish and Archive",
    kind: "stage",
    step: 9,
    blurb:
      "After the human submits, one command flips the tracker row, moves the folder, and re-runs the gate.",
    points: [
      "The gate re-runs and its exit code is returned, so archiving can never mask a failure",
      "A folder's directory and its tracker row must agree in both directions",
      "The state model is deliberately small, and no new columns are added per job",
      "Anything richer would make the tracker a second, competing source of truth",
    ],
    links: ["apply-job", "job-list", "check-job"],
  },
  {
    id: "kb",
    label: "KB Write-back",
    title: "Stage 10 - KB Write-back",
    kind: "stage",
    step: 10,
    blurb:
      "Mandatory after every job. The single step that makes the pipeline self-improving, because skipping it means paying for the same discovery twice.",
    points: [
      "Upsert by engine, never append per job, so growth stays proportional to engines rather than to jobs",
      "Confirmed and stable mechanics only. A one-off transient error must never become permanent knowledge",
      "Surgical edits only: loading and dumping the file strips the comments, and the commentary is part of the knowledge",
      "Verified afterwards by an integrity checker plus a recon smoke test on the job just completed",
    ],
    links: ["portals", "check-portals", "self-improving", "truth-overrides", "recon"],
  },
];

/* ------------------------------------------------------------------ *
 * Components. Code, and the invariants it enforces.
 * ------------------------------------------------------------------ */

const components: HarnessNode[] = [
  {
    id: "portal-lib",
    label: "portal_lib.py",
    title: "Component - portal_lib.py",
    kind: "component",
    blurb:
      "Engine-agnostic browser primitives. Every recurring failure here was once a rule an agent had to remember; each primitive turns one into something that cannot be skipped, because skipping it raises.",
    points: [
      "Its exception types are the design: NoOpClick, TextNotSet, NotSaved, LoggedOut, each naming a specific silent failure observed live",
      "A no-op click is caught by fingerprinting the page before and after, with an optional predicate for clicks that legitimately change nothing",
      "Twelve primitives covering attach, resolve, click, inject, upload, limits, sessions, fetch and verify",
    ],
    links: ["ground-truth", "loud-silent", "failure-ledger", "browser-substrate"],
  },
  {
    id: "check-job",
    label: "check_job.py",
    title: "Component - check_job.py",
    kind: "component",
    blurb:
      "The folder and tracker gate. Turns invariants that once lived as prose into an executable check, so that 'the agent forgot' stops being a possible state.",
    points: [
      "Read-only, non-zero exit on any error, run at the end of every job and periodically across every folder",
      "No statement present is a warning. A statement present but no specification is an ERROR, because it was drafted without the scoring criteria",
      "Missing work is visible. Work done against the wrong input is not, which is why only one of them escalates",
      "Runs both text gates across every text file, so a box never individually checked still gets caught",
    ],
    links: ["text-gates", "validator", "style-lint", "job-list", "phase-contracts"],
  },
  {
    id: "check-portals",
    label: "check_portals.py",
    title: "Component - check_portals.py",
    kind: "component",
    blurb:
      "Read-only integrity guard for the knowledge base, run after every write-back to enforce its guarantees deterministically rather than by good intentions.",
    points: [
      "Duplicate knowledge within an engine is an error; soft caps on list growth are warnings that say consolidate, not stop",
      "Structural and referential integrity: the file parses, every URL signature points at an engine that exists",
      "The knowledge base duplicates facts into quick-reference lists for speed, so a checker enforces they cannot silently diverge",
    ],
    links: ["portals", "kb"],
  },
  {
    id: "validator",
    label: "validator.py",
    title: "Component - validator.py",
    kind: "component",
    blurb:
      "Deterministic pre-submit validator for free text. It reads the exact text that would be submitted, reports by severity, and never edits anything.",
    points: [
      "Banned dash characters are an error outright, as a recognised machine-writing tell",
      "False qualification claims and false title assertions, checked against the profile layer as the only truth source",
      "Context-sensitive: a presentation label on the same line as an employer is an error, elsewhere a warning, since it may be the role applied for",
      "Polished CV text is deliberately not trusted as a truth source",
    ],
    links: ["truth-overrides", "profile", "text-gates"],
  },
  {
    id: "style-lint",
    label: "style_lint.py",
    title: "Component - style_lint.py",
    kind: "component",
    blurb:
      "A deterministic AI-style linter. Catches the mechanical machine-writing tells that recur across drafts, so the judgement-heavy pass only handles the subtle residue.",
    points: [
      "Balanced antithesis frames, summary-bow endings and three-part parallel structures are errors",
      "Uniform sentence rhythm is detected statistically, by coefficient of variation, independent of any word list",
      "An ERROR means 'reads as machine-written', not 'false'. That scale composes with the validator's scale about truth",
      "Deterministic means it flags the same class every time, with no human re-prompting pass after pass",
    ],
    links: ["text-gates", "statement"],
  },
  {
    id: "apply-job",
    label: "apply_job.py",
    title: "Component - apply_job.py",
    kind: "component",
    blurb:
      "The single entry point, and the only route into the system. Owns every piece of state a job creates.",
    points: [
      "A job arriving as a link previously had no defined route in: no number, no tracker row, no folder",
      "Atomic tracker writes, one job-number assigner, advert captured as both text and PDF",
      "Recon failure is never fatal here. An unknown engine is a valid state carried forward as data, not an error",
      "On finish it re-runs the gate and returns its exit code, so archiving cannot hide a failure",
    ],
    links: ["job-list", "job-folder", "job-manifest", "register", "finish"],
  },
  {
    id: "recon-py",
    label: "recon.py",
    title: "Component - recon.py",
    kind: "component",
    blurb:
      "The deterministic half of pre-flight. Additive and read-only: it reads the knowledge base and touches nothing live.",
    points: [
      "The route is an exit code, so a caller can branch on it without parsing text",
      "The model-planning function carries its reasoning in the source, including the note that if the guards are ever removed the cheap phases must go back",
      "The rationale lives next to the code it governs, so it cannot drift away from it",
    ],
    links: ["portals", "route-decision", "model-allocation", "recon"],
  },
  {
    id: "trac-driver",
    label: "per-engine driver",
    title: "Component - trac_driver.py",
    kind: "component",
    blurb:
      "The pattern for turning hard-won portal mechanics into code. When an engine proves expensive, the answer is a driver, not a longer runbook.",
    points: [
      "Three tiers, cheapest-reliable first: replay the portal's own save request, then DOM discipline, then the verify oracle",
      "On a reactive app, setting a value programmatically updates the page but not the framework's model, so the save ships blanks",
      "Trusted input events fire what the framework actually observes, which accounts for the whole class of disappearing fields",
    ],
    links: ["ground-truth", "invariants", "fill"],
  },
  {
    id: "cv-generator",
    label: "CV generator",
    title: "Component - CV generator",
    kind: "component",
    blurb:
      "Regenerates the master CV from the profile layer, the single source of truth, rather than from presentation-oriented text.",
    points: [
      "Where a polished CV phrasing conflicts with the profile layer, the profile wins",
      "Fit by layout, never by deletion. Truth is not a layout variable",
      "Surfaces contradictions rather than silently picking a side, and verifies the produced document rather than assuming success",
    ],
    links: ["profile", "cv", "check-job"],
  },
  {
    id: "browser-substrate",
    label: "browser substrate",
    title: "Browser Substrate",
    kind: "component",
    blurb:
      "One long-lived, headed, visible browser that everything attaches to over a debugging port. The human watches the run.",
    points: [
      "Attach, never spawn. The primitives speak the debugging protocol directly, so there is no daemon that can hang",
      "Never launched or closed mid-run, because logged-in mail and portal sessions must survive between runs",
      "An attach that hangs while the port answers is one wedged tab, not a dead browser. Relaunching would destroy every live session",
    ],
    links: ["portal-lib", "scout", "ground-truth"],
  },
];

/* ------------------------------------------------------------------ *
 * Stores. State, and the disciplines that keep it trustworthy.
 * ------------------------------------------------------------------ */

const stores: HarnessNode[] = [
  {
    id: "portals",
    label: "portals.yaml",
    title: "Store - portals.yaml",
    kind: "store",
    blurb:
      "The apply-time knowledge base, keyed by recruitment engine rather than by employer. That choice is the whole reason growth stays bounded.",
    points: [
      "Hundreds of employers share a few dozen engines, so learning is per engine",
      "Per-engine fields cover account model, verification, password policy, challenge, statement structure, upload requirement and where the confirmation appears",
      "Comments are content: the file carries its own write-back rules, which is why it must be edited surgically",
      "A stub section holds engines seen but not yet learned, an explicit known unknown",
    ],
    links: ["check-portals", "recon-py", "kb", "self-improving"],
  },
  {
    id: "job-manifest",
    label: "job_manifest.json",
    title: "Store - job_manifest.json",
    kind: "store",
    blurb:
      "The brief. Written once at registration and read by every later phase, so the decisions are made once, recorded as data, and then simply read.",
    points: [
      "Its stated purpose is to hand the fill phase a small, current brief instead of a long runbook",
      "Carries the per-phase model plan, the phase input contracts, the stop point, and the interrupt list",
      "Records what failed to download, which the folder gate re-surfaces so a harvest failure cannot be forgotten between stages",
    ],
    links: ["model-allocation", "phase-contracts", "apply-job", "invariants"],
  },
  {
    id: "job-list",
    label: "job-list.csv",
    title: "Store - job-list.csv",
    kind: "store",
    blurb:
      "The tracker. One row per job, a fixed schema, and no per-job columns.",
    points: [
      "A row exists before any browser work, so a job cannot exist on disk without existing here",
      "Writes are atomic, written to a temporary file and swapped into place",
      "Machine-owned. Editing it by hand is how drift starts",
      "Row and folder must agree in both directions, and an orphan row is an error",
    ],
    links: ["apply-job", "check-job", "register", "data-boundary"],
  },
  {
    id: "job-folder",
    label: "job folder",
    title: "Store - Job Folder",
    kind: "store",
    blurb:
      "One directory per job, holding the complete evidence trail. It must be able to answer, months later, exactly what was sent and what it was written against.",
    points: [
      "What did they ask for: the advert and the specification",
      "What did we say: the statement and the filled-form PDF",
      "What did we attach: the saved upload, under a job-specific name",
      "What did the portal demand: the captured on-screen guidance",
    ],
    links: ["check-job", "finish", "job-manifest"],
  },
  {
    id: "profile",
    label: "profile layer",
    title: "Store - Profile and Evidence Layer",
    kind: "store",
    blurb:
      "The single source of truth about the candidate, in three tiers: facts and standing preferences, a capability map, and per-context evidence packs.",
    points: [
      "Standing preferences are answers, not questions, which is what shrinks the human's role to three interrupts",
      "Surfacing is selective: items carry tags describing when they should appear, so volume does not dilute relevance",
      "Write-back is filtered. Only durable facts learned in a gap interview persist; one-off facts are used and discarded",
      "Structure only in the vault. The values are candidate data and are out of scope by design",
    ],
    links: ["validator", "data-boundary", "statement", "cv-generator"],
  },
  {
    id: "accounts",
    label: "accounts.yaml",
    title: "Store - accounts.yaml",
    kind: "store",
    blurb:
      "Per-portal credential store. Structure only in the vault, never values.",
    points: [
      "Always write back the credential that actually worked, at the moment it worked",
      "A store that is only mostly current is worse than none, because the failure mode is a lockout mid-run",
      "One mail inbox is the recovery point for every portal, making it the one prerequisite only a human can restore",
    ],
    links: ["scout", "three-interrupts", "data-boundary"],
  },
  {
    id: "truth-overrides",
    label: "truth_overrides.yaml",
    title: "Store - truth_overrides.yaml",
    kind: "store",
    blurb:
      "The content-truth pattern list the validator screens against, so truth checking is data-driven rather than hard-coded.",
    points: [
      "Caution patterns carry their own rule text, because a warning that explains why it fired is actionable",
      "Built-in defaults exist, since a safety net that a missing dependency can disable is not a safety net",
      "New drift patterns are added at write-back, deduplicated. Observe once, encode, never rediscover",
    ],
    links: ["validator", "kb", "data-boundary"],
  },
];

/* ------------------------------------------------------------------ *
 * Principles. The reasoning, and the two orchestration policies.
 * ------------------------------------------------------------------ */

const principles: HarnessNode[] = [
  {
    id: "loud-silent",
    label: "Loud vs Silent",
    title: "Design Principle - Loud vs Silent Failure",
    kind: "principle",
    blurb:
      "The single idea the whole harness is built on. Failures are sorted by how they announce themselves.",
    points: [
      "LOUD: a field gets the wrong value. A guard raises immediately, and it is cheap to fix",
      "SILENT: a weak statement, or a wrong mechanic written into the knowledge base. Nobody ever finds out, and the cost repeats forever",
      "Every primitive exists to convert a silent failure into a loud one",
      "The dependency runs one way: because the guards make filling loud, a cheaper model is safe there. Remove them and the allocation must change back",
    ],
    links: ["model-allocation", "portal-lib", "invariants", "failure-ledger"],
  },
  {
    id: "invariants",
    label: "Invariants in code",
    title: "Design Principle - Invariants Live in Code, Not in Prose",
    kind: "principle",
    blurb:
      "A rule written in a runbook is a rule an agent must remember. A rule written in a script is a rule that cannot be skipped, because skipping it raises.",
    points: [
      "Where prose and a script disagree, the script wins. Prose with an executable counterpart is documentation, not authority",
      "The runbook shrinks over time instead of growing, because each lesson becomes a line of code and leaves the prose",
      "Six invariant families, each with the component that enforces it",
    ],
    links: ["loud-silent", "apply-job", "portal-lib", "check-job", "validator", "style-lint"],
  },
  {
    id: "ground-truth",
    label: "Ground truth, not DOM",
    title: "Design Principle - Verify Against the Portal's Own Record",
    kind: "principle",
    blurb:
      "A DOM read can show text the server never stored. The rendered page reflects what the browser believes; a save is only real when the server agrees.",
    points: [
      "Verification never reads the field it just wrote. It opens the portal's own printout view and looks for the value there",
      "Fetched through the same browser session, so security-gated print pages work",
      "Checks two directions: strings that must be present, and strings that must have gone, catching stale text left by a failed edit",
    ],
    links: ["portal-lib", "loud-silent", "trac-driver", "fill"],
  },
  {
    id: "three-interrupts",
    label: "Three interrupts",
    title: "Design Principle - Only Three Things May Interrupt the Human",
    kind: "principle",
    blurb:
      "Autonomy defined by exclusion rather than by a permission list. Everything is the machine's job except three things.",
    points: [
      "A CAPTCHA. Never solved, never bypassed. The run stops and hands over",
      "An AI-use declaration question. Never auto-answered, because it is the human's statement about their own process",
      "A mandatory field with no truthful answer available. Fabrication is not an option, so the only move is to ask",
      "And one boundary that is not an interrupt: the machine never submits. The final click is always human",
    ],
    links: ["route-decision", "loud-silent", "gate", "validator"],
  },
  {
    id: "self-improving",
    label: "Run N+1 is cheaper",
    title: "Design Principle - Self-Improving Knowledge Loop",
    kind: "principle",
    blurb:
      "Each application teaches the system how one portal behaves. Folding that back is what stops the pipeline paying twice for the same discovery.",
    points: [
      "Upsert by engine, never append per job, so growth stays proportional to distinct engines",
      "Confirmed and stable mechanics only. When unsure, do not persist",
      "A novel engine escalates two phases to the strongest model for that run only, then drops back automatically after write-back",
    ],
    links: ["kb", "portals", "model-allocation", "truth-overrides"],
  },
  {
    id: "model-allocation",
    label: "Model allocation",
    title: "Model Allocation Policy",
    kind: "principle",
    blurb:
      "Strongest model where a mistake is silent and expensive. Cheaper model where a mistake is loud and immediate. Computed once by recon and written into the manifest.",
    points: [
      "Never re-argued per session, because re-deciding is itself a cost",
      "Top tier on drafting, on the cold panel review, and on write-back, where 'stable mechanic or one-off?' is real judgement",
      "A cheap review is no review",
      "The mid tier is only safe on filling because the primitives make its mistakes loud. That dependency is written in the source",
    ],
    links: ["loud-silent", "recon-py", "job-manifest", "self-improving"],
  },
  {
    id: "phase-contracts",
    label: "Phase contracts",
    title: "Phase Input Contracts",
    kind: "principle",
    blurb:
      "Every phase declares what it must be given. A phase that cannot see its inputs must stop and say so, rather than proceeding on thinner material.",
    points: [
      "This is what stops the workflow living in a human's head and being re-explained each session",
      "The specification is the scoring rubric, so its absence is an ERROR rather than a warning",
      "The panel must be blind: it receives the criteria and the finished text only, because a panel that watched the drafting is not independent",
    ],
    links: ["job-manifest", "check-job", "statement", "invariants"],
  },
  {
    id: "route-decision",
    label: "Route decision",
    title: "Route Decision",
    kind: "principle",
    blurb:
      "Before any expensive agent runs, recon answers one question: can this run complete autonomously? Four routes, each with its own exit code.",
    points: [
      "A listing domain often differs from the apply domain, so an unresolved engine is a valid state, never an error",
      "A job can be gated twice. The first gate drives the route, but every human reason is surfaced as a flag so none is lost behind the first",
      "Machine-readable by design, so the decision can be branched on without parsing text",
    ],
    links: ["recon", "three-interrupts", "recon-py", "cv"],
  },
  {
    id: "text-gates",
    label: "Text gates",
    title: "Text Gates",
    kind: "principle",
    blurb:
      "Two gates run on the exact final text of every box before anything is submitted. Neither ever edits anything. They read, report, and refuse.",
    points: [
      "The validator answers: is this true, and does it fit?",
      "The style linter answers: does this read as written by a person?",
      "Both emit the same finding shape and severity scale, so one runner calls both and severities merge without special-casing",
      "ERROR blocks with no override. WARN is judgement, surfaced to a human rather than auto-resolved",
    ],
    links: ["validator", "style-lint", "check-job", "statement"],
  },
  {
    id: "failure-ledger",
    label: "Failure ledger",
    title: "Failure Modes Ledger",
    kind: "principle",
    blurb:
      "Every primitive in this system is a scar. Fifteen rows, each a failure that actually happened and the guard that made it impossible to repeat.",
    points: [
      "Read the right-hand column and the design becomes obvious: the system converts memory into mechanism",
      "A rule that must be remembered fails eventually. A rule that raises does not",
    ],
    links: ["loud-silent", "invariants", "portal-lib"],
  },
  {
    id: "data-boundary",
    label: "Data boundary",
    title: "Personal Data Boundary",
    kind: "principle",
    blurb:
      "The vault documents the machine. It deliberately contains no candidate data and no job data, and every store note describes schema and disciplines rather than values.",
    points: [
      "Excluded by design: identity, qualifications, immigration status, referees, monitoring answers, credentials, and real job listings",
      "Possible because the pipeline is engine-keyed rather than employer-keyed, and profile-driven rather than hard-coded",
      "The test applied to every note: would this still be true and useful for a completely different person applying in a completely different sector?",
    ],
    links: ["profile", "accounts", "truth-overrides", "job-list"],
  },
];

/* ------------------------------------------------------------------ *
 * Skills. The judgement halves, paired with deterministic scripts.
 * ------------------------------------------------------------------ */

const skills: HarnessNode[] = [
  {
    id: "recon-skill",
    label: "Recon skill",
    title: "Skill - Recon",
    kind: "skill",
    blurb:
      "The judgement half of pre-flight. The script resolves engine, route and model plan; the skill reads the specification and detects live unknowns.",
    points: [
      "Everything that can be decided from stored knowledge is decided before any model is spent",
      "Only genuine reading is paid for",
      "Produces the criteria list that the statement is later scored against",
    ],
    links: ["recon", "recon-py", "model-allocation"],
  },
  {
    id: "supporting-statement",
    label: "Statement method",
    title: "Skill - Supporting Statement",
    kind: "skill",
    blurb:
      "The method behind the refinement loop. One shared method plus route profiles per sector family, each filling the same fixed set of slots.",
    points: [
      "Adding a sector means appending one profile, not forking the method",
      "Mining real evidence rather than asserting, and a de-AI pass described as the most important differentiator",
      "Real experience with invented detail is the line that must not be crossed",
      "It carries an explicit honest-limits section, because a method that states what it cannot do can be trusted about what it can",
    ],
    links: ["statement", "text-gates", "phase-contracts"],
  },
];

export const harnessNodes: HarnessNode[] = [
  ...stages,
  ...components,
  ...stores,
  ...principles,
  ...skills,
];

export const harnessStages = stages;

/** Node lookup, built once. */
export const nodeById = new Map(harnessNodes.map((n) => [n.id, n]));

/**
 * Pipeline order, including the branch and the human handover.
 *
 * Scout fans out to Statement and Tailored CV, which both feed Fill. That is
 * the only branch in the pipeline, and it is why the map is not a straight
 * line. Write-back loops back to Recon, which is what "run N+1 is cheaper"
 * means concretely.
 */
export const pipelineEdges: [string, string][] = [
  ["recon", "register"],
  ["register", "harvest"],
  ["harvest", "scout"],
  ["scout", "statement"],
  ["scout", "cv"],
  ["statement", "fill"],
  ["cv", "fill"],
  ["fill", "gate"],
  ["gate", "finish"],
  ["finish", "kb"],
];

/* ------------------------------------------------------------------ *
 * The guards. Transcribed from Failure Modes Ledger.md.
 * ------------------------------------------------------------------ */

export const harnessGuards: HarnessGuard[] = [
  {
    name: "click_verified",
    failure: "A click hit a wrong or stale id and silently did nothing for several tool calls.",
    behaviour: "Clicks, then proves the page changed, otherwise raises.",
    firesAt: ["fill"],
  },
  {
    name: "set_text",
    failure:
      "Generated code broke on backslashes and escapes, so the injection failed and the unchanged text was then saved over.",
    behaviour: "Passes text as a data argument, never interpolated into code, and verifies it landed.",
    firesAt: ["fill"],
  },
  {
    name: "resolve",
    failure: "A framework id existed on seven screens of one form and differed on the eighth.",
    behaviour: "Resolves exactly one element by role and accessible name. Ids are a last resort.",
    firesAt: ["fill"],
  },
  {
    name: "assert_saved",
    failure: "A saved value was never actually verified.",
    behaviour: "Checks the portal's own printout rather than the page, for strings present and strings absent.",
    firesAt: ["fill", "gate"],
  },
  {
    name: "trusted input",
    failure: "A reactive app ignored programmatic value changes, so the save shipped blanks.",
    behaviour: "Fires the events the framework actually observes, and re-resolves after every mutation.",
    firesAt: ["fill"],
  },
  {
    name: "upload_file",
    failure: "An upload needed modal-dialog state that automation could not reach.",
    behaviour: "Attaches directly to the input and confirms it is non-empty.",
    firesAt: ["cv", "fill"],
  },
  {
    name: "probe_limits",
    failure: "An undocumented word cap, discovered only by the save being rejected.",
    behaviour: "Reads the real cap off the field before filling, and reports every violation rather than the first.",
    firesAt: ["scout", "fill"],
  },
  {
    name: "ensure_session",
    failure: "A session timed out repeatedly, each time bouncing to the human.",
    behaviour: "Re-logs in and resumes in-flight, escalating only when recovery genuinely fails.",
    firesAt: ["scout"],
  },
  {
    name: "connect",
    failure: "An automation daemon hung at a fixed timeout.",
    behaviour: "Speaks the debugging protocol directly. There is no daemon to hang.",
    firesAt: ["scout"],
  },
  {
    name: "tracker row first",
    failure: "A job existed on disk but in no tracker.",
    behaviour: "Writes the tracker row before any browser work, so drift is structurally impossible.",
    firesAt: ["register"],
  },
  {
    name: "harvest reporting",
    failure:
      "A statement was drafted from advert blurb because the specification never downloaded.",
    behaviour: "Reports harvest failures rather than dropping them. A missing specification is an ERROR.",
    firesAt: ["harvest", "gate"],
  },
  {
    name: "in-session fetch",
    failure: "A document link returned an error page because it was fetched outside the session.",
    behaviour: "Fetches through the live browser session, which is what the portal's gating expects.",
    firesAt: ["harvest"],
  },
  {
    name: "frame search",
    failure: "A specification served as a frameset returned an empty body.",
    behaviour: "Searches child frames and keeps the largest text.",
    firesAt: ["harvest"],
  },
  {
    name: "style_lint",
    failure: "Machine-writing tells needed a human to re-prompt for them every draft.",
    behaviour: "Deterministic, so it catches the same class every time without being asked.",
    firesAt: ["statement"],
  },
  {
    name: "validator",
    failure: "An inflated qualification and an invented title shipped and could not be unsent.",
    behaviour: "Truth checks against the profile layer as the only source, blocking on any error.",
    firesAt: ["statement", "gate"],
  },
];

/** Guards that fire at a given stage. */
export function guardsFor(stageId: string): HarnessGuard[] {
  return harnessGuards.filter((g) => g.firesAt.includes(stageId));
}

export const harnessMeta = {
  contract:
    "A job link in. A filled application out, verified against the portal's own record, handed back at the review page for a human to submit.",
  source: "harness-system-vault, 41 notes",
  counts: {
    nodes: harnessNodes.length,
    guards: harnessGuards.length,
    stages: stages.length,
  },
};
