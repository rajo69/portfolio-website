import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Section } from "@/components/layout/Section";
import { LiveEmbed } from "@/components/section/LiveEmbed";
import { ClusteringExplorer } from "@/components/projects/ClusteringExplorer";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";

/**
 * FLAGSHIP PROJECTS.
 *
 * One block per project, and only one. AI Accounting previously appeared both
 * in its own section and again as a Lab card, which read as padding. Merged.
 *
 * Every block follows the same skeleton, which is what case-study guidance
 * converges on and what a reviewer can scan in seconds:
 *
 *   live artifact -> what and why -> one architecture decision
 *   -> where it broke and what I did -> the measured result
 *
 * The "where it broke" half is the part most portfolios omit, and the part
 * that gives a screening call something to talk about, so it is not optional.
 *
 * Order is deliberate: accounting and clustering lead because between them
 * they cover AI and data, which is the argument the whole site makes.
 */

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function Challenge({ problem, fix }: { problem: string; fix: string }) {
  return (
    <div className="border-l-2 border-ink-500 pl-5">
      <p className="text-sm leading-relaxed text-paper">{problem}</p>
      <p className="mt-2 text-sm leading-relaxed text-paper-dim">{fix}</p>
    </div>
  );
}

function Block({
  index,
  capabilities,
  period,
  title,
  lede,
  children,
  artifact,
  links,
}: {
  index: string;
  capabilities: string[];
  period: string;
  title: string;
  lede: string;
  children: ReactNode;
  artifact: ReactNode;
  links: { label: string; href: string; primary?: boolean; icon?: "gh" }[];
}) {
  return (
    <article className="border-t border-ink-600 pt-14">
      <Reveal variant="stagger">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-accent">{index}</Label>
          {capabilities.map((c) => (
            <span
              key={c}
              className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent"
            >
              {c}
            </span>
          ))}
          <Label className="ml-1">{period}</Label>
        </div>

        <h3 className="t-display mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">{title}</h3>
        <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-paper-dim">
          {lede}
        </p>
      </Reveal>

      <Reveal className="mt-10">{artifact}</Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">{children}</div>

      <Reveal className="mt-10 flex flex-wrap gap-4">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={
              l.primary
                ? "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
                : "inline-flex items-center gap-2 rounded-full border border-ink-500 px-5 py-2.5 text-sm text-paper-dim transition-colors hover:border-accent hover:text-paper"
            }
          >
            {l.icon === "gh" ? <GithubMark /> : null}
            {l.label}
            {l.icon !== "gh" && <ArrowUpRight className="size-4" aria-hidden="true" />}
          </a>
        ))}
      </Reveal>
    </article>
  );
}

export function Flagship() {
  return (
    <Section id="flagship">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Flagship projects</Eyebrow>
        <SplitHeading size="h1" className="max-w-[17ch]">
          What I built, and where it broke.
        </SplitHeading>
        <Lede className="max-w-[58ch]">
          Each of these has something you can open: a running product, the data
          behind a study, a published model. Under each one is the decision that
          shaped it and the problem that nearly stopped it.
        </Lede>
      </Reveal>

      <div className="mt-20 space-y-28">
        {/* ── 01 · AI ACCOUNTING ─────────────────────────────────────────── */}
        <Block
          index="01"
          capabilities={["AI & agents", "Data & pipelines"]}
          period="2026"
          title="AI Accountant"
          lede="UK accounting firms lose hours every week to three mechanical jobs: coding transactions to the chart of accounts, matching bank lines, and writing quarterly commentary. This does all three off a Xero connection, and shows its working on each, because an accountant carries professional liability for accounts they sign."
          artifact={<LiveEmbed />}
          links={[
            {
              label: "Open the live app",
              href: "https://agentic-ai-accounting.vercel.app",
              primary: true,
            },
            {
              label: "Read the source",
              href: "https://github.com/rajo69/agentic-ai-accounting",
              icon: "gh",
            },
          ]}
        >
          <Reveal variant="stagger" className="space-y-6">
            <Label as="h4">How it works</Label>
            <p className="text-sm leading-relaxed text-paper-dim">
              Next.js on Vercel, FastAPI on Railway, Postgres 16 with pgvector and
              Redis. A LangGraph{" "}
              <code className="font-mono text-accent">CategoriserAgent</code> pulls
              the five nearest already-categorised transactions by cosine similarity
              and hands Claude those as few-shot context. Confidence above 0.85
              writes straight to the ledger, 0.50 to 0.85 goes to a review queue,
              below 0.50 is flagged with no guess shown at all.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              Reconciliation deliberately has no model in the matching path. It
              scores amount, date and description, so identical inputs always give
              an identical answer. Document generation computes every figure in
              Python and uses the model only for narrative, which means the numbers
              in a management letter cannot be hallucinated.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              Every decision writes feature importances from an InterpretML EBM, a
              Mamdani fuzzy risk score and the model&apos;s own reasoning into an
              immutable audit log.
            </p>
          </Reveal>

          <Reveal variant="stagger" className="space-y-6">
            <Label as="h4">Where it broke</Label>
            <Challenge
              problem="Switching the LLM to Claude mid-build broke embeddings, because Anthropic has no embeddings endpoint and the design had assumed one."
              fix="Decoupled the two concerns. Embeddings moved to all-MiniLM-L6-v2 running in-process at zero API cost, the pgvector column migrated from 1536 to 384 dimensions with Alembic, and asyncio.to_thread keeps the CPU-bound work off the event loop. The model and the embedder can now be swapped independently."
            />
            <Challenge
              problem="One model for every transaction was wrong in both directions. Haiku scored 88% overall but only 75% on the hard tier, while moving everything to Sonnet cost roughly 3.75 times more per call for almost nothing on the easy tier, where Haiku already reached 93.5%."
              fix="Tiered routing. Haiku runs first, and Sonnet is invoked only when confidence falls below the same 0.85 threshold that governs auto-accept. If Sonnet errors, Haiku's original prediction stands, so no transaction is left without one. The audit log records which model answered and whether escalation fired."
            />
          </Reveal>
        </Block>

        {/* ── 02 · CLUSTERING STABILITY ──────────────────────────────────── */}
        <Block
          index="02"
          capabilities={["Data & pipelines", "Research"]}
          period="2026"
          title="When Can Clustering Be Trusted?"
          lede="Unsupervised clustering gets used to make decisions, but nothing in its output tells you whether the grouping is real. I ran the same pipelines across three datasets under perturbation to find which choices actually move the answer, and whether the metric people use to pick a pipeline is any good."
          artifact={<ClusteringExplorer />}
          links={[
            {
              label: "Read the analysis",
              href: "https://github.com/rajo69/Clustering-Stability-Analysis",
              primary: true,
              icon: "gh",
            },
          ]}
        >
          <Reveal variant="stagger" className="space-y-6">
            <Label as="h4">What I found</Label>
            <p className="text-sm leading-relaxed text-paper-dim">
              Five experiments across a clinical dataset, a chemical one and 2,700
              single cells of RNA sequencing: bootstrap stability, preprocessing
              sensitivity, dimensionality reduction, choice of k, and choice of
              algorithm.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              Preprocessing is the result that matters. On Wine, changing nothing
              but the scaler moves ARI from 0.371 to 0.897, a swing of 0.526 from a
              decision most write-ups do not even record.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              Worse, silhouette is the metric you can compute without labels, so it
              is the one anyone actually uses to choose a pipeline. On all three
              datasets it peaks on the pipeline with the lowest true accuracy.
              Following it would have picked the worst option every time.
            </p>
          </Reveal>

          <Reveal variant="stagger" className="space-y-6">
            <Label as="h4">What it does not show</Label>
            <p className="text-sm leading-relaxed text-paper-dim">
              The repository carries a nine-item limitations section, because the
              result is easy to over-read.
            </p>
            <Challenge
              problem="Bootstrap stability stays high, 0.95 and above, even where accuracy swings wildly with preprocessing."
              fix="That is the point rather than a contradiction. Stability measures whether an algorithm returns the same answer on resampled data, not whether the answer is right. Reporting one as though it were the other is the mistake the study exists to make visible."
            />
            <Challenge
              problem="Only two datasets have genuinely independent labels, and the PBMC ground truth is circular, since it was itself derived from clustering."
              fix="Stated at the top of the README rather than buried, next to a section on what would make this proper research. The conclusion is scoped to what three datasets can support and no further."
            />
          </Reveal>
        </Block>
      </div>

      <Reveal className="mt-24 border-t border-ink-600 pt-10">
        <Label>
          Next: the Banking77 fine-tune, the ResNet-18 dissertation, and gated
          attention
        </Label>
      </Reveal>
    </Section>
  );
}
