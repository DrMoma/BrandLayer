# Brand Layer

Product studio site. Next.js 16 · React 19 · Tailwind v4 · TypeScript.

```bash
npm run dev              # http://localhost:3000
npm run build && npm start
npm run typecheck
npm run check:contrast   # WCAG AA, both themes
npm run check:slots      # fails while placeholder slots remain — run before deploying
```

---

## The one rule

The mark is two planes in **2:1 isometric space**. Every edge runs at
`atan(0.5) = 26.565°`, and the two planes sit exactly one third of a plane's
thickness apart.

That angle is the constant. It governs the intro trajectories, the curtain
wipe, the mobile menu icon, and the capability cards — which step **18px across
for every 9px down** as they stack. If you add something that shears, rotates or
offsets, use 26.565° and 2:1. Nothing else.

---

## Design tokens — `app/globals.css`

Two layers, and components only ever touch the second:

- **Static palette** — `--color-grey-*`, `--color-violet-*`, spacing, radii, easings.
- **Semantic tokens** — `--bg-default`, `--text-default`, `--stroke-soft`, `--accent`…

The semantic tokens are registered with `@property` as `<color>` and carry a
transition on `:root`. That is what makes the whole site crossfade between light
and dark over 1.125s from a **single attribute write** — no per-element
transitions, nothing left behind mid-scroll.

```html
<section data-band="dark"> … </section>
```

`ThemeBands` watches which band owns the viewport's centre line and sets
`<html data-theme>`. That is the entire mechanism.

**Layout scale is a clean 2× step** from mobile to desktop — 6→12 columns,
4→8px gutter, 12→24px margin, 70→140px section spacing, 1440px canvas.

Media is **never** rounded. Cards are 32px, buttons are pills, media is 0.

---

## Motion

Everything ships in its **resting** state and is knocked into its start state
only once `.motion-ready` lands on `<html>`. If JS fails, the page is readable
rather than a screen of invisible elements.

One `IntersectionObserver` for the whole page (`lib/inview.ts`). It sets
`data-inview="true"` once and unobserves. CSS does the rest.

> **The clip-path trap.** A curtain's `clip-path: inset(100%)` zeroes its own
> intersection rectangle, so an element that clips *itself* reports
> `isIntersecting: false` forever and can never trigger its own reveal. The clip
> therefore lives on `.curtain-window`, a child of the observed element.
> `Reveal` builds that structure for you — don't hand-roll it.

The observer is **gated** so the intro can hold it closed; it opens at 820ms so
the hero reveals while the curtain is still lifting, instead of finishing
unseen behind it.

`prefers-reduced-motion: reduce` disables every transform, clip and marquee,
and the intro collapses to a 200ms fade.

---

## Content — `content/`

Typed TS, shaped so a CMS can slot in later without touching components.

| file | holds |
|---|---|
| `site.ts` | facts — all true and verifiable |
| `work.ts` | case studies, with `SLOT()` placeholders |
| `capabilities.ts`, `process.ts`, `cv.ts` | copy |
| `media.ts` | **the single swap point for every asset** |

### Placeholder slots

Case studies ship with every client name, metric and quote as
`SLOT("CLIENT NAME")`, which renders as a visible dotted `[ CLIENT NAME ]`. The
structure is finished; the facts are not.

Replace the slot with a real string and the components adapt on their own —
`Counter` starts animating real numbers, quotes attribute properly. **Run
`npm run check:slots` before any deploy**; it exits non-zero while any remain.

---

## Media

Every slot ships as `procedural` — the `LayerField` canvas, an extruded
isometric terrain built from the mark's own geometry. Nothing is downloaded,
nothing needs attribution, nothing can be taken down, and it cannot look
templated because nobody else has this field.

To use real footage, change one entry in `content/media.ts`. See
[MEDIA.md](./MEDIA.md).

---

## Structure

```
app/            routes · globals.css · sitemap · robots · icons · OG image
components/
  chrome/       Lockup · Header · CommandBar · ThemeBands · IntroSequence · Cursor
  motion/       Reveal · LineReveal · FitText · Counter · Marquee · LayerField
  blocks/       Hero · Statement · CapabilityStack · WorkMosaic · FooterHero · …
  case/         CaseParts
content/        site · work · capabilities · process · cv · media
lib/            inview · search · cn
scripts/        check-slots · check-contrast
```

---

## Before launch

- [ ] Fill the slots — `npm run check:slots` must pass
- [ ] Redraw the logo as clean SVG (the supplied PNGs carry a white halo)
- [ ] Confirm the Cal.com slug in `content/site.ts`
- [ ] Have a lawyer read `/privacy` and `/legal` — they are drafts, not advice
- [ ] Point `site.url` at the production domain
