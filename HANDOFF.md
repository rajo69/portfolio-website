# Handoff

**Read this first in a new session.** It is the single source of truth for where
this project is. `AGENTS.md` carries the hard rules, `DESIGN.md` the visual
system. `PLAN.md` and `CONTENT-BRIEF.md` are older and partly stale; trust this
file where they disagree.

Last updated: 4 August 2026. Branch `feat/block-04-mobile-nav`, seven commits
ahead of `master`, not yet merged or pushed. Run `git log --oneline master..HEAD`
for the list; §3 explains what each one did.

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

**Working, builds clean** with `CONTENT_DRAFT=1`. Next.js 16 App Router,
TypeScript, Tailwind v4, GSAP, Lenis, MDX.

| Section | Component | State |
|---|---|---|
| Hero | `Hero.tsx` | Done. Logit-lens decode, parallax, 3 stat counters |
| Spine | `Spine.tsx` | Done |
| Flagship projects | `Flagship.tsx` | **5 blocks, all done** |
| Experience | `Experience.tsx` | Done. IBM, ADHDNET, William Hill, education |
| Work | `Work.tsx` | Done. Filterable by capability |
| Method | `Method.tsx` | Done |
| About | `About.tsx` | Done |
| Stack | `Stack.tsx` | Done, rendered as a literal T |
| Certifications | `Certifications.tsx` | Done. 4 surfaced, 13 total, links 200 |

Plus `/blog`, `/blog/[slug]`, `/sitemap.xml`, `/robots.txt`. One **draft** post.

### The five flagship blocks

Skeleton: **one-sentence lede → interactive artifact → three big numbers →
bullets → where it broke → links.**

1. **AI Accountant**: live iframe + architecture diagram. `94% · <2s · 3+ hrs`
2. **Clustering Stability**: 3D draggable PCA. `0.526 · 53→6 · 3/3`
3. **Banking77 LoRA**: HF model card. `0%→90.21% · 77 · ~50 min`
4. **The Forecast I Got Wrong**: 3-view scorecard. `10/11 · 49% · 0.50%`
5. **What the Gates Actually Do**: 3-instrument explorer. `99.8% · 48.3% · 25,600`

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

## 3. What was done this session

Six commits on `feat/block-04-mobile-nav`, branched off `c6d07b4`.

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

**He has rejected two background designs. Do not redesign it again without
asking him first.**

What ships is `AttentionField.tsx`, the **attention lattice**: token nodes,
attention edges, gates closing, and the cursor acting as the query token so most
heads fire from the node nearest the pointer.

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
Two things to know:

- **It is subtle over the lattice.** Glass needs something behind it to refract,
  and the lattice is sparse (82 total light against embedding drift's 175). This
  is why the background and the glass were worked on together.
- **The GPU blur cost is UNMEASURED.** `chrome-headless-shell` does not
  implement `backdrop-filter`, so Playwright cannot see it. Translucency alone
  costs nothing (glass 14.9fps vs opaque 14.4fps at the same scroll position),
  but **measure the real blur cost in a real browser before deploying.**

The SVG `feDisplacementMap` refraction that Apple's Liquid Glass and React Bits'
`GlassSurface` use was deliberately not shipped: Chromium only, no
super-sampling so edges pixelate, fixed-size rounded rects only, and it would
bend the text inside the card. Full reasoning in the `globals.css` comment.

---

## 6. Outstanding

### Blocked on Rajarshi

| Item | Needed for |
|---|---|
| **"What are you looking for?"** FAQ answer | `profile.ts:122`. **The last TODO blocking a real `npm run build`, and therefore the deploy.** His own note says it must be in his words. |
| **Domain** | `profile.ts:132`. Drives sitemap, robots, JSON-LD, OG and canonical URLs. One-line change, everything else reads from it. |
| **Freelance engagements** | `experience.ts:107`. Client or sector (anonymised fine), what was built, roughly when, one outcome. |
| **94% vs 88%** | Block 01 shows **94%** with no traceable source. `evals/README.md` reports **88.0%** (44/50 fixtures, Haiku alone) and **95.0%** on the auto-accepted subset. Tiered routing, which production actually runs, is **not measured**. Recommendation given and not yet answered: change to 88% with the basis named, add 95% as a second stat. |
| **Supervisor names** | Block 06 claims "an academic and an industrial supervisor" with no names. The repo acknowledges two GitHub handles, but naming someone as your supervisor is a claim about a real person, so nothing is named. |

### Queued, unblocked

1. **UK public data set at scale**, flagship block 07. Either **HM Land Registry
   Price Paid** (~30M transactions since 1995) or the **NHS English Prescribing
   Dataset**. Why it matters: every flagship is a research spike, so the T's
   crossbar of SQL, ETL and statistics is claimed in `Stack` and demonstrated
   nowhere. Volume is the point, because it forces the engineering to be
   visible. The rendered "Next" line under the flagship blocks already promises
   this.
2. **CV PDF** at `/cv`. He has a build pipeline that produces one.
3. **Services/process block** for the client audience.
4. **RSS + per-post OG images** for the blog.
5. **Deploy to Vercel.** Blocked by the three TODOs above.

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
CONTENT_DRAFT=1 npm run build    # bypasses the TODO gate
npm run build                    # exits 1 on the 3 surviving TODOs
```

**Lint has 3 known errors, all pre-existing, none introduced this session:**
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

src/app/globals.css     Every token. Accent budget and glass documented here.
                        --series-1/2/3 are dataviz-validated chart colours,
                        deliberately NOT the accent. Do not extend by eye.
src/components/layout/AttentionField.tsx    The background. See §4.
src/components/layout/SectionRail.tsx       Gutter marker, xl+ only
src/components/layout/SectionLink.tsx       Route-aware nav links
src/components/layout/MobileNav.tsx         Below 768px
src/components/projects/                    The six flagship artifacts
```

---

## 9. Hard rules

Full list in `AGENTS.md`. The ones that bite most often:

1. **No em dashes or en dashes anywhere.** 159 were purged once.
2. **Bullets, not paragraphs**, in project and experience blocks.
3. **No hardcoded colours.** Tokens in `globals.css` only.
4. **Accent budget: roughly one accent element per screenful.** Numbers earn it.
   Pills, bullet markers and rails do not.
5. **Never invent a number.** If it is not in a repo, a README or something he
   sent, it does not ship. The 94% on block 01 currently violates this.
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
