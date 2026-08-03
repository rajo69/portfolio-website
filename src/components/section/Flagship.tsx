import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { LiveEmbed } from "@/components/section/LiveEmbed";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Counter } from "@/components/type/Counter";
import { Eyebrow, Label, Lede } from "@/components/type";

/**
 * THE FLAGSHIP: AI Accountant.
 *
 * The live landing page is embedded by <LiveEmbed>, which carries the notes
 * on framing, the CSP allowlist and why the preview is not interactive.
 */

/** lucide-react v1 removed brand icons, so the GitHub mark is inlined. */
function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const METRICS = [
  { value: "94%", caption: "Categorisation accuracy" },
  { value: "<2s", caption: "Per transaction" },
  { value: "3+ hrs", caption: "Saved per week" },
];

const LIVE_URL = "https://agentic-ai-accounting.vercel.app";
const REPO_URL = "https://github.com/rajo69/agentic-ai-accounting";

export function Flagship() {
  return (
    <Section id="flagship">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Flagship</Eyebrow>
        <SplitHeading size="h1" className="max-w-[16ch]">
          Accounting, automated.
        </SplitHeading>
        <Lede className="max-w-[58ch]">
          A production AI assistant for UK accountants. Connect Xero, and it
          categorises transactions, reconciles bank statements and drafts
          management letters. Every decision carries its own explanation, so the
          accountant who signs the accounts can check the reasoning before
          accepting it.
        </Lede>
      </Reveal>

      {/* --- The product itself, live --- */}
      <Reveal className="mt-14">
        <LiveEmbed />
      </Reveal>

      {/* --- Numbers, straight off the product --- */}
      <Reveal
        variant="stagger"
        as="ul"
        className="mt-12 grid gap-8 sm:grid-cols-3"
      >
        {METRICS.map((m) => (
          <li key={m.caption}>
            <Counter
              value={m.value}
              className="block font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums"
            />
            <Label className="mt-2 block">{m.caption}</Label>
          </li>
        ))}
      </Reveal>

      {/* --- How it works, briefly --- */}
      <Reveal variant="stagger" className="mt-16 grid gap-10 md:grid-cols-3">
        {[
          {
            step: "01",
            title: "Categorise",
            body: "A LangGraph agent classifies each transaction against the chart of accounts, using few-shot examples drawn from the firm's own history. Confident results apply automatically, uncertain ones go to review.",
          },
          {
            step: "02",
            title: "Reconcile",
            body: "Bank lines are matched to transactions by scoring amount, date and description. The matching path is deterministic with no model in it, so the same inputs always give the same answer.",
          },
          {
            step: "03",
            title: "Explain",
            body: "Every decision stores feature importances, a fuzzy logic risk score and the model's own reasoning in an immutable audit log the accountant can inspect and correct.",
          },
        ].map((s) => (
          <div key={s.step}>
            <Label className="text-accent">{s.step}</Label>
            <h3 className="t-display mt-3 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-dim">{s.body}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-12 flex flex-wrap items-center gap-4">
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity duration-200 hover:opacity-90"
        >
          Open the live app
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink-500 px-5 py-2.5 text-sm text-paper-dim transition-colors duration-200 hover:border-accent hover:text-paper"
        >
          <GithubMark />
          Read the source
        </a>
      </Reveal>
    </Section>
  );
}
