# Handoff

**Read this first in a new session.** It is the single source of truth for where
this project is. `AGENTS.md` carries the hard rules, `DESIGN.md` the visual
system. `PLAN.md` and `CONTENT-BRIEF.md` are older and partly stale; trust this
file where they disagree.

Last updated: 4 August 2026, end of the session that shipped it.

## THE SITE IS LIVE

**<https://portfoliowebsite-pi-neon.vercel.app>**

- **Deployed** to Vercel, production, project `portfolio_website` under
  `rajarshi-nandis-projects`. Redeploy with `vercel --prod`.
- **Not connected to Git.** Pushing to GitHub does **not** redeploy. Connect at
  Settings → Git if that is wanted.
- **Repo: <https://github.com/rajo69/portfolio-website>, PRIVATE, deliberately.**
  See §11 before making it public: this file alone says the blog posts were
  assistant-drafted and carries three cold reviewers' critiques of him.
- Branch `feat/block-04-mobile-nav`, pushed, and it is also the repo's **default
  branch**. `master` exists and is behind. Worth merging before anyone looks.
- `npm run build` **passes with no flags**. There are no placeholders left.

### If you are here for aesthetic edits, read §0 first.

---

## 0. Starting an aesthetic session

Everything visual swings off **one file**: `src/app/globals.css`. Tokens, the
type scale, the glass treatment and the accent all live there, and every
component reads them. A rebrand is genuinely a handful of lines at the top of
that file.

### The five things that will bite you

1. **Type primitives must stay inside `@layer components`.** Un-layered CSS
   outranks Tailwind utilities, so moving `t-display` or `t-label` out of the
   layer silently kills `text-accent` and every `group-hover:` colour on them.
   Nothing errors. It just stops working.
2. **Tailwind v4 `scale-*` emits the standalone `scale` property**, which
   composes with an inline `transform` instead of overriding it. Two scales
   multiply.
3. **Canvas colour strings are `rgb(r g b / a)` with spaces.** Commas plus
   slash-alpha is invalid CSS, and canvas keeps the previous `fillStyle` rather
   than throwing, so the symptom is "everything renders black", not an error.
4. **An ancestor with `backdrop-filter`, `transform`, `filter`, `perspective`,
   `contain` or `will-change` becomes the containing block for `position:
   fixed` descendants.** This is not theoretical here: the mobile menu broke
   exactly this way, see §5b. If you add any of those to a wrapper, check every
   fixed overlay inside it.
5. **Accent budget: roughly one accent element per screenful.** Numbers earn
   it. Pills, bullet markers and rails do not. Ignoring this is what made the
   page read as "AI slop" the first time.

### Measure, do not eyeball

Two separate things shipped invisible or wrong because someone judged by eye:
the canvas at 1.22% lit pixels, and the harness graph collapsed into a hairball.
Both were caught by sampling, not by looking.

- Canvas density: `getImageData`, count lit pixels and mean alpha. DESIGN.md
  §2.1 has the method.
- Colour changes: compute contrast ratios before committing. The green accent
  was chosen by measuring 12.26:1 on `--ink-900`, not by preference.
- **`chrome-headless-shell` does not implement `backdrop-filter` and has no
  GPU.** It cannot see the glass at all, and its FPS numbers are meaningless.
  Anything about blur or real performance has to be checked on a device.

### What he has already rejected

Do not re-propose these without asking:

- **Two background designs**, plus a third replaced. Full history in §4.
- **The dissertation as a flagship block.** It is a card under Leeds. §2.
- **A 13-certification list.** Four only, no toggle. §8c.
- **Verifiable-but-illegible hero stats.** Tried and reverted the same day; the
  reasoning is in `profile.ts` above `stats`.

### The one aesthetic problem nobody has solved

**The home page is 34,669px tall on a phone. That is about 34 screens.** The
Kaggle row sits at 82% and the footer at 99%, which is why he could not find
either. Anything below roughly the halfway mark is decoration. Six flagship
blocks each carrying an interactive artifact is most of that height. If one
aesthetic decision is worth making next, it is this one, and it is a structure
question rather than a styling one.

---

## 1. The end goal

A personal portfolio site for **Rajarshi Nandi**, Data & AI engineer in
Sheffield, UK. It exists to get him hired or hired-for-work, fast.

Three audiences, in priority order:

1. **Hiring managers** for AI/ML engineering roles. Scan in under 90 seconds.
2. **Professors / PhD supervisors.** Care about research fit and demonstrated capability.
3. **SMB clients** wanting data insight or AI integration.

Design inspiration is <https://jeffbrokaw.com>: near-black, one hot accent, heavy
grotesque display type, animated canvas background, per-section rhythm. **The
structure is the inspiration, not the content.**

### The positioning

> **"I build AI people trust enough to use."**

*A model that cannot show its working does not get adopted, however accurate it
is.* It runs from IBM in 2021 (a churn model the business ignored until he made
the features legible) to 2026 (an accounting agent designed entirely around
showing its working to someone with professional liability).

---

## 2. Current state

**Live, and `npm run build` passes with no flags.** Next.js 16 App Router,
TypeScript, Tailwind v4, GSAP, Lenis, MDX.

| Section | Component | State |
|---|---|---|
| Hero | `Hero.tsx` | Done. Logit-lens decode, parallax, 3 stat counters |
| Spine | `Spine.tsx` | Done |
| Flagship projects | `Flagship.tsx` | **6 blocks, all done** |
| Experience | `Experience.tsx` | Done. IBM, ADHDNET, William Hill, 3 freelance, education |
| Work | `Work.tsx` | Done. Filterable by capability |
| Method | `Method.tsx` | Done. Rebuilt around `HarnessMap`, see §8d |
| About | `About.tsx` | Done |
| Stack | `Stack.tsx` | Done, rendered as a literal T |
| Certifications | `Certifications.tsx` | Done. 4 surfaced, 13 total, links 200 |

Plus `/blog`, `/blog/[slug]`, `/sitemap.xml`, `/robots.txt`. **Two published
posts**, gated attention and adversarial training, both undrafted on 4 August
2026 at his request and now building as static pages.

> **Both posts were drafted by an assistant, not written by him.** Every number
> in them is his and traceable, but the prose is first person under his name and
> he had not read it line by line at the point it was published. If anything in
> them reads wrong, that is the reason. The cadence promise ("one paper a week")
> was removed from the index because the post dates disprove it.

### The freelance engagements

Three, filled in on 4 August 2026 from what he sent plus the Hertfordshire KTP
supporting statement. **Anonymised to sector**, not named: he gave the business
owners' first names, all friends, and naming a private individual as your
client is a claim about someone else. Swap real names in only on his say-so.
The e-commerce one carries **no metrics**, because he stated no outcome number
for it and inventing one is rule 5.

### The six flagship blocks

Skeleton: **one-sentence lede → interactive artifact → three big numbers →
bullets → where it broke → links.**

1. **AI Accountant**: live iframe + architecture diagram. `88% · 95% · 33%`
2. **Clustering Stability**: 3D draggable PCA. `0.526 · 53→6 · 3/3`
3. **Banking77 LoRA**: HF model card. `90.21% · 77 · ~50 min`
4. **The Forecast I Got Wrong**: 3-view scorecard. `10/11 · 49% · 0.50%`
5. **The Application Harness**: pipeline/graph map. `15 · 22 · 0`
6. **What the Gates Actually Do**: 3-instrument explorer. `99.8% · 48.3% · 100%→79.6%`

Block 05 was promoted out of the Method section on 4 August 2026, at his
request, and placed **after** the time series and NLP block deliberately. Its
project entry in `projects.ts` carries `featured: true` for the ordinary reason
(it now has a hand-written block), unlike the dissertation's exception.

### The dissertation is NOT a flagship block

It was built as block 06 with a three-tab interactive, and **he rejected that
placement**: a taught dissertation is education, not a flagship project. It now
renders as `DissertationCard.tsx`, a compact table **under the University of
Leeds entry in the Experience section**. Three models by three attacks, four
lines of prose, one link. Do not promote it back to Flagship.

The association is `ed.thesis` being present in `education.ts`, which only Leeds
has. `projects.ts` keeps `featured: true` on it **not** because it has a
flagship block but to keep it out of the Work list, since it already has a
hand-written surface and appearing twice was a mistake made once before. That is
the one place the AGENTS.md rule 10 meaning is deliberately bent, and it is
commented in the file.

**It was never actually blocked.** An earlier handoff said the v1/v2/v3
accuracies needed `Project_Report.pdf`. They did not: the repository README
publishes all nine cells of the model-by-attack matrix. Only the per-epsilon
FGSM curve is PDF-only, so FGSM renders as a range rather than a curve.
**Check the README before believing a "blocked" row in this file.**

---

## 3. History

### The session that shipped it, 4 August 2026

| Commit | What |
|---|---|
| `48a0b1c` | Freelance entries, voice pass, cold-read fixes, harness block 05, green accent, DotGrid, OG card, env-based `siteUrl`, posts published |
| `cd625e3` | Mobile stutter: blur off below 900px, canvas loop idles |
| `67355fa` | Mobile menu containing block, canvas DPR, Kaggle |
| `62c453d` | Drop a redundant portal guard |
| `86243e4` | Canvas resolution and density on phones, profile links in the menu |

The detail is in §5b, §8b, §8c and §8d. Accent went green in `48a0b1c`, see §8e.

### Earlier sessions

| Commit | What |
|---|---|
| `50106af` | Scroll + nav fixes, flagship block 04, rebuilt block 05 explorer, mobile nav |
| `e44045c` | sitemap, robots, JSON-LD `Person` |
| `a805180` | Section rail, larger hero, design pass 2 |
| `42b7e70` | AI Accountant architecture diagram |
| `5a1a3e9` | Dissertation (later moved to Experience), background, "Data & AI Engineer" |
| `5114291` | Glass panels + background lab (**lab since deleted, see §4**) |

### Bugs fixed that were real

- **`h-full` on `<html>` froze Lenis's scroll limit.** Lenis watches
  `documentElement` with a ResizeObserver; a fixed height means it never fires.
  Correct on first load, stale on every client-side nav: a blog post stranded at
  **19% of its length**. Fixed by removing the height and calling
  `lenis.resize()` + `ScrollTrigger.refresh()` on pathname change.
  **If you ever put a height back on `<html>`, this returns.**
- **Header/footer fragment links were dead off the home page.** `#flagship` and
  friends do not exist on `/blog`, so Writing was a one-way trip with no route
  home but the back button. `SectionLink` / `HomeLink` rewrite them to `/#work`
  when off home, and leave them native anchors on home.
- **Mobile nav did not exist below 768px.** Now `MobileNav.tsx`: dialog, Escape
  to close, focus trapped and returned to the trigger, scroll locked by pausing
  Lenis rather than setting `overflow` on the document element, which is the
  thing Lenis measures against.

---

## 4. THE BACKGROUND: read before touching

**He has now rejected two background designs and replaced a third. Do not
redesign it again without asking him first.**

**What ships as of 4 August 2026 is `DotGrid.tsx`**, which he asked for by
pasting a React Bits snippet. A grid of dots, an accent proximity halo that
follows the pointer, and a click shockwave that pushes dots outward and springs
them home.

- **Colours come from tokens, not from his snippet.** The paste carried React
  Bits' demo palette (`#2F293A` base, `#5227FF` violet active), which is a
  second unrelated hue against this site's near-black and one accent. `readToken`
  reads `--ink-600` and `--accent` out of globals.css at mount. Flip
  `DEMO_PALETTE = true` in that file for the literal snippet colours.
- **The physics are hand-rolled, not copied.** React Bits drives each dot with a
  GSAP InertiaPlugin tween; at this density that is thousands of live tweens on
  a page already running Lenis and ScrollTrigger. A per-dot critically damped
  spring in the rAF loop does the same job far cheaper. His `resistance` and
  `returnDuration` still mean what they meant.
- **React Bits is MIT + Commons Clause.** Using it in a site is fine, reselling
  it is not. Credited in the file header.
- **Measured, per the rule below:** 8.0% lit pixels, mean alpha 158. Zero
  accent-tinted pixels with the pointer away, 512 with it on the page, zero
  again when it leaves, which is how the proximity halo was verified. Alpha
  alone cannot see it, because lit dots change hue rather than opacity.

`AttentionField.tsx` is **still in the tree, unused**. Three backgrounds, two
reverted, so deleting it would be optimistic.

The previous shipped background was `AttentionField.tsx`, the **attention
lattice**: token nodes, attention edges, gates closing, and the cursor acting as
the query token so most heads fire from the node nearest the pointer.

The history, so it is not repeated:

1. Original lattice, no pointer interaction. He said it was "not mouse reactive
   and not animated enough".
2. Cursor-as-query and per-node drift added (`5a1a3e9`). Measured 2.8x lit
   pixels around the cursor. **He still did not like it.**
3. Four candidates built and compared in a lab at `/lab/field`, with density
   measured for each. He chose **embedding drift**.
4. Embedding drift shipped and tuned twice. **He then asked to revert to the
   lattice.** Reverted.

**Everything from steps 3 and 4 is deleted and lives in commit `5114291`:**
`EmbeddingField`, `MatrixField`, `FlowField`, `FieldLab`, the `/lab/field`
route, and the `useFieldCanvas` hook. `git show 5114291` recovers any of it.

Measured density, lit fraction times mean alpha over lit pixels:

| Field | Total light | Verdict |
|---|---|---|
| **Lattice (shipped)** | **82** | What he settled on |
| Embedding drift | 175 | Built, shipped, reverted |
| Gradient flow | 284 | Best looking, least on-thesis |
| Attention matrix | 447 | Most literal, busiest |

> **Tune the canvas by sampling `getImageData`, never by eye.** It shipped
> invisible for three rounds at 1.22% lit pixels. DESIGN.md §2.1 has the method.

---

## 5. Glass panels

`.surface` carries a liquid-glass treatment: translucent fill, `backdrop-filter:
blur(20px) saturate(1.6)`, a bright rim on the top edge, a weaker one on the
bottom, and a sheen gradient. `@supports` falls back to the opaque panel.

He asked for this explicitly and it was **not** reverted with the background.

**THE BLUR IS OFF BELOW 900px, AND MUST STAY OFF.** The cost this file used to
record as UNMEASURED turned out to be the whole problem on a phone. Nine
elements carry `.surface`, each asking the compositor to blur its backdrop, and
behind all of them is a `position: fixed` canvas. When that canvas repainted
every frame, no backdrop was ever static, so every blur was recomputed per card
per frame. Rajarshi reported the stutter from a real device; Playwright could
never have seen it, because `chrome-headless-shell` does not implement
`backdrop-filter` at all.

Phones now get the same opaque panel the `@supports` fallback already defined.
Nothing is lost: glass reads as glass because of what shows through it, and on a
390px screen a card fills the width with almost nothing behind it to refract.

- **It is subtle over the dot grid.** Glass needs something behind it to
  refract, and the grid is sparse. This is why the background and the glass were
  worked on together.
- **Do not re-enable the blur on mobile to "fix" the look.** It is the single
  most expensive thing on the page and it buys nothing at that width.

The SVG `feDisplacementMap` refraction that Apple's Liquid Glass and React Bits'
`GlassSurface` use was deliberately not shipped: Chromium only, no
super-sampling so edges pixelate, fixed-size rounded rects only, and it would
bend the text inside the card. Full reasoning in the `globals.css` comment.

---

## 5b. Mobile, and three bugs Playwright could not see

All three were reported from a real phone after the site was already live. Each
one is a class of bug worth recognising again.

**1. The menu collapsed into a strip once you had scrolled.** The panel rendered
inside `<header>`, which is sticky and gains `backdrop-blur-md` on scroll. **An
ancestor with a `backdrop-filter` becomes the containing block for `position:
fixed` descendants**, so `fixed inset-0` stopped meaning the viewport and started
meaning the 64px header box. Unscrolled it was fine, which made it look
intermittent. Now portalled to `<body>` at `z-[80]`, so no ancestor can capture
it. `transform`, `filter`, `perspective`, `contain` and `will-change` all do the
same thing.

*A wrong first fix is recorded here too, because the reasoning was sound and the
diagnosis was not:* the panel had also used `bg-ink-900/95`, which Tailwind
compiles to `color-mix(in oklab, …)`, needing Safari 16.4+. That was a real
latent bug and fixing it did not fix his. It is now `background: var(--ink-900)`.

**2. The canvas rendered at two thirds resolution.** `devicePixelRatio` was
clamped to 2 on a 3x screen. The first fix made the clamp conditional on
`hover: hover` being false, which is fragile in the way input media queries
always are: **iPadOS and several Android browsers report `hover: hover`**, and
any device that does went straight back to the blurry path. Now an unconditional
cap of 3, safe because Retina desktops are 2 and most monitors are 1.

**3. The grid looked coarse, which is a different problem from looking soft.** A
20px pitch is 72 dots across a 1440px desktop and 20 across a 390px phone: the
same spacing, three and a half times coarser as a proportion of the screen.
Below 640px the pitch drops to 12.5. Measured lit density is now 7.2% on a phone
against 8.0% on desktop.

**The canvas loop idles.** It only runs while something is moving or a real
pointer is on screen. Measured: 0 repaints in 2s on an idle phone, 0 on desktop
with the pointer still, ~91 per 1.5s with it moving. This is what pays for the
3x resolution, since a phone paints the canvas once.

---

## 6. Outstanding

### Blocked on Rajarshi

| Item | Needed for |
|---|---|
| **Domain** | **No longer blocking.** He does not own one. `profile.ts` now resolves `siteUrl` from `NEXT_PUBLIC_SITE_URL`, then Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then localhost. `npm run build` passes with no placeholders. Set the env var if he buys a domain; nothing else changes. |
| **An FAQ section, or not** | `profile.faq` is written and **rendered nowhere**: grep it, the only hits are `profile.ts` and `types.ts`. The placeholder fourth answer was removed on 4 August 2026 because it was failing the build over copy no visitor could see. Either build the section (research in this file, below) and write that answer, or delete the block. |
| **Freelance detail** | Filled in, but thin in two places. The food waste app lists **only Google Cloud** for tech, because he named no other tool, and the e-commerce one has no outcome number. Both would carry more weight with one more line each. |
| **"What are you looking for?"** | **Now the highest-value missing thing on the site.** The hiring manager's biggest unresolved question was "IC or lead, AI engineering or data engineering, I cannot tell which he would accept". The professor's was "I still do not know what he wants to work on". One paragraph answers both, and it has to be his. Where it goes is open, since `profile.faq` renders nowhere. |
| **A research question, stated** | The professor could not state in one sentence what Rajarshi is intellectually interested in, and said the page gave him "a disposition, not a question". He named `Adversarial Robustness of SAE Interpretations` as the best question on the site, currently one line in a list of thirteen. |
| **The Holt claim** | Block 04 says `Holt still beat Drift and ARIMA on both horizons, so model selection was sound and the horizon was the problem`. The professor says that does not follow: ten breaches in eleven months is evidence the model class is wrong, because exponential smoothing with a fixed linear trend cannot represent the post-pandemic level shift in PCE. He would spend ten minutes of a first meeting there. **Decide whether you agree before someone asks live.** |
| **What "production" means** | The hiring manager will probe it: who actually uses the AI Accountant, what breaks at 3am. A `vercel.app` URL is not evidence anyone depends on it. Nothing on the site mentions on-call, incidents, uptime or a system that has run for a year, and for a mid-level req that was the gap he said he would push hardest on. |
| **Cutting the Work list** | Both the hiring manager and the professor read thirteen projects as breadth anxiety, and named `European Football Analytics` and `Brexit Breakdown` as dragging the average down. Which ones go is his call. There is no `hidden` flag on `Project` yet; adding one is the clean way, since `featured: true` deletes rather than demotes. |
| **CV as a document** | Both the hiring manager and the professor stopped on this. "I cannot forward a website to a funding panel." Already queued below as `/cv`. |
| **Right to work** | The hiring manager has to resolve it before an interview and the page's silence costs a round trip. **Do not put it on the site.** Visa status is named explicitly in rule 7 as personal data that must never ship. It belongs in the CV or the first reply, not on a public page. |
| ~~94% vs 88%~~ | **Fixed 4 August 2026, and it was worse than this row said.** **All three** of block 01's stats were unsourced, not just the first: `94%`, `<2s` and `3+ hrs` appear nowhere in the repo. It now shows `88%` (44/50), `95%` (auto-accept band) and `33%` (below 0.5, where it defers), all from `backend/evals/README.md`, plus a "where it broke" entry saying tiered routing is what production runs and has never been measured against the fixtures. |
| **Supervisor names** | Block 06 claims "an academic and an industrial supervisor" with no names. The repo acknowledges two GitHub handles, but naming someone as your supervisor is a claim about a real person, so nothing is named. |

### Queued, unblocked

1. **UK public data set at scale**, flagship block 07. Either **HM Land Registry
   Price Paid** (~30M transactions since 1995) or the **NHS English Prescribing
   Dataset**. Why it matters: every flagship is a research spike, so the T's
   crossbar of SQL, ETL and statistics is claimed in `Stack` and demonstrated
   nowhere. Volume is the point, because it forces the engineering to be
   visible. **The rendered "Next" line that used to promise this is gone**, he
   removed it on 4 August 2026: the page should not advertise work that does
   not exist. If the block ships it goes into the list, not under it.
2. **CV PDF** at `/cv`. He has a build pipeline that produces one.
3. **Services/process block** for the client audience. The SMB reviewer in §8c
   would not have replied to the site as it stands; his review is the brief.
4. **RSS + per-post OG images** for the blog. The site OG card exists; posts
   fall back to it.
5. **Rename the Vercel project.** The URL is `portfoliowebsite-pi-neon`, which
   is Vercel's random alias and reads badly pasted into an application.
   Settings → rename gives something like `rajarshi-nandi.vercel.app`, and
   `siteUrl` follows on the next deploy with no code change.
6. **Connect Vercel to GitHub** so pushes deploy themselves. It is currently a
   CLI-only project.
7. **Merge `feat/block-04-mobile-nav` into `master`**, or accept the feature
   branch as the default. Right now the default branch is the feature branch.
8. **Page length.** See §0. The biggest unsolved design problem.

### FAQ, researched but not written

The current FAQ has three thesis questions. Research finding: the questions that
earn their place are the ones a reader is **already silently asking and would
otherwise have to email to resolve**. For his audiences: work authorisation and
location, notice period, remote/hybrid/on-site, whether he is seeking a PhD and
in what area, and how he scopes and prices client work. The best pattern found
(Daniel Spatzek's) attributes each question to who asks it, "asked by a client",
"asked by a designer".

### React Bits, researched, verdict: do not install

All 139 components were downloaded and their imports inspected. **37 of 45
backgrounds need WebGL** (`ogl` or `three`), and 20 components need `motion`.
Only 62 need nothing new. Licence is **MIT + Commons Clause**: using components
in a website is fine, reselling them is not, and the notice must ship with
copied code. The site already implements better-motivated equivalents of their
`SplitText`, `CountUp`, `DecryptedText`, `Particles` and `TargetCursor`. The
only ideas judged worth stealing: `StaggeredMenu`'s layered reveal, and
`GlassSurface`'s CSS glass, which is what shipped in §5.

---

## 7. Running and verifying

```bash
npm run dev                      # localhost:3000
npm run typecheck
npm run lint                     # 3 PRE-EXISTING errors, see below
npm run build                    # PASSES. No placeholders left, no flag needed
CONTENT_DRAFT=1 npm run build    # the bypass, no longer needed for anything
vercel --prod                    # redeploy. Not wired to git pushes
```

**Lint has 3 known errors, all pre-existing:**
`CursorRing.tsx`, `LiveEmbed.tsx` and `use-reduced-motion.ts`, all
`react-hooks/set-state-in-effect`. The `use-reduced-motion` one is deliberate:
AGENTS.md requires it be read synchronously.

**Verify with Playwright, not the Chrome extension.** There is no local
dependency; the global `@playwright/cli` bundles one, and the browser must be
pinned because the default revision is not installed:

```js
const PW = process.env.APPDATA + "/npm/node_modules/@playwright/cli/node_modules/playwright";
const { chromium } = require(PW);
const b = await chromium.launch({ executablePath:
  process.env.LOCALAPPDATA + "/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe" });
```

Always check: rendered em dashes (`document.body.innerText.match(/[—–]/g)`),
console errors, horizontal overflow at 375/768/1024/1280/1440/1920, the mobile
panel at 360 to 767, and reduced motion. Note `chrome-headless-shell` has **no
GPU and no `backdrop-filter`**, so FPS numbers from it are software-rendered and
pessimistic; do not treat them as real-browser figures.

---

## 8. Key files

```
src/content/            All copy. Nothing inlined in components.
  profile.ts            Headline, subhead, stats, spine, stack, FAQ, meta
  projects.ts           featured = has a hand-written flagship block
  experience.ts         Guardrails documented at the top. Read them.
  data/clustering.ts    Verbatim from his results.json
  data/clusters3d.json  Generated, ARI-asserted against his CSV
  data/forecast.ts      RPubs forecast + FRED outturn. Scoring computed.
  data/gates.ts         Gated-attention measurements, tagged by experiment
  data/robustness.ts    Dissertation matrix. Comparisons computed, not typed.
  data/architecture.ts  AI Accountant graph, from its workflow.add_node calls
  data/harness.ts       The application harness, from the Obsidian vault. §8d

src/app/globals.css     EVERY TOKEN. Start here for anything visual.
                        Accent, glass, the mobile blur override, the accent
                        budget note. --series-1/2/3 are dataviz-validated
                        chart colours, deliberately NOT the accent.
src/app/opengraph-image.tsx  The OG card. The ONLY file allowed literal hex,
                        because Satori has no stylesheet and cannot read
                        custom properties. Keep it in sync with the tokens.

src/components/layout/DotGrid.tsx           THE BACKGROUND. See §4 and §5b.
src/components/layout/AttentionField.tsx    The PREVIOUS background, unused,
                                            kept because two were reverted.
src/components/layout/SectionRail.tsx       Gutter marker, xl+ only
src/components/layout/SectionLink.tsx       Route-aware nav links
src/components/layout/MobileNav.tsx         Below 768px. Portalled to body.
src/components/projects/                    The six flagship artifacts
src/components/projects/HarnessMap.tsx      Block 05, two views. §8d
```

---

## 8b. The voice pass, 4 August 2026

The whole rendered corpus was audited for machine-sounding prose and rewritten
in place. Measured on the rendered text, not the source:

| Tic | Before | After |
|---|---|---|
| Antithesis ("rather than", ", not", ", never") | 22 | 12 |
| "actually" | 9 | 2 |
| Epigram closers ("which is what…", "that is why…") | 12 | 6 |
| Section headings in the comma-pivot mould | 7 of 10 | 2 of 10 |
| Verbatim repeats within one scroll | 6 | 0 |

**Do not undo these by writing more of the same.** The failure mode was one
rhythm applied to everything: every heading a comma-pivot fragment, every
paragraph landing on a maxim, every contrast phrased as "X, not Y". The
substance was never the problem. Some of the tics remain on purpose, where the
contrast is genuinely the finding ("stability is not correctness", "a trade,
not a win").

Repeats that were killed: the retrieval-pipeline sentence appeared **word for
word** in Spine and Stack; "Accuracy gets a demo" ran as both the Spine kicker
and the About heading; "prose is read partially and remembered selectively"
appeared twice inside Method, inches apart.

Still unfixed, deliberately: `projects.ts` `proves` and `description` fields
carry the same repetitions, but **nothing renders them today**. Fix them if a
`/work/[slug]` case study page is ever built.

## 8c. The cold-read pass, 4 August 2026

Three reviewers were shown the rendered site and **nothing else**: no repo, no
brief, no idea who Rajarshi is. A hiring manager with an open mid-level AI req,
a professor fielding a PhD enquiry, and the owner of a 35-person non-tech
business he had approached for freelance work.

Verdicts: **interview**, **worth a meeting**, **probably would not reply**.

Their agreements were the useful part, because none could see the others:

| Finding | Acted on |
|---|---|
| The hero stat row failed **all three** as unattributed claims | Yes, replaced with checkable numbers, see `profile.ts` |
| The best sentences sat behind tab clicks nobody makes | Yes, reconciler and ungated control promoted |
| `William Hill` unframed, all three inferred something worse than the truth | Yes, one clause added |
| 13 certifications actively subtract | Yes, toggle removed, four only |
| `Job Apply Harness` read as a job-hunting funnel, not a project | Yes, retitled and rewritten |
| `0% → 90.21%` is debunked by its own block four lines below | Yes, stat is now `90.21%` |
| "One paper a week" is falsified by the post dates on the same screen | Yes, cadence promise removed |

**Two of their complaints were artefacts of the capture, not the site.** The
transcript walker skipped `<span>`, and `Label` renders as a span, so the
reviewers could not see the date rails or the filter counts. Both render
correctly. Do not "fix" them.

**The professor challenged a claim on its merits**, which is a content question
rather than a presentation one and is still open. See §6.

## 8d. The harness map, 4 August 2026

The Method section's "Every guard is a scar" table is gone. It listed four
failures and four function names **with no subject**: the reader was never told
what the agent was, so it opened on the consequences of a system it had not
introduced. Rajarshi could not read his own section, which settled it.

Replaced by `HarnessMap.tsx`, built from **his Obsidian vault** at
`C:\Users\Rajo\Desktop\harness-system-vault`: 41 notes, 170 wikilinks, tagged
stage / component / store / principle / gate / skill. `content/data/harness.ts`
transcribes 40 of those notes plus all 15 rows of `Failure Modes Ledger.md`.

**Two views over one data set, toggled**, because he asked for both:

- **Pipeline**: the 10 stages, the Scout fan-out to Statement and CV, the human
  handover, and the dashed write-back loop. This is the one that explains.
- **Graph**: all 40 notes force-directed, drag a node, Obsidian-style.

Three things that were measured, not eyeballed, and must not be undone:

1. **Force constants.** The first attempt (rep 5200, att 260, gravity 0.012)
   collapsed all 40 nodes into a third of the canvas. Now rep 62000, att 700,
   gravity 0.0035, plus a **bounding-box normalisation** so the layout fills the
   canvas regardless of the constants. Measured: min pair distance 58.8px, zero
   pairs under 40px.
2. **Labels are selective.** All 40 at once was unreadable soup. The 10 stages
   stay named; everything else names itself when selected or adjacent. That is
   also what Obsidian does when zoomed out.
3. **The graph needs a lighter neutral than the pipeline.** `--ink-500` is fine
   on a 104px box and invisible on a 6px dot over glass. Graph nodes use
   `--paper-faint`, edges use `--line-strong`. Hue still encodes kind and
   nothing else.

**The layout is precomputed deterministically at module load**, not simulated
live: server and client produce identical coordinates, so there is no hydration
mismatch, no animation loop, and nothing to disable for reduced motion. There is
no `Math.random` anywhere in it, deliberately.

**Publishing this is safe because the vault already solved it.** Its
`Personal Data Boundary` note states that it documents the machine and contains
no candidate data and no job data; every store note gives schema and disciplines,
never values. All 41 notes were read before anything shipped. That boundary is
itself a node in the map rather than being quietly omitted.

**One thing worth knowing:** `Component - style_lint.py` in that vault is a
deterministic AI-writing linter that flags balanced antithesis frames,
summary-bow endings, three-part parallel structures and uniform sentence rhythm
by coefficient of variation. It is the tool that would have caught the site's
own copy problems in §8b. If the voice ever needs re-auditing, run his linter
rather than re-deriving the checks.

## 8e. The accent, and how a rebrand actually works

**Green `#00E88C`, changed from Plasma pink `#FF3D8B` on 4 August 2026.**

The swap was five token values in `globals.css` plus four files that cannot read
CSS custom properties. That is the whole surface area, and it is worth knowing
before the next colour change:

| Where | Why it cannot use a token |
|---|---|
| `opengraph-image.tsx` | Satori has no browser and no stylesheet |
| `DotGrid.tsx` fallback | Guard for a missing token at canvas init |
| `AttentionField.tsx` fallback | Same, in the unused background |
| Two code comments | Quoted the old hex as history |

Measured before committing, not chosen by eye:

| | Green | Old pink |
|---|---|---|
| Accent on `--ink-900` | **12.26:1** | 5.97:1 |
| Dark text on filled accent | **12.26:1** | 5.97:1 |
| `--accent-dim` on `--ink-900` | **7.04:1** | 3.63:1 |

Two consequences worth carrying forward:

- **The old "accent copy must stay at label or headline size" constraint is
  gone.** It existed because the pink sat low on contrast. Green has double the
  headroom, so size is now taste, not accessibility.
- **`--series-1/2/3` did NOT move, deliberately.** They are dataviz-validated as
  a set for deuteranopia and protanopia separation against the chart surface,
  and none of that depended on the accent. Recolouring charts to match the brand
  means re-running the dataviz validator from scratch. "Make the charts green
  too" is exactly the by-eye change that rule exists to stop.
- One thing improved for free: `--accent` and `--series-1` used to be
  near-identical pinks, which is why `ArchitectureDiagram` carries selection by
  weight rather than hue. That collision is gone, so hue is now available there
  if wanted. `HarnessMap` copied the weight convention, so change both or
  neither.

## 9. Hard rules

Full list in `AGENTS.md`. The ones that bite most often:

1. **No em dashes or en dashes anywhere.** 159 were purged once.
2. **Bullets, not paragraphs**, in project and experience blocks.
3. **No hardcoded colours.** Tokens in `globals.css` only.
4. **Accent budget: roughly one accent element per screenful.** Numbers earn it.
   Pills, bullet markers and rails do not.
5. **Never invent a number.** If it is not in a repo, a README or something he
   sent, it does not ship. Block 01 violated this with three invented numbers
   until 4 August 2026; see §6.
6. **Animation is enhancement, never structure.** Everything readable without
   JS, `prefers-reduced-motion` fully honoured and read synchronously.
7. **Never put personal data on the site.** The source profile holds NI number,
   DOB, address, visa status, salary, health and equality data, and referees.
8. **`featured: true` means "has a hand-written flagship block."** Setting it
   early *deletes* a project from the site, because `Work` renders everything
   unfeatured.

---

## 10. Working style he asked for

- **Brief.** He has said "briefly" more than once.
- Evidence over opinion. Researched, cited answers rather than preference.
- Do not over-explain or pad. Show the thing.
- **He pushes back well and is usually right.** The proof-screaming, the
  invisible background, the duplicated project, the pink-on-pink and both
  background rejections were all his catches.
- **He changes his mind on aesthetics, and that is fine.** Two backgrounds were
  built and reverted. For a taste decision, **build the comparison and let him
  look** rather than shipping one and defending it. That is what the background
  lab was for and it worked, right up until he preferred the original.
- **He asks for a specific thing and means it.** DotGrid, the green accent and
  the harness block were all named requests, not open briefs. Deliver the thing
  he asked for; where a house rule conflicts, honour the rule, ship it, and say
  clearly what you changed and how to flip it back. `DEMO_PALETTE` in
  `DotGrid.tsx` is the pattern.
- **He reports bugs from a real device, and he is right even when the tooling
  disagrees.** All three mobile bugs in §5b were invisible to Playwright. When
  he says something looks wrong on his phone, the tooling is the thing to doubt.

---

## 11. Before making the repo public

It is private on purpose. This repo is a working notebook, not a portfolio
artifact, and a hiring manager who likes the site is exactly the person who
would click through to it. Currently readable by anyone with access:

- **This file**, which states plainly that both blog posts were drafted by an
  assistant rather than written by him.
- The reasoning for anonymising three freelance clients, including that they are
  friends.
- The `William Hill` framing note: every cold reader inferred redundancy, a visa
  problem or unavailability.
- Three reviewers' verbatim critiques of him, including the certifications
  reading as a junior signal and his own Method section being unreadable.
- `AGENTS.md`, which opens on what made the page read as "AI slop".

Either keep it private, or move the internal docs (`HANDOFF.md`, `AGENTS.md`,
`DESIGN.md`, `PLAN.md`, `CONTENT-BRIEF.md`) into a separate private repo first.

`gh repo edit rajo69/portfolio-website --visibility public` if he decides
otherwise.
