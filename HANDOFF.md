# Handoff

**Read this first in a new session.** It is the single source of truth for where this project is. `AGENTS.md` carries the hard rules, `DESIGN.md` the visual system. `PLAN.md` and `CONTENT-BRIEF.md` are older and partly stale; trust this file where they disagree.

Last updated: 4 August 2026. Working tree is ahead of commit `c6d07b4`: scroll and
nav fixes, flagship block 04, and the rebuilt block 05 explorer are uncommitted.

---

## 1. The end goal

A personal portfolio site for **Rajarshi Nandi**, AI engineer in Sheffield, UK. It exists to get him hired or hired-for-work, fast.

Three audiences, in priority order:

1. **Hiring managers** for AI/ML engineering roles. Scan in under 90 seconds.
2. **Professors / PhD supervisors.** Care about research fit and demonstrated capability.
3. **SMB clients** wanting data insight or AI integration.

The design inspiration is <https://jeffbrokaw.com>: near-black, one hot accent, heavy grotesque display type, animated canvas background, per-section rhythm. **The structure is the inspiration, not the content.** Copying its orange would make it a clone.

### The positioning

> **"I build AI people trust enough to use."**

The thesis, which is genuinely evidenced across his CV: *a model that cannot show its working does not get adopted, however accurate it is.* It runs from IBM in 2021 (a churn model the business ignored until he made the features legible) to 2026 (an accounting agent designed entirely around showing its working to someone with professional liability).

The site is balanced as a **T**: broad foundations (SQL, ETL, Python, statistics) as the crossbar, with four specialism spikes (AI & agents, data & pipelines, research, vision). The unifying argument is his own and it is correct: *the pipeline that cleans and structures data is the same pipeline whether it ends in a dashboard or an LLM's context window.*

---

## 2. Current state

**Working, committed, builds clean.** Next.js 16 App Router, TypeScript, Tailwind v4, GSAP, Lenis, MDX.

### Page order (`src/app/page.tsx`)

| Section | Component | State |
|---|---|---|
| Hero | `Hero.tsx` | Done. Logit-lens decode, parallax, 3 stat counters |
| Spine | `Spine.tsx` | Done. Pipeline / Model / Trust, animated triangle |
| Flagship projects | `Flagship.tsx` | **5 of 6 blocks done.** Dissertation block outstanding |
| Experience | `Experience.tsx` | Done. IBM, ADHDNET, William Hill, education on one rail |
| Work | `Work.tsx` | Done. 13 rows, filterable by capability |
| Method | `Method.tsx` | Done. Principle + "every guard is a scar" |
| About | `About.tsx` | Done. Portrait + three paragraphs |
| Stack | `Stack.tsx` | Done. Rendered as a literal T |
| Certifications | `Certifications.tsx` | Done. 4 surfaced, 13 total, all links verified 200 |

Plus `/blog` (MDX) and `/blog/[slug]`, with one **draft** post.

### The five flagship blocks

Each follows one skeleton: **one-sentence lede → interactive artifact → three big numbers → bullets → where it broke → links.**

1. **AI Accountant**: live `<iframe>` of the real app. `94% · <2s · 3+ hrs`
2. **Clustering Stability**: 3D draggable PCA projection. `0.526 · 53→6 · 3/3`
3. **Banking77 LoRA**: native HF model card. `0%→90.21% · 77 · ~50 min`
4. **The Forecast I Got Wrong**: three-view scorecard. `10/11 · 49% · 0.50%`
5. **Gated Attention**: three-instrument explorer. `99.8% · 48.3% · 25,600`

**Block 04 is the 2024 RPubs coursework, reframed.** He chose to ship it knowing
the Oct 2024 point forecast is now falsified, so the block scores it instead of
publishing it bare. Data is in `src/content/data/forecast.ts`: his forecast table
verbatim from RPubs, joined to FRED series `PCE`. The outturn lands outside the
95% band in **10 of 11 months**, and **320.0 of the final 659.08 gap is BEA
revising the forecast origin after the model was fitted**, which the block says
out loud rather than charging the whole miss to the model. Every summary figure
is computed from the two arrays at module load, so none can drift.

**Block 05's explorer was rebuilt.** It was one boolean driving a diagram. It is
now three instruments over real measurements in `src/content/data/gates.ts`:
layer ablation, the fixed-gate sweep, and the attention-sink null result.
Layers 5 to 27 render as a band because the README reports a range, not per
layer values. Do not fill those in.

---

## 3. What worked

- **Reading the repos properly.** Almost every good line on the site came out of Rajarshi's own READMEs, not from invention. The "every guard is a scar" table, the confidence-graded findings, the tiered-routing story.
- **Verifying with Playwright, not screenshots.** Repeatedly caught things that looked fine.
- **Computing colour instead of eyeballing it.** The `dataviz` skill's validator caught a chart palette where a red-green colourblind reader could not separate two series (deutan ΔE 5.5).
- **Regenerating data with an assertion.** The 3D cluster generator refuses to write its file unless every ARI reproduces `results_summary.csv`. All 8 match, so the visual is genuinely his result.
- **The accent budget.** One accent element per screenful. Fixed the "AI slop" feel more than anything else.
- **Bullets over paragraphs.** His instruction, and correct: prose belongs in the README.

## 4. What did not work

Do not repeat these.

| Attempt | Outcome |
|---|---|
| GitHub proof strip (stars, forks, heatmap) | **Cut.** Personal research repos have no stars; a strip of zeroes underlines the absence. Repo count is the same vanity signal. |
| "Nothing here is a claim" Evidence section | **Cut.** Argued with a reader who had not objected. Read as insecure. |
| Iframing `huggingface.co` | **Impossible.** Returns `X-Frame-Options: DENY`, not ours to change. A Gradio Space would work (`*.hf.space` is frameable). |
| Netron for the dissertation | **Rejected.** Needs an exported model file; the repo is MATLAB scripts. Also looks like someone else's tool. |
| Flourish for charts | **Rejected.** Free tier stamps "Made with Flourish", third-party iframe, cannot read his repo data. |
| Tuning the canvas by eye | **Failed 3 rounds.** It was invisible: 1.22% of pixels lit, mean alpha 6.6/255. Only `getImageData` sampling caught it. |
| `"//"` comment keys in `vercel.json` | **Broke his production build.** Vercel validates strictly. |
| Em dashes | **Banned.** 159 purged. His CV pipeline enforces the same rule. |

### Bugs that cost real time

- **Un-layered CSS beats Tailwind utilities.** `t-display` outside `@layer components` silently killed `text-accent` and every `group-hover:` colour on those elements. Now inside the layer, and it is in the pre-delivery checklist.
- **Tailwind v4 `scale-x-0`** emits the standalone `scale` property, which *composes with* rather than being overridden by an inline `transform`. Pinned the scroll-progress bar to zero width.
- **Canvas colour strings.** `rgb(255, 61, 139 / 0.5)` mixes legacy commas with slash-alpha and is invalid. Canvas silently keeps the previous style, so it renders black on black rather than erroring.
- **`prefers-reduced-motion` read one render too late.** `gsap.from` had already written `opacity: 0`, leaving the hero permanently invisible for exactly the users who asked for less motion. Now read synchronously.
- **Turbopack cannot serialise imported MDX plugin functions.** Name them as strings or the dev server dies.
- **Chrome-extension screenshots are not ground truth.** Several "the page is frozen" and "the element is invisible" alarms were artifacts of the tooling, not real. Playwright over CDP disagreed every time.

- **`h-full` on `<html>` froze Lenis's scroll limit.** Lenis watches `document.documentElement` with a ResizeObserver, and a height of 100% means that box never changes size, so the observer never fires. On a fresh load it measured once and was correct; on a client-side nav it kept the *previous* route's limit. A blog post stranded at 19% of its length. Fixed by taking the height off `<html>` and `<body>` (sticky footer now comes from `min-h-screen` on the flex column) and calling `lenis.resize()` plus `ScrollTrigger.refresh()` on pathname change, after two frames. **If you ever put a height back on `<html>`, this returns.**

- **Fragment nav links are dead off the home page.** The header wordmark pointed at `#top` and the nav at `#flagship`/`#experience`/`#work`. None of those exist on `/blog`, so Writing was a one-way trip with no route home but the back button. `SectionLink`/`HomeLink` now rewrite a bare fragment to `/#work` when `usePathname() !== "/"`, and leave it a native anchor on the home page so the existing jump is untouched.

---

## 5. Hard rules

1. **No em dashes or en dashes.** Anywhere. Use commas, colons, full stops.
2. **Bullets, not paragraphs**, in project and experience blocks.
3. **No hardcoded colours.** Tokens in `globals.css` only.
4. **Accent budget:** roughly one accent element per screenful. Numbers get it; pills, bullets and rails do not.
5. **Never invent a number.** If it is not in a repo, a README or something he sent, it does not go on the site. A rendered `TODO` is worse than a smaller true number.
6. **Honour the profile guardrails** (documented in `experience.ts`): real job titles, D365 *supported* not led, 13% as a contributing driver, no ISO compliance claim, forecasting algorithm unnamed, EMIS not claimed, 17% figure omitted for having no baseline.
7. **Animation is enhancement.** Everything readable without JS. `prefers-reduced-motion` fully honoured.
8. **`featured: true` means "has a hand-written flagship block".** Setting it early *deletes* a project from the site, because `Work` renders everything unfeatured.
9. **Never put personal data on the site.** The source profile holds NI number, DOB, address, visa status, salary, health and equality data, and referee contacts. None of it is imported.

---

## 6. Outstanding

### Blocked on Rajarshi

| Item | Needed for |
|---|---|
| **Freelance engagements** | Experience section. Client/sector (anonymised fine), what was built, when, one outcome |
| **Dissertation v1/v2/v3 accuracies** under clean/FGSM/PGD, from `Project_Report.pdf` | Flagship block 06 |
| **Supervisor names**, and whether the industrial partner can be named | Block 06 |
| **94% vs 88% contradiction** | His accounting landing page claims 94%; the eval README says Haiku 88% (93.5% easy, 75% hard) and marks tiered routing as *not yet measured*. Site currently shows 94%. |
| **Domain** | CSP allowlist, canonical URLs, OG, JSON-LD |
| **"What are you looking for?"** FAQ answer | Last `TODO` blocking a production build |
| **Gradio Space** (optional) | Would make block 03 a live demo instead of a card |

### Queued work

1. **Flagship block 06**, the dissertation. Agreed approach: a hand-built interactive ResNet-18 layer strip in SVG (not Netron), above the real v1/v2/v3 robustness matrix.

2. **Flagship block 07, a UK public data set at scale.** Agreed 4 August 2026, and
   the rendered "Next" line under the flagship blocks already promises it. Either
   **HM Land Registry Price Paid** (roughly 30M transactions since 1995, open
   licence) or the **NHS English Prescribing Dataset** (hundreds of millions of
   rows a year). Why it matters: every flagship is a research spike, so the T's
   crossbar of SQL, ETL and statistics is claimed in `Stack` and demonstrated
   nowhere. Volume is the point, because volume is what forces the engineering to
   become visible. Needs one non-obvious defensible finding, not a tour of the
   data.

3. **Mobile navigation.** Still missing below 768px. Overdue.
4. **Design pass, part 2:** scrub-linked rail through the flagship blocks, sticky section eyebrows, larger/tighter hero type.
5. **Architecture diagram** for AI Accountant. Named explicitly in hiring-manager research; still absent.
6. **CV PDF** at `/cv`. He has a build pipeline that produces one.
7. **Services/process block** for the client audience.
8. **RSS + per-post OG images** for the blog.
9. **SEO finish:** sitemap, robots, JSON-LD `Person`.
10. **Deploy to Vercel.**

---

## 7. Running it

```bash
npm run dev                 # localhost:3000
npm run typecheck
CONTENT_DRAFT=1 npm run build   # env var bypasses the TODO gate
npm run build               # fails on any surviving TODO(rajarshi)
```

**Verify with Playwright, not the Chrome extension.** Pattern used throughout:

```js
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
await p.goto("http://localhost:3000", { waitUntil: "load" });
for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, 450); await p.waitForTimeout(30); }
await p.locator("#flagship").screenshot({ path: "out.png" });
```

Always check: rendered em dashes (`document.body.innerText.match(/[—–]/g)`), console errors, horizontal overflow at 375/768/1024/1440.

### Skills

- **`ui-ux-pro-max`** at `.agents/skills/`, symlinked to `.claude/skills/`. `npm run design -- "<query>" --domain gsap|typography|color`
- **`dataviz`** (bundled). **Run its validator before shipping any chart palette.** Current validated pairs: `#E82D77` + `#2AA0D0` (2 series), plus `#B08A00` (3 series).

---

## 8. External state he owns

- **`rajo69/agentic-ai-accounting`**: two commits pushed by me to `frontend/vercel.json`. The catch-all is `/:path+` so the root is excluded and framable; dashboard, OAuth and API keep `X-Frame-Options: DENY`. Allowlist is currently **localhost only**. Adding a production domain means editing **both** that file and `FRAMEABLE_FROM` in `LiveEmbed.tsx`, or the live embed silently switches off.
- **`rajo0113/banking77-llama-1b-lora`** on Hugging Face. Published, public, 90.21% / 90.28%.
- His **UKGC LCCP Render demo is dead** (no response in 120s). His README still advertises it as live, so anyone evaluating him from GitHub hits a dead link.

---

## 9. Key files

```
src/content/          All copy. Nothing is inlined in components.
  profile.ts          Headline, subhead, stats, spine, stack, FAQ
  projects.ts         featured = has a flagship block
  experience.ts       Guardrails documented at the top. Read them.
  certifications.ts   13, all verification links checked 200
  data/clustering.ts  Verbatim from his results.json
  data/clusters3d.json  Generated, ARI-asserted against his CSV
  data/forecast.ts    RPubs forecast + FRED outturn. Scoring computed, not typed.
  data/gates.ts       Gated-attention measurements, tagged by experiment number.
  posts/*.mdx         Blog. Each exports its own `meta`.

src/app/globals.css   Every token. Accent budget documented here.
                      --series-1/2/3 are the dataviz-validated chart colours,
                      deliberately NOT the accent. Do not extend by eye.
src/components/section/FlagshipParts.tsx   Block, Points, Fixes, Stats
src/components/layout/SectionLink.tsx      Route-aware nav links, see §4
src/components/projects/ForecastScorecard.tsx    Block 04 artifact, 3 views
src/components/projects/GatedAttentionExplorer.tsx  Block 05 artifact, 3 views
```

---

## 10. Working style he asked for

- Brief. He has said "briefly" more than once.
- Evidence over opinion. He explicitly asked for researched, cited answers rather than preference.
- Do not over-explain or pad. Show the thing.
- He pushes back well and is usually right. The proof-screaming, the invisible background, the duplicated project, the pink-on-pink: all his catches.
