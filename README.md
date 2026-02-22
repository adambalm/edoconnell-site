# edoconnell.org

Astro 5, Sanity v3, Vercel. Server-rendered content pages, statically prerendered indexes, React islands for interactive demos. Embedded Studio at `/admin` with visual editing via the Presentation Tool.

The Sanity content model carries epistemic governance fields — provenance, confidence scores, publication readiness — so content tracks not just *what* it says but *who* produced it, *how*, and *at what confidence level*. These fields are queryable structured data, drawn from a content architecture used in production elsewhere.

## Interactive Demos

Three React islands hydrate inside Astro's static shell. Each is a `client:load` component selected at render time by a CMS-controlled `renderMode` field — the Sanity schema controls which component loads, and the Astro template branches on that value.

**Skill Forge Visualizer** — The most complex component (~500+ lines, ~20 subcomponents). Visualizes a multi-agent deliberation process with swimlane diagrams, gate status indicators, cost-benefit SVG curves, and a Swiss Cheese verification model. Trilingual (EN/ES/ZH). Includes a `RewordGate` component — a text input with a 50-character minimum before a gate can close. Uses KaTeX for mathematical notation with graceful fallback.

**Context Sage** — Visualizes governed multi-agent collaboration. ASCII swimlane diagrams showing three-role deliberation flow (Human Orchestrator, Generalizing Agent, Inspecting Agent). Case study cards with counterfactual analysis. Trilingual content with language toggle. The data structure is baked into the component (~400 lines of structured content) rather than fetched — this is intentional, since the demo *is* the content.

**Memento** — Demonstrates browser session capture and LLM-based classification. Renders real session data (27 tabs from a single session), category distribution bars, NLP extraction results, and expandable technical deep-dives. Shows the gap between "what tabs were open" and "what was actually happening" — the classification layer is the point.

### How Islands Work Here

The routing logic in `src/pages/demos/[slug].astro` is worth reading. Sanity's `demoItem` schema has a `renderMode` enum (`ISLAND`, `STATIC`, `EXTERNAL`) with cross-field validation: `ISLAND` requires a `componentName`, `EXTERNAL` requires a URL. The Astro template strips stega encoding from logic fields via `stegaClean()` before branching — display fields keep their encoding so visual editing overlays still work. The distinction between logic fields and display fields matters when stega is involved.

```astro
// Fields used in conditionals must be cleaned
const renderMode = stegaClean(demo.renderMode)
const componentName = stegaClean(demo.componentName)
// But demo.title, demo.summary are NOT cleaned — stega enables click-to-edit
```

## Structured Content Engineering

### The Query Layer

All data flows through `src/sanity/lib/load-query.ts` — a 43-line wrapper that negotiates between two modes:

- **Visual editing on:** `previewDrafts` perspective, stega encoding, source maps, authenticated fetch with read token
- **Visual editing off:** `published` perspective, CDN-backed, no token needed

Every page template calls `loadQuery<T>()` with a typed GROQ query. The wrapper handles perspective, stega, and token logic so page templates don't repeat it.

### Content Model

Four document types, two reusable objects:

| Type | Purpose |
|------|---------|
| `article` | Long-form content — briefs, essays, case studies. Portable Text body + appendix, Shiki code highlighting |
| `demoItem` | Interactive demonstrations with render mode control and cross-field validation |
| `page` | Freeform pages (home, demos index) addressed by document ID |
| `siteSettings` | Singleton — site title, global SEO, the `noindex` flag |
| `provenance` | Reusable object: author, generating agent, reviewer, context, confidence score (0–1) |
| `seo` | Reusable object: meta title, description, OG image with asset reference expansion |

The `provenance` object tracks *who* made the content (human or AI), *who* reviewed it, and a self-reported `confidenceScore` from the generating agent. An `article` also carries `epistemicStatus` (draft → working → reviewed → canonical → superseded → deprecated → archived) and `supersededBy` as a typed reference to its replacement. Whether anything downstream actually consumes these fields is a separate question — for now they're an experiment in making content self-describing.

### Rendering Strategy

Index pages (`/`, `/articles/`, `/demos/`) export `prerender = true` — built once, served from CDN. Content detail pages (`/articles/[slug]`, `/demos/[slug]`) are SSR — a `loadQuery` call on every request, so edits in the Studio appear immediately without a rebuild. The tradeoff is explicit: indexes are fast and cheap; detail pages are fresh and slightly slower.

## Why Epistemic Governance

This site mixes AI-assisted content with human-authored content. The epistemic governance fields are an experiment in making that mixture legible: every article and demo carries metadata about who wrote it, whether an AI helped, and where the content sits in a lifecycle from `draft` to `canonical` to `archived`.

The `DemoMeta` and `ArticleMeta` components render these fields in the UI. The `supersededBy` reference field lets a deprecated article point to its replacement. Whether this is useful at the scale of a personal portfolio is an open question — the hypothesis is that the pattern becomes more valuable as content accumulates and ages.

## Design System

CSS custom properties throughout — no utility classes, no CSS-in-JS. Typography on a major-third scale (1.25 ratio). Three font stacks: Georgia for prose, Inter for UI, JetBrains Mono for code. Dark mode via `data-theme` attribute with `prefers-color-scheme` fallback. `prefers-reduced-motion` respected globally. Skip link, visible focus indicators, `65ch` measure constraint for readability.

See `src/styles/global.css` for the full token set.

## Tour of the Repository

**Best React work:**
- `src/components/demos/SkillForgeVisualizer.tsx` — Complex stateful visualization with ~20 subcomponents, i18n, KaTeX math, SVG charts, accessibility (44px touch targets, skip links, ARIA labels)
- `src/components/demos/MementoDemo.tsx` — Data-rich UI with expandable accordions, category distribution bars, tab-based navigation

**Best Astro/Sanity integration:**
- `src/pages/demos/[slug].astro` — CMS-controlled hydration strategy, stega-aware field handling, typed GROQ queries
- `src/sanity/lib/load-query.ts` — Dual-mode fetch wrapper (43 lines, does a lot)
- `src/sanity/schemas/demoItem.ts` — Cross-field validation, conditional field visibility, render mode enum

**Content architecture decisions:**
- `src/sanity/schemas/objects/provenance.ts` — Authorship, confidence, and review tracking
- `src/sanity/schemas/article.ts` — Full lifecycle status with supersession references

**Accessibility & polish:**
- `src/components/InlineTOC.astro` — Extracts headings from Portable Text, generates navigation, stega-cleans before slugifying
- `src/components/ReadingProgress.astro` — GPU-accelerated scroll indicator with `requestAnimationFrame` throttling
- `tests/interactions.spec.ts` — 42+ Playwright tests: navigation, mobile menu, theme toggle, hydration verification

**Infrastructure:**
- `.github/workflows/ci.yml` — Three-job pipeline: build + typecheck, Playwright accessibility, Lighthouse audits
- `playwright.config.ts` — Analytics suppression via `storageState`, dynamic content discovery

## Quality

CI enforces on every push: TypeScript check, production build, 42+ Playwright accessibility tests, Lighthouse audits (>= 95 accessibility and best practices). A pre-commit hook warns when architectural files change without documentation updates.

## Stack

- [Astro 5](https://astro.build) — SSR + static prerendering + island architecture
- [Sanity v3](https://www.sanity.io) — structured content, embedded Studio, visual editing via Presentation Tool
- [React 19](https://react.dev) — interactive demo islands only (not the page shell)
- [Vercel](https://vercel.com) — deployment, web analytics
- TypeScript, Playwright, Lighthouse CI

---

## Development

<details>
<summary>Local setup and scripts</summary>

### Setup

```bash
git clone https://github.com/adambalm/edoconnell-site.git
cd edoconnell-site
npm install
```

The `prepare` script configures git hooks automatically.

Copy `.env.local.example` to `.env.local` and add credentials. The site builds with fallbacks if Sanity is unreachable.

### Commands

```bash
npm run dev          # Astro dev server (localhost:4321)
npm run build        # Production build (SSR + static)
npm run typecheck    # TypeScript validation
```

Sanity Studio is embedded at `/admin` — no separate process needed.

### Scripts

- `scripts/seed.mjs` — seed Sanity dataset
- `scripts/patch-sa-brief-v2.mjs` — editorial patches via Portable Text (workaround for [agent-toolkit #20](https://github.com/sanity-io/agent-toolkit/issues/20))

### CI Thresholds

| Metric | Threshold | Mode |
|--------|-----------|------|
| Accessibility | >= 95 | Error |
| Best Practices | >= 95 | Error |
| Performance | >= 90 | Warn |
| SEO | >= 50 | Warn (intentional `noindex`) |

</details>

## Documentation

- `AGENTS.md` — architecture and standards for AI agents
- `CLAUDE.md` — operational context for Claude Code
- `CONTRIBUTORS.md` — human and AI contributor credits
- `docs/voice-profile.md` — editorial voice properties for prose-generating agents
