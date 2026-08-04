import { Section } from "@/components/layout/Section";
import { LiveEmbed } from "@/components/section/LiveEmbed";
import { Block, Points, Fixes } from "@/components/section/FlagshipParts";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { Clusters3D } from "@/components/projects/Clusters3D";
import { ForecastScorecard } from "@/components/projects/ForecastScorecard";
import { GatedAttentionExplorer } from "@/components/projects/GatedAttentionExplorer";
import { ModelCard } from "@/components/projects/ModelCard";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { models, scoreSummary } from "@/content/data/forecast";

/**
 * FLAGSHIP PROJECTS.
 *
 * Every block is the same shape, and it is deliberately shallow:
 *
 *   one-sentence lede -> something you can play with -> three numbers
 *   -> bullets, never paragraphs -> where it broke -> links out
 *
 * The depth lives in the READMEs, which are linked from every block. Anyone
 * who wants prose has somewhere better to read it. This page exists to get
 * the key facts across in the time someone actually spends here.
 */
export function Flagship() {
  return (
    <Section id="flagship" bloom marker="Flagship projects" markerSteps="#flagship article">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Flagship projects</Eyebrow>
        <SplitHeading size="h1" className="max-w-[17ch]">
          What I built, and where it broke.
        </SplitHeading>
        <Lede className="max-w-[58ch]">
          Five things you can open and poke at: a running product, a clustering
          study in 3D, a published model, a forecast scored against what
          actually happened, and an interpretability experiment you can run
          yourself.
        </Lede>
      </Reveal>

      <div className="mt-20 space-y-28">
        {/* ── 01 · AI ACCOUNTING ─────────────────────────────────────────── */}
        <Block
          index="01"
          capabilities={["AI & agents", "Data & pipelines"]}
          period="2026"
          title="AI Accountant"
          lede="Categorises transactions, reconciles bank lines and drafts management letters off a Xero connection, and shows its working on every one, because an accountant signs the accounts."
          artifact={
            /* The running app first, then how it is wired. Hiring-manager
               research named the missing architecture diagram explicitly. */
            <div className="space-y-6">
              <LiveEmbed />
              <ArchitectureDiagram />
            </div>
          }
          stats={[
            { value: "94%", caption: "Categorisation accuracy" },
            { value: "<2s", caption: "Per transaction" },
            { value: "3+ hrs", caption: "Saved per week" },
          ]}
          links={[
            { label: "Open the live app", href: "https://agentic-ai-accounting.vercel.app", primary: true },
            { label: "Read the source", href: "https://github.com/rajo69/agentic-ai-accounting", icon: "gh" },
          ]}
        >
          <Points
            title="Architecture decisions"
            items={[
              "LangGraph agent, few-shot from the firm's own history via pgvector cosine similarity",
              "Routing by confidence: above 0.85 auto-posts, 0.50 to 0.85 queues for review, below 0.50 shows no guess at all",
              "Reconciliation has no model in the matching path, so identical inputs always give identical answers",
              "Document figures computed in Python, model used only for narrative, so numbers cannot be hallucinated",
              "Every decision writes EBM feature importances, a fuzzy risk score and its reasoning to an immutable audit log",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "Moving to Claude mid-build broke embeddings. Anthropic has no embeddings endpoint.",
                fix: "Split the concerns: all-MiniLM-L6-v2 in-process at zero API cost, pgvector migrated 1536 to 384 dimensions.",
              },
              {
                problem: "One model was wrong both ways. Haiku hit 88% overall but 75% on hard cases; Sonnet everywhere cost 3.75x for nothing on easy ones.",
                fix: "Tiered routing. Haiku first, Sonnet only below the 0.85 threshold, Haiku's answer kept if Sonnet errors.",
              },
            ]}
          />
        </Block>

        {/* ── 02 · CLUSTERING STABILITY ──────────────────────────────────── */}
        <Block
          index="02"
          capabilities={["Data & pipelines", "Research"]}
          period="2026"
          title="When Can Clustering Be Trusted?"
          lede="Clustering output tells you nothing about whether the grouping is real. Rotate the projection and switch the scaler to watch the same data fall apart."
          artifact={<Clusters3D />}
          stats={[
            { value: "0.526", caption: "ARI swing from the scaler alone" },
            { value: "53 → 6", caption: "Wines misassigned, raw vs scaled" },
            { value: "3 / 3", caption: "Datasets where silhouette picks worst" },
          ]}
          links={[
            { label: "Read the analysis", href: "https://github.com/rajo69/Clustering-Stability-Analysis", primary: true, icon: "gh" },
          ]}
        >
          <Points
            title="What I found"
            items={[
              "Changing only the scaler moves Wine ARI from 0.371 to 0.897",
              "Silhouette is the only metric available without labels, and on all three datasets it peaks on the worst pipeline",
              "Bootstrap stability stays above 0.95 while accuracy swings wildly, so stability is not correctness",
              "Five experiments: bootstrap, preprocessing, dimensionality reduction, choice of k, choice of algorithm",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "A high stability score reads as a clean result, and it is not one.",
                fix: "Reported stability and accuracy side by side so the gap between them is the finding rather than a footnote.",
              },
              {
                problem: "Only two datasets have independent labels, and the PBMC ground truth is circular.",
                fix: "Nine-item limitations section at the top of the README, plus a note on what would make this proper research.",
              },
            ]}
          />
        </Block>

        {/* ── 03 · BANKING77 FINE-TUNE ───────────────────────────────────── */}
        <Block
          index="03"
          capabilities={["AI & agents", "Research"]}
          period="2026"
          title="Banking77 Llama-1B LoRA"
          lede="A 1B model that could not do the task at all, taken to 90% on 77-class intent classification for about fifty minutes of one GPU."
          artifact={<ModelCard />}
          stats={[
            { value: "0% → 90.21%", caption: "Exact match, zero-shot to tuned" },
            { value: "77", caption: "Classes, 3,076 test samples" },
            { value: "~50 min", caption: "One T4, three epochs" },
          ]}
          links={[
            { label: "Open on Hugging Face", href: "https://huggingface.co/rajo0113/banking77-llama-1b-lora", primary: true },
            {
              label: "Training code",
              href: "https://github.com/rajo69/Fine-Tuning-Llama-3.2-1B-Instruct-on-Banking77-Intent-Classification",
              icon: "gh",
            },
          ]}
        >
          <Points
            title="How it was trained"
            items={[
              "QLoRA on Llama-3.2-1B-Instruct, 4-bit, so it fits a free T4",
              "rsLoRA for stable scaling at higher rank, NEFTune noise on embeddings for generalisation",
              "Unsloth and TRL for the training loop",
              "Evaluated on the full test split, 3,076 samples across 77 classes, not a subsample",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "Free generation can emit a label that does not exist, and a plausible invalid class is worse than an error.",
                fix: "Token-level prefix trie over all 77 valid names, making an invalid label impossible to generate. Fixed 2 samples, broke 0.",
              },
              {
                problem: "The base model scored 0.00%, which usually means a broken harness rather than a real result.",
                fix: "Checked it was genuine: the model answers fluently, it just never emits an exact label string. The gap is formatting, and that is what the fine-tune buys.",
              },
            ]}
          />
        </Block>

        {/* ── 04 · FORECASTING, SCORED ───────────────────────────────────── */}
        <Block
          index="04"
          capabilities={["Data & pipelines", "Research"]}
          period="2024, scored 2026"
          title="The Forecast I Got Wrong"
          lede="I published a forecast for US consumption in 2024. Two years of data have arrived since, so here it is scored against what actually happened, month by month, including the part that was not the model's fault."
          artifact={<ForecastScorecard />}
          stats={[
            {
              value: `${scoreSummary.outside95} / ${scoreSummary.horizons}`,
              caption: "Months outside its own 95% band",
            },
            {
              value: `${scoreSummary.revisionShare.toFixed(0)}%`,
              caption: "Of the gap is post-fit data revision",
            },
            {
              value: `${models[1].rolling.mape.toFixed(2)}%`,
              caption: "Same model, one month ahead",
            },
          ]}
          links={[
            { label: "Read the full analysis", href: "https://rpubs.com/rajo2024/1249519", primary: true },
            { label: "Check it against FRED", href: "https://fred.stlouisfed.org/series/PCE" },
          ]}
        >
          <Points
            title="What the scoring shows"
            items={[
              "The outturn sits above the 95% upper bound in 10 of the 11 forecast months, so the intervals were miscalibrated, not merely the point forecast low",
              "Error grows with horizon, 1.87% at one month to 3.26% at eleven, and every miss runs the same direction, which rules out noise",
              "320.0 of the final 659.08 gap is the forecast origin itself being revised upward by BEA after the model was fitted",
              "Holt still beat Drift and ARIMA on both horizons, so model selection was sound and the horizon was the problem",
              "Method held up: 779 monthly readings from 1959, Stineman interpolation over 43 gaps, multiplicative decomposition, 80:20 split",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "The original analysis ends on a point forecast and never returns to it. That number is checkable, and it is now wrong.",
                fix: "Scored the whole path against FRED and published the decomposition, so a reader who checks the series finds the page already agrees with them.",
              },
              {
                problem: "A one step ahead MAPE of 0.50% reads like proof the model forecasts well. It is not.",
                fix: "Both horizons on one shared scale. Same model, same parameters, 5.75 times the RMSE once the horizon stretches to the full window.",
              },
              {
                problem: "1,760 positive reviews against 240 negative, and LDA still fitted 11 topics to the smaller set.",
                fix: "Roughly 22 documents per negative topic. Stated on the block rather than left for a reader to work out.",
              },
            ]}
          />
        </Block>

        {/* ── 05 · GATED ATTENTION ───────────────────────────────────────── */}
        <Block
          index="05"
          capabilities={["Research", "AI & agents"]}
          period="2026"
          title="What the Gates Actually Do"
          lede="A NeurIPS 2025 paper adds a gate after attention and shows it helps. It does not say what the trained gates do. Open a layer, swap the gates for a constant, or watch my own hypothesis fail."
          artifact={<GatedAttentionExplorer />}
          stats={[
            { value: "99.8%", caption: "Of ablation damage from layer 0" },
            { value: "48.3%", caption: "Gate dimensions stably suppressed" },
            { value: "25,600", caption: "Tokens, bootstrapped CIs" },
          ]}
          links={[
            {
              label: "Read the analysis",
              href: "https://github.com/rajo69/Gate-Sparsity-and-Functional-Sensitivity-in-Gated-Attention-An-Empirical-Analysis",
              primary: true,
              icon: "gh",
            },
            { label: "The original paper", href: "https://arxiv.org/abs/2505.06708" },
          ]}
        >
          <Points
            title="How it was measured"
            items={[
              "PyTorch forward hooks on every layer's gate tensor",
              "Welford aggregation, so statistics stay stable without holding every activation",
              "Layer ablation, gate value sweep, per-head sensitivity, repeated on a code corpus",
              "Bootstrapped CIs, permutation testing, split-half reproduction",
              "Whole study runs on a free Colab T4 in about three hours",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "Layer 0 carrying 99.8% of the damage looked like an indexing bug, not a finding.",
                fix: "Added the checks that would expose one: bootstrapped CIs, split-half, a second corpus. It survived all three, and that is where the confidence column came from.",
              },
              {
                problem: "My hypothesis was that opening layer 0's gate restores the attention sink. It does not.",
                fix: "Published as a null result graded moderate rather than dropped. The mechanism is still unexplained.",
              },
            ]}
          />
        </Block>
      </div>

      {/*
        QUEUED, AFTER GATED ATTENTION.

        Block 06 is the dissertation. Block 07 is meant to be a large scale UK
        public data project, either HM Land Registry Price Paid (roughly 30M
        transactions since 1995) or the NHS English Prescribing Dataset
        (hundreds of millions of rows a year). Reason it matters: every
        flagship here is a research spike, so the T's crossbar of SQL, ETL and
        statistics is claimed in the Stack section and demonstrated nowhere.
        Volume is the point, because it is what forces the engineering to
        become visible. See HANDOFF.md section 6.
      */}
      <Reveal className="mt-24 border-t border-line pt-10">
        <Label as="p">Next: the ResNet-18 dissertation</Label>
        <Label as="p" className="mt-2 text-paper-faint">
          Then a UK public data set at scale, Land Registry or NHS prescribing
        </Label>
      </Reveal>
    </Section>
  );
}
