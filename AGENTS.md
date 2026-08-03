<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes, APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rajarshi Nandi, portfolio

## Read `HANDOFF.md` first

It has the goal, the current state, everything already tried and rejected, and what is outstanding. Do not re-derive it. `DESIGN.md` has the visual system.

`PLAN.md` and `CONTENT-BRIEF.md` are early planning documents and are partly stale. Trust `HANDOFF.md` where they disagree.

## Non-negotiables

1. **No em dashes or en dashes anywhere.** Commas, colons, full stops. His CV pipeline enforces the same rule, so it is a standing convention. 159 were purged once; do not reintroduce them.
2. **Bullets, not paragraphs**, in project and experience blocks. Prose belongs in the README, which every block links to.
3. **No hardcoded colours.** Tokens live in `src/app/globals.css`.
4. **Accent budget: roughly one accent element per screenful.** Numbers earn it. Pills, bullet markers and date rails do not. Ignoring this is what made the page read as "AI slop".
5. **Never invent a number.** If it is not in a repo, a README, or something he sent, it does not ship. A rendered `TODO` is worse than a smaller true number.
6. **Honour the profile guardrails** documented at the top of `src/content/experience.ts`. They exist because he was careful about defensibility and the site must not undo that.
7. **Never put personal data on the site.** The source profile contains NI number, DOB, address, visa status, salary, health and equality data, and referee contacts. None of it is imported and none of it should be.
8. **Animation is enhancement, never structure.** Every string readable without JS. Nothing starts at `opacity: 0` in server-rendered markup. `prefers-reduced-motion` fully honoured, read *synchronously* (see `use-reduced-motion.ts` for why).
9. **All GSAP inside `useGSAP(..., { scope: ref })`.** `split.revert()` on unmount.
10. **`featured: true` in `projects.ts` means "has a hand-written flagship block".** Setting it before the block exists *deletes* the project from the site, because `Work` renders everything unfeatured.

## Traps that have already cost time

- **Type primitives must stay inside `@layer components`.** Un-layered CSS outranks Tailwind utilities, which silently kills `text-accent` and every `group-hover:` colour on `t-display` / `t-label`.
- **Tailwind v4 `scale-*` emits the standalone `scale` property**, which composes with rather than overrides an inline `transform`.
- **Canvas colour strings:** `rgb(r g b / a)` with spaces. Commas plus slash-alpha is invalid CSS and canvas silently keeps the previous style, so it renders black on black.
- **Turbopack cannot serialise imported MDX plugin functions.** Name them as strings.
- **Verify with Playwright, not the Chrome extension.** Several "the page is frozen" and "the element is invisible" alarms were tooling artifacts. CDP disagreed every time.
- **Tune the canvas by sampling `getImageData`, never by eye.** It shipped invisible for three rounds at 1.22% lit pixels.

## Skills

`ui-ux-pro-max` at `.agents/skills/`, symlinked into `.claude/skills/`:

```bash
npm run design -- "<query>" --domain gsap|typography|color|ux|landing|style --stack nextjs
```

**`dataviz` is mandatory before shipping any chart palette.** Run its validator; do not reason about colour. Validated already: `#E82D77` + `#2AA0D0` for two series, plus `#B08A00` for three.

## Stack

Next.js 16 App Router · TypeScript · Tailwind v4 (`@theme` in CSS, no JS config) · GSAP 3.15 with ScrollTrigger/SplitText/Flip · Lenis · Lucide · MDX. Charts are hand-rolled SVG and canvas; do not add a chart library.

## Commands

```
npm run dev                     # localhost:3000
npm run typecheck
CONTENT_DRAFT=1 npm run build   # bypasses the placeholder gate
npm run build                   # fails on any surviving TODO(rajarshi)
npm run design -- ...           # query the design DB
```
