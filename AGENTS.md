<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rajarshi Nandi — Portfolio

Personal portfolio for an AI engineer / interpretability researcher. Design inspiration: <https://jeffbrokaw.com>. Concept: **"The Attention Field"**.

**Read `DESIGN.md` before touching anything visual. Read `PLAN.md` for the section map.**

## Non-negotiables

1. **No hardcoded colours.** Every colour is a token in `src/app/globals.css`. The whole identity swings off `--accent`.
2. **One accent hue.** The reference's discipline is a single hot colour on near-black. A second hue breaks it.
3. **Content lives in `src/content/*.ts`.** Never inline copy into a component. `npm run check:content` fails the build on surviving `TODO(rajarshi)` markers.
4. **Animation is enhancement, never structure.** Every string is in the DOM and readable before JS runs. Nothing starts at `opacity: 0` in server-rendered markup.
5. **`prefers-reduced-motion` is honoured completely** — canvas off, no SplitText, instant reveals.
6. **All GSAP inside `useGSAP(..., { scope: ref })`** for automatic cleanup. `split.revert()` on unmount.
7. **At most one pinned ScrollTrigger section** on the page.
8. **Lucide SVG icons only.** Never emoji as iconography.

## Design skill

`ui-ux-pro-max` is installed at `.agents/skills/ui-ux-pro-max`, symlinked into `.claude/skills`. Query it before making design decisions:

```powershell
npm run design -- "<query>" --domain gsap|typography|color|ux|landing|style --stack nextjs
```

Two of its recommendations are deliberately overridden — see `DESIGN.md §4` (its Playfair-as-body pairing is wrong for a technical site) and `DESIGN.md §5` (its `motion.csv` claims SplitText is a paid plugin; that has been untrue since GSAP 3.13).

## Stack

Next.js 16 App Router · TypeScript · Tailwind v4 (`@theme` in CSS, no JS config) · GSAP 3.15 + ScrollTrigger/SplitText/Flip · Lenis · Lucide. Charts are hand-rolled SVG — do not add a chart library for four small one-shot visualisations.

## Commands

```
npm run dev            # dev server
npm run build          # check:content + next build
npm run typecheck      # tsc --noEmit
npm run check:content  # placeholder audit (CONTENT_DRAFT=1 to bypass)
npm run design -- ...  # query the ui-ux-pro-max design DB
```
