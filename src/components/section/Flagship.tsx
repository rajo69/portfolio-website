import { Section } from "@/components/layout/Section";
import { LiveEmbed } from "@/components/section/LiveEmbed";
import { Block, Points, Fixes } from "@/components/section/FlagshipParts";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { Clusters3D } from "@/components/projects/Clusters3D";
import { ForecastScorecard } from "@/components/projects/ForecastScorecard";
import { GatedAttentionExplorer } from "@/components/projects/GatedAttentionExplorer";
import { HarnessMap } from "@/components/projects/HarnessMap";
import { ModelCard } from "@/components/projects/ModelCard";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Lede } from "@/components/type";
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
          Six things you can open: a running product, a clustering study in 3D,
          a published model, a forecast I went back and scored, an autonomous
          agent mapped out stage by stage, and an interpretability experiment
          you can run yourself.
        </Lede>
      </Reveal>

      <div className="mt-20 space-y-28">
        {/* ── 01 · AI ACCOUNTING ─────────────────────────────────────────── */}
        <Block
          index="01"
          capabilities={["AI & agents", "Data & pipelines"]}
          period="2026"
          title="AI Accountant"
          lede="Three paths off a Xero connection: categorise, reconcile, report. A model decides in exactly one of them. Reconciliation has none in the matching path at all, because the same bank statement has to produce the same answer every time it is run."
          artifact={
            /* The running app first, then how it is wired. Hiring-manager
               research named the missing architecture diagram explicitly. */
            <div className="space-y-6">
              <LiveEmbed />
              <ArchitectureDiagram />
            </div>
          }
          /*
            ALL THREE OF THESE WERE UNSOURCED UNTIL 4 August 2026, not just the
            first one. `94%`, `<2s` and `3+ hrs` appear nowhere in the repo:
            grepped it end to end. The README's only latency-adjacent figure is
            a cost acceptance threshold, and its only mention of hours saved is
            the general sentence "AI can save hours", which is a claim about the
            category, not a measurement of this system.

            These three are all in backend/evals/README.md, from the same run:
            88.0% (44/50) overall, and the confidence calibration table giving
            95.0% above the 0.85 auto-accept threshold and 33.3% below 0.5.

            The third one is deliberately the unflattering one. A model that is
            right a third of the time in the band where it declines to answer is
            a model whose confidence means something, and that is the entire
            argument of this block. Sourcing beats flattery, see rule 5.
          */
          stats={[
            { value: "88%", caption: "Overall, 44 of 50 fixtures" },
            { value: "95%", caption: "In the auto-accept band" },
            { value: "33%", caption: "Below 0.5, where it defers" },
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
                problem: "One model was wrong both ways. Haiku hit 88% overall but 75% on hard cases; Sonnet everywhere cost far more for nothing on easy ones.",
                fix: "Tiered routing. Haiku first, Sonnet only below the 0.85 threshold, Haiku's answer kept if Sonnet errors.",
              },
              {
                problem: "The 88% is Haiku alone. Tiered routing is what production actually runs, and it has never been measured against the same fixtures.",
                fix: "Nothing yet. The README carries it as a known limitation with the comparison table left pending rather than filled in with a guess, and the number above stays the one that was measured.",
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
                fix: "Reported stability and accuracy side by side, so the gap between them is the first thing you see.",
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
            /* Was "0% → 90.21%". The 0% is a formatting artefact, not an
               absence of capability, and the block says so four lines below.
               Leading with the arrow traded on the reading the block then
               debunks, which two cold reviewers caught. */
            { value: "90.21%", caption: "Exact match, 77 classes" },
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
                problem: "The base model scored 0.00%, which usually means a broken harness.",
                fix: "Checked it was genuine. The model answers fluently, it just never emits an exact label string, so the whole gap is formatting.",
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
              "The outturn sits above the 95% upper bound in 10 of the 11 forecast months, which is an interval problem before it is a point-forecast problem",
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
                fix: "Roughly 22 documents per negative topic. The block says so where the topics are shown.",
              },
            ]}
          />
        </Block>

        {/* ── 05 · THE APPLICATION HARNESS ───────────────────────────────── */}
        <Block
          index="05"
          capabilities={["AI & agents", "Data & pipelines"]}
          period="2026"
          title="The Application Harness"
          lede="An agent that takes a job link, fills the whole application, proves every save against the portal's own record, and stops at the review page. It never submits. The final click is a human's."
          artifact={<HarnessMap />}
          stats={[
            { value: "15", caption: "Guards, each a live failure first" },
            { value: "22", caption: "Portal implementations handled" },
            { value: "0", caption: "Applications it submits itself" },
          ]}
          links={[
            {
              label: "Read the source",
              href: "https://github.com/rajo69/job-apply-harness",
              primary: true,
              icon: "gh",
            },
          ]}
        >
          <Points
            title="The design"
            items={[
              "Failures are sorted by how they announce themselves. A loud one raises immediately and is cheap; a silent one is never found and the cost repeats forever",
              "Invariants live in code, not in prose. Where a runbook and a script disagree, the script wins, so the runbook shrinks over time instead of growing",
              "A save is only real when the server agrees, so verification opens the portal's own printout rather than re-reading the field it just wrote",
              "Autonomy is defined by exclusion: three things may interrupt a human, and submitting is not one of them because the machine never does it",
              "The strongest model goes where a mistake is silent and expensive, the cheap one where a guard will catch it immediately",
            ]}
          />
          <Fixes
            items={[
              {
                problem:
                  "A reactive portal ignored programmatic value changes, so the page looked filled and the save shipped blanks.",
                fix: "Trusted input events only, re-resolving after every mutation, then verified against the portal's own record rather than the DOM.",
              },
              {
                problem:
                  "An inflated qualification and an invented job title were submitted, and an application cannot be unsent.",
                fix: "A deterministic validator that reads the exact text about to be submitted and blocks on any claim contradicting the profile layer. Polished CV wording is explicitly not trusted as a truth source.",
              },
            ]}
          />
        </Block>

        {/* ── 06 · GATED ATTENTION ───────────────────────────────────────── */}
        <Block
          index="06"
          capabilities={["Research", "AI & agents"]}
          period="2026"
          title="What the Gates Actually Do"
          lede="A NeurIPS 2025 paper adds a gate after attention and shows it helps. It does not say what the trained gates do. Open a layer, swap the gates for a constant, or watch my own hypothesis fail."
          artifact={<GatedAttentionExplorer />}
          stats={[
            { value: "99.8%", caption: "Of ablation damage from layer 0" },
            { value: "48.3%", caption: "Gate dimensions stably suppressed" },
            /* The control, promoted out of the interactive figure. A reviewer
               reading this cold called it the only number here that is a
               finding rather than a measurement: it separates a claim about
               gating from a claim about first layers in general. It was
               previously visible only after clicking "Ablate". */
            { value: "100% → 79.6%", caption: "Layer 0 share, ungated vs gated" },
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
              "An ungated model as the control, which is what separates a claim about gating from a claim about first layers: it puts 100% of its sensitivity in layer 0 against the gated model's 79.6%, so gating reduces the concentration rather than causing it",
              "Bootstrapped CIs, permutation testing, split-half reproduction",
              "Whole study runs on a free Colab T4 in about three hours",
            ]}
          />
          <Fixes
            items={[
              {
                problem: "Layer 0 carrying 99.8% of the damage looked like an indexing bug, not a finding.",
                fix: "Added the checks that would expose one: bootstrapped CIs, split-half, a second corpus. It survived all three.",
              },
              {
                problem: "My hypothesis was that opening layer 0's gate restores the attention sink. It does not.",
                fix: "Published as a null result, graded moderate. The mechanism is still unexplained.",
              },
            ]}
          />
        </Block>

      </div>

      {/*
        A "Next: a UK public data set at scale" line used to render here,
        promising block 07. Rajarshi removed it: the page should not advertise
        work that does not exist yet. The block itself is still queued in
        HANDOFF.md §6, and if it ships it goes inside the list above rather
        than as a trailer under it.
      */}
    </Section>
  );
}
