# Execution Plan, Rajarshi Nandi Portfolio

Status: **directory prepared, awaiting content.** Read `DESIGN.md` for the visual system, `CONTENT-BRIEF.md` for what you need to send.

---

## 0. Positioning

Read from your 56 public repos, the positioning writes itself and it is *not* "full-stack developer":

> **You do interpretability research on models and you ship the production systems built from them, the same person on both ends.**

Evidence already on your GitHub:

| Track | Repos |
|---|---|
| **Research** | gated-attention gate sparsity & functional sensitivity, SAE adversarial robustness, clustering-stability analysis, adversarial robustness dissertation, `text2cypher-grpo-sub2b` |
| **Engineering** | `job-apply-harness` (executable invariants, guards, gates), `ai-content-engine`, `chronoagent`, `voice-loop`, agentic accounting with RL routing |
| **Product** | `job_lens_ai`, `BidBrief`, `ukgc-lccp-rag-api`, `uk-fca-financial-assistant`, `S5-Web-Co` |

That maps onto the reference's "one operator owns all three" spine exactly, you just swap the three nodes. Nothing about the structure has to be forced.

---

## 1. Stack (installed)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16.2 (App Router, RSC) | Static-first, best-in-class font handling, one-command Vercel deploy |
| Language | TypeScript 5 | Content files get compile-time schemas, a typo in a date fails the build |
| Styling | Tailwind v4 + CSS custom properties | v4 reads `@theme` straight from CSS; tokens live in one file |
| Animation | `gsap@3.15` + ScrollTrigger + SplitText + Flip | All plugins free since 3.13; ScrollTrigger is the only mature scrub engine |
| Smooth scroll | `lenis` | 3 kB, the reference's scroll feel |
| Icons | `lucide-react` | Tree-shaken SVG, skill's explicit no-emoji rule |
| Charts | Hand-rolled SVG | 4 small one-shot charts don't justify a 50 kB chart lib |
| Deploy | Vercel | ISR for the GitHub proof strip |

**Deliberately not used:** Three.js (2D canvas is enough and 40× lighter), Framer Motion (GSAP already covers it, two animation engines is a smell), a CMS (content is 6 typed TS files you edit directly), shadcn/ui (one accordion doesn't justify the install; will add only if the FAQ grows).

---

## 2. Skills installed

| Skill | Where | Role |
|---|---|---|
| `ui-ux-pro-max` | `.agents/skills/` → symlinked to `.claude/skills/` | 84 styles · 192 palettes · 74 font pairings · 16 GSAP presets. Queried for the type stack, motion presets, and the pre-delivery checklist. |

Query it with:
```powershell
python .agents\skills\ui-ux-pro-max\scripts\search.py "<query>" --domain gsap|typography|color|ux|landing --stack nextjs
```

> **Note on the security scan.** `skills.sh` flags this package "High Risk" on one of its three scanners (Socket: 0 alerts, Snyk: Low). It ships Python scripts + CSV data and no network calls, and has ~298 K installs. I've read what we execute. Flagging it so the call is yours, not silently mine.

Also available and worth using during the build: `vercel:nextjs`, `vercel:react-best-practices`, `vercel:performance-optimizer`, `vercel:deploy`.

---

## 3. Page map, and exactly where your details land

Single long page at `/`, plus per-project detail routes. Section order mirrors the reference's proven rhythm.

| # | Section | Reference analogue | Your content | Source file |
|---|---|---|---|---|
| 1 | **Header** | sticky nav + progress bar | Logo mark, `LAB · WORK · RESEARCH · ABOUT`, "Talk to me" CTA | `profile.ts` → `nav`, `email` |
| 2 | **Hero** | particle headline + stat row | Eyebrow = current title. Headline = your one-line thesis (logit-lens decode). 2, 3 line sub. **3 stat tiles.** Footer: `LEEDS, UK` / `SEE THE WORK ↓` | `profile.ts` → `headline`, `subhead`, `stats`, `location` |
| 3 | **Spine** | "One operator owns all three" | `RESEARCH → ENGINEERING → PRODUCT`, 1 line each, animated triangle diagram, kicker line | `profile.ts` → `spine` |
| 4 | **The Lab** | live demo cards | **4 flagship projects.** Alternating L/R cards, each with a real metric chart + `Proves:` line + repo/demo links | `projects.ts` (`featured: true`) |
| 5 | **Work** | case study list | **All other projects** as full-bleed rows with `RESEARCH / SHIPPED / ALL` filter | `projects.ts` |
| 6 | **Receipts** | "Twenty-five years…" | Big paragraph with accent-highlighted numbers, then **experience timeline**, **education**, **certifications** | `experience.ts`, `education.ts`, `certifications.ts` |
| 7 | **Stack** | "Working stack" list | Tools you actually use, as a tracked-out mono grid | `profile.ts` → `stack` |
| 8 | **Proof** | *(new, not in reference)* | Live GitHub heatmap, repo count, language split | GitHub API, ISR 24h |
| 9 | **Writing** | Writing nav item | Notebooks / posts / papers, omitted entirely if empty | `writing.ts` |
| 10 | **FAQ** | 5 Q&A | 4, 5 questions in your voice | `profile.ts` → `faq` |
| 11 | **Contact** | "What's stuck?" | One line + email + GitHub + LinkedIn | `profile.ts` → `contact` |
| 12 | **Footer** | repeated nav | Nav, socials, `LEEDS, UK · MMXXVI`, colophon | `profile.ts` |

**Sub-routes**
- `/work/[slug]`, full case study per project. Same section rhythm: problem → approach → what shipped → measured result → stack → links.
- `/research/[slug]` *(optional)*, for the interpretability notebooks, with the actual figures.

---

## 4. Content model

Six typed files under `src/content/`. Every field is documented inline. Fill them and the site is done, no component edits needed for content changes.

```
src/content/
  types.ts           schemas, the contract
  profile.ts         identity, headline, stats, spine, stack, faq, contact
  experience.ts      work history           ← you send
  education.ts       degrees                ← you send
  certifications.ts  certs + credential IDs ← you send
  projects.ts        pre-seeded from your GitHub, you correct + add metrics
  writing.ts         optional
```

Placeholders are marked `TODO(rajarshi)`. `npm run check:content` fails the build if any survive.

---

## 5. Build order

| Phase | Work | Blocked on |
|---|---|---|
| **0, done** | Next.js + TS + Tailwind v4 scaffolded · GSAP/Lenis/Lucide installed · `ui-ux-pro-max` installed · tokens written · content schema written |, |
| **1, done** | Fonts wired via `next/font` · layout shell · sticky header · scroll progress · cursor ring · Lenis smooth scroll · `AttentionField` canvas · type primitives · `Reveal` · placeholder page. Verified: 60fps, 0 long tasks, no horizontal overflow at 375/768/1024/1440, reduced-motion path correct. |, |
| **2, done** | Hero with logit-lens decode + confidence rail · stat counters · Spine triangle diagram · ScrollTrigger refresh on font load. Built against the placeholder headline; swaps to yours with no code change. |, |
| **3** | Lab cards + 4 SVG chart primitives; Work list + FLIP filter | your project metrics |
| **4** | Receipts: timeline, education, certifications; Stack grid | **your CV content** |
| **5** | GitHub proof strip (ISR); FAQ; Contact; Footer |, |
| **6** | `/work/[slug]` case studies | your write-ups |
| **7** | SEO, OG image, sitemap, JSON-LD; a11y + Lighthouse pass against the `DESIGN.md` checklist; deploy to Vercel + domain |, |

Phase 1 can start the moment you pick an accent. Phases 2, 4 need your content, that's `CONTENT-BRIEF.md`.

---

## 6. Decisions

### Locked

| | |
|---|---|
| **Accent** | **Plasma `#FF3D8B`**, attention-heatmap hot end. See `DESIGN.md §3` for the contrast constraint it carries. |
| **Audience** | All three, **hiring first**. Balanced register; the experience timeline and the Lab carry the most weight. Copy is rigorous and measured, not salesy, but every section still ends somewhere a reader can act. |
| **Case studies** | **Full `/work/[slug]` pages for the 4 Lab projects.** Work-list rows link to repos. Needs ~300 words from you per Lab project (§5 of `CONTENT-BRIEF.md`). |
| **Contact** | Mailto only, zero backend, zero spam surface. Same as the reference. Say the word if you want a form instead. |

**What "hiring first" changes concretely:** Receipts (§6) moves above the Work list rather than below it, so experience/education/certifications are reachable in one scroll. The FAQ answers "what are you looking for" directly. The contact CTA reads as an invitation to talk, not a pitch.

### Known gaps carried into Phase 2

- **No mobile navigation.** The nav links are `hidden md:flex`, so below 768px only the "Talk to me" CTA is reachable, the four section anchors aren't. Deliberately deferred until the section list is final rather than built twice, but it must ship before launch: hiring-first means recruiters on phones.
- **Dev-mode automation quirk.** Chrome-extension script injection intermittently times out against this page while Lenis is active. Playwright over CDP shows 60fps and `evaluate()` in 6ms, so this is a tooling artifact, not a user-facing defect. Use `?field=off` to disable the canvas when profiling.

### Still open

1. **Domain**, `rajarshinandi.com`? `rajarshi.dev`? Affects canonical URLs, OG tags, JSON-LD.
2. **CV download**, PDF served at `/cv`?
3. **Photo**, the reference has none and it works. Your call.
4. **Curation**, which of the 56 repos make the cut. See `CONTENT-BRIEF.md §6`.
