# Design System, "The Attention Field"

Reference: <https://jeffbrokaw.com> · Generated with the `ui-ux-pro-max` skill (`.claude/skills/ui-ux-pro-max`), then overridden where the skill's generic picks conflicted with the reference aesthetic.

---

## 1. What the reference actually does

I read the live site rather than the markup. Its DNA, decomposed:

| Layer | Reference (jeffbrokaw.com) | Verdict |
|---|---|---|
| Surface | Warm near-black `#0A0A0A`, never pure black | **Keep** |
| Accent | One hot colour (orange `~#F26430`). No second hue anywhere. | **Keep the discipline, change the hue** |
| Ambient bg | Fixed canvas: orthogonal PCB traces + travelling pulse dots, ~4% opacity | **Keep the technique, change the subject** |
| Cursor | Lagging outline ring that scales on hover targets | Keep |
| Display type | Heavy grotesque, `letter-spacing: -0.035em`, `line-height: 0.94`, 2-line headlines | Keep |
| Micro-labels | 11px uppercase mono, `letter-spacing: 0.18em`, preceded by a small accent square | Keep, this is the cheapest, highest-yield detail on the whole site |
| Section rhythm | eyebrow → 2-line hero headline → 3-line muted paragraph → content. Identical every time. | Keep |
| Reveal | Per-character blur + fade on scroll-in (GSAP SplitText) | Keep |
| Work list | Full-bleed rows, hairline dividers, title left / outlined pill + arrow right | Keep |
| Proof | Live demo cards with animated mini-dashboards and counting numbers | **Keep the idea, make it real** |
| Header | Sticky, plus a 2px accent scroll-progress bar pinned to the very top | Keep |

**The trap:** copy the orange and it is a clone, not an homage. The structure is the inspiration; the content of the structure has to be yours.

---

## 2. The unique touch

The reference's metaphor is a **circuit board**, "I build systems that move money."

Yours is an **attention field**, "I build systems that think, and I open them up and look inside."

That is not decoration. It is literally what your repos are: gated-attention analysis, SAE interpretability, GRPO fine-tuning, agentic harnesses with executable invariants. Five concrete expressions:

### 2.1 Ambient canvas, the attention lattice
Replaces the PCB. A sparse token lattice on a fixed full-viewport canvas: nodes are tokens, edges are attention weights. Weights flicker; occasionally a gate closes and a node dims out entirely (your gated-attention finding, rendered). Same visual weight as the reference (~4, 6% opacity accent on near-black), completely different meaning.

*Structure:* an orthogonal grid of token nodes (low jitter, so rows and columns stay legible) carries the lattice, with ~16% of nodes also throwing a **long-range edge** across the field. The long edges are the point: attention is not local, and they stop the field reading as a circuit board someone else already drew.

*Budget:* 2D canvas, ≤620 nodes, DPR-capped at 2, alpha-bucketed `Path2D` batching (~16 draw calls/frame), paused off-screen and on hidden tabs, hard-off under `prefers-reduced-motion`.

*Density, verify by sampling, never by eye.* The first build shipped at edge alpha `0.055` / node alpha `0.16` and was effectively invisible: **1.22% of canvas pixels lit, mean alpha 6.6/255, max 42.** Only mid-flash edges ever showed, so it read as a starfield with no lattice at all. Current values (`0.16` grid / `0.085` long / `0.42` node) measure **4.84% lit, mean 12.5, max 128+**.

> Sample the canvas with `getImageData` after any change to these constants. "Looks about right" was wrong by roughly 4× and survived three rounds of screenshots.

### 2.2 Hero, the "logit lens" decode
The reference dissolves its headline into particles. Yours **decodes** it. Each word cycles through 3, 4 plausible token candidates in dimmed mono, then locks into the display face as a confidence bar fills to 100%. Runs once, ~1.4s, then it is plain static text. No one else's portfolio does this and it is unambiguously your field.

*Fallback:* SSR renders the final string. Animation is a progressive enhancement over real DOM text, crawlers and no-JS users see the finished headline.

### 2.3 The Lab, receipts, not mock dashboards
The reference shows invented dashboards. You have **actual measured results in public repos**. Each Lab card carries a small live chart of the real metric, gate-sparsity histogram, clustering-stability ARI curve, GRPO reward curve, retrieval precision@k, animated once on scroll-in, with the number counting up. Every card links to the repo, and to a live demo where one exists.

### 2.4 Two-track spine
The reference's spine is AI → Marketing → Revenue, owned by one operator. Yours is **Research → Engineering → Product**, owned by one engineer. The Work list gets a `RESEARCH / SHIPPED / ALL` filter that re-lays out with GSAP FLIP.

### 2.5 The measurement wall, *not* a GitHub proof strip

The original plan here was a contribution heatmap, repo count and language split. **That was wrong and has been cut.**

These are personal research and production builds, not libraries chasing adoption. There are no stars, forks or downloads, and a strip of zeroes only draws a line under their absence. Repo count is the same failure in disguise, it measures volume, not quality. (`56 public repositories` was briefly a hero stat for exactly that reason, and has been removed.)

What the repositories *do* contain is stronger:

| Instead of | Show |
|---|---|
| Stars | `30+` applications across `22` platforms, no human touching a form field |
| Forks | `25,600` tokens, Welford aggregation, split-half stability |
| Downloads | `99.8%` of ablation damage traced to layer 0, bootstrapped CIs |
| Contribution heatmap | `3 hrs` for the full study on a free Colab T4, reproducible from committed `.pkl` files |

Every tile carries a **mandatory** `source` deep link, README anchor, notebook cell, eval file. `Measurement.source` is non-optional in the type, because a number without a receipt does not belong on this page.

> **Operational rule.** The section's headline is "Nothing here is a claim." A dead link inside it disproves the entire page. Source links are checked as part of verification: the UKGC Swagger deployment was linked as "Live API", found dead (no response in 120s, not a cold start), and repointed at the README. Restore it only when the host is genuinely back up.

### 2.6 Method, scope honesty as the differentiator

The most credible artifact across the repositories is the gated-attention findings table, because it carries a **confidence column** and publishes a row graded `low`. Almost nobody scopes their own claims downward voluntarily; to a hiring manager it reads as someone who won't oversell in a design review.

Rendered as a four-segment meter (`high` 4/4 → `low` 1/4, dimmed) it reads at a glance down the column. Paired with:

- **"Every guard is a scar"**, real failures observed while driving live portals, each with the named guard that killed it: `click_verified`, `set_text`, `probe_limits`, `assert_saved`.
- **The principle**, *"A rule an agent must remember will eventually be skipped. A rule that raises will not."*
- **"What this is not"**, limits stated before results.

The `low` row stays. Removing it would make the section look stronger and be worth less.

---

## 3. Tokens

Defined once in `src/app/globals.css`. Nothing in a component may hardcode a hex.

### Surface
| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#08090A` | Page base. Warm-shifted off pure black. |
| `--ink-800` | `#0C0E10` | Raised surface, sticky header fill |
| `--ink-700` | `#121517` | Card fill |
| `--ink-600` | `#1A1E21` | Hairline borders |
| `--ink-500` | `#2A2F34` | Dividers, strong borders |

### Type
| Token | Hex | Use | Contrast on `--ink-900` |
|---|---|---|---|
| `--paper` | `#F4F3F0` | Headlines | 17.9:1 ✅ AAA |
| `--paper-dim` | `#A8AAA6` | Body copy | 8.4:1 ✅ AAA |
| `--paper-faint` | `#6B6E6B` | Micro-labels ≥11px | 3.6:1 ⚠️ decorative/meta only, never body copy |

### Accent, one hue, no exceptions
**Locked: Plasma `#FF3D8B`.** The hot end of an attention heatmap, thematically exact for interpretability work, and nowhere near the reference's orange.

| Token | Hex | Use |
|---|---|---|
| `--accent` | `#FF3D8B` | Headlines-in-accent, numbers, pills, cursor, progress bar, canvas |
| `--accent-dim` | `#C22A69` | Hover / pressed / secondary strokes |
| `--accent-ghost` | `rgb(255 61 139 / 0.08)` | Card washes, lattice traces |
| `--on-accent` | `#08090A` | Text on a filled accent surface |

**Contrast: 5.97:1 on `--ink-900`.** Clears WCAG AA for normal text, and AAA for large. This is lower than a lime (16.8:1) or cyan (11.4:1) would have been, so one constraint follows and is not optional:

> **Accent is never used for paragraph copy.** It is permitted at label size (11px mono, ≥500 weight) and at headline size (≥24px), and for graphical marks. Running body text is always `--paper-dim`. The reference follows the same rule with its orange, accent is used to spike numbers inside a sentence, never to set the sentence.

Alternates, if it ever needs to change, a one-line swap in `globals.css`: Signal Lime `#C8FF3D`, Ion Cyan `#3DE1FF`, Ember `#FF5C1A`.

---

## 4. Typography

The skill's `--design-system` pass proposed Inter + Playfair Display; Playfair as body is wrong for a technical portfolio, so it is overridden. What is kept is the skill's **tri-stack structure** (display / body / mono-label) and its 5:1 H1-to-body ratio rule.

| Role | Face | Weights | Why |
|---|---|---|---|
| Display | **Archivo** | 700, 800 | Closest free grotesque to the reference's heavy display face. Tight apertures, works at `-0.035em`. |
| Body | **Inter** | 400, 500 | Neutral, ships with Next, superb at 15, 17px on dark. |
| Mono / labels | **JetBrains Mono** | 400, 500 | Micro-labels, stats, code, the decode animation, chart axes. |

All three self-hosted via `next/font/google`, zero external requests, zero CLS.

### Scale
| Step | Size | Tracking | Leading | Use |
|---|---|---|---|---|
| Hero | `clamp(2.75rem, 7vw, 6.25rem)` | `-0.04em` | `0.92` | One per page |
| H1 | `clamp(2.25rem, 5vw, 4.25rem)` | `-0.035em` | `0.94` | Section headlines (2 lines max) |
| H2 | `clamp(1.5rem, 2.5vw, 2.25rem)` | `-0.02em` | `1.05` | Card titles, work rows |
| H3 | `1.25rem` | `-0.01em` | `1.2` | Sub-items |
| Body | `clamp(0.9375rem, 0.9rem+0.3vw, 1.0625rem)` | `0` | `1.65` | Max `62ch` |
| Label | `0.6875rem` | `0.18em` | `1.4` | Uppercase mono |

---

## 5. Motion

Presets pulled from the skill's `motion.csv`. Easing is `expo.out` / `cubic-bezier(0.16, 1, 0.3, 1)` throughout.

| Element | Behaviour | Spec |
|---|---|---|
| Section headline | Per-char blur + fade + rise | SplitText chars, `stagger 0.015`, `y 20`, `filter blur(8px)→0`, `expo.out`, `start: 'top 80%'` |
| Body / list items | Fade + 24px rise, staggered | `stagger 0.08`, max 8 children, `power2.out` |
| Work rows | Row lifts, accent fills from left | 250ms `power2.out`, reversed on `mouseleave` |
| Numbers | Count up on enter | Once only, `toggleActions: 'play none none none'` |
| Cursor | Lagging outline ring, scales 1→2.4 over targets | `gsap.quickTo`, 0.4s `elastic.out(1,0.4)`. Desktop + fine-pointer only. |
| Scroll progress | Accent bar, top edge, 2px | `scrub: true` |
| Page scroll | Lenis, `lerp 0.09` | Synced to `ScrollTrigger.update` |
| Track filter | FLIP re-layout | `gsap/Flip`, 500ms |

**Correction to the skill's data:** `motion.csv` states SplitText is a paid GSAP Club plugin. That is out of date, since GSAP 3.13 (May 2025) every plugin including SplitText is free under the standard licence. We are on `gsap@3.15`, so no fallback is needed for licensing reasons. A plain fade fallback is still kept for `prefers-reduced-motion`.

**Hard rules**
- At most **one** pinned section on the page (skill anti-pattern: excessive pinning fights mobile scroll).
- All GSAP inside `useGSAP(..., { scope: ref })` for automatic cleanup.
- `split.revert()` on unmount so screen readers get intact text nodes.
- Every reveal animation animates *from* a visible state, content is never `opacity: 0` in the DOM for crawlers.

---

## 6. Component inventory

```
layout/     Header · ScrollProgress · Footer · CursorRing · SmoothScroll · AttentionField
type/       Eyebrow · DisplayHeading · Lede · Label · Counter
section/    Hero · Spine · Lab · Work · Receipts · Writing · Contact
cards/      LabCard · WorkRow · CredentialRow · TimelineRow · CertBadge
charts/     Sparkline · Histogram · RadialGauge · Heatmap  (hand-rolled SVG, no chart lib)
```

Rationale for hand-rolled SVG charts: four small, static, one-shot visualisations do not justify ~50 kB of Recharts, and the reference's charts are bespoke anyway.

---

## 7. Pre-delivery checklist

Skill checklist, plus project-specific gates:

- [ ] `prefers-reduced-motion` fully respected, canvas off, no SplitText, instant reveals
- [ ] Focus-visible ring on every interactive element
- [ ] `cursor-pointer` on everything clickable; custom ring never hides the native affordance
- [ ] Lucide SVG icons only, no emoji as iconography
- [ ] Responsive at 375 / 768 / 1024 / 1440; no horizontal body scroll at any width
- [ ] Canvas paused off-screen and on `visibilitychange`
- [ ] Lighthouse ≥ 95 across the board; LCP < 2.0s on 4G
- [ ] All content in the DOM without JS (animation is enhancement only)
- [ ] Real `<h1>`, `<h3>` hierarchy; `<nav>`/`<main>`/`<footer>` landmarks
- [ ] `--paper-faint` never used for body copy
- [ ] Type primitives (`t-display`, `t-label`, `t-body`) stay inside `@layer components`, un-layered CSS outranks Tailwind utilities, which silently kills `text-accent` and every `group-hover:` colour on those elements
- [ ] Every `Measurement.source` link resolves 200, a dead link in "Nothing here is a claim" disproves the page
- [ ] OG image, favicon, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema
