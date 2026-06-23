# edoconnell.org

Astro 5, Sanity v3, Vercel. Server-rendered content pages, statically prerendered indexes, and a dependency-free interactive systems explainer. Embedded Sanity Studio with visual editing via the Presentation Tool.

The Sanity content model carries epistemic governance fields — provenance, confidence scores, publication readiness — so content tracks not just *what* it says but *who* produced it, *how*, and *at what confidence level*. These fields are queryable structured data, drawn from a content architecture used in production elsewhere.

## The Governed Fleet

`/governed-fleet/` is an interactive explainer — *"Institutional Cognition: A Governed AI Fleet."* It is **dependency-free**: no React, no CDN, no build step for the interactive parts — three small vanilla-JS widgets rendered into a prerendered Astro page, styled entirely with the site's design tokens (so it inherits dark mode and brand automatically).

**Fleet map** — three machines, one shared version-pinned memory; select a node to see its role, OS, and capabilities. Machine *identifiers* are deliberately generic (role-based, not hostnames); hardware and OS are shown.

**Decision-flow stepper** — walks a real decision through the governance protocol. The interesting part is that it *gates*: the "Next" control is genuinely disabled until a verification receipt is attached, and again until a human approves. The gates are the point — a proposal is inert without a verified receipt, and nothing irreversible happens without the human click.

**Claim-validity stepper** — advances a claim through `trusted → aging → superseded`, showing machine-readable staleness metadata (when a fact was last verified, whether it is current, what replaced it).

The page is honest about what is *not yet built*, and supersedes the site's earlier interactive demos (Context Sage, Skill Forge) — their lineage is noted in the page itself.

### Sanity-managed metadata, code-owned widgets

The page's SEO/meta is CMS-manageable through the existing `page` content type: it reads an optional `page-governed-fleet` document and falls back to hardcoded copy when that document is absent. The interactive widgets stay in code (like the case-study pages) — they are behavior, not editable prose.

## Structured Content Engineering

### The Query Layer

All data flows through `src/sanity/lib/load-query.ts` — a wrapper that negotiates between two modes:

- **Visual editing on:** `previewDrafts` perspective, stega encoding, source maps, authenticated fetch with read token
- **Visual editing off:** `published` perspective, CDN-backed, no token needed

Every page template calls `loadQuery<T>()` with a typed GROQ query. The wrapper handles perspective, stega, and token logic so page templates don't repeat it.

### Content Model

Three document types, two reusable objects:

| Type | Purpose |
|------|---------|
| `article` | Long-form content — briefs, essays, case studies. Portable Text body + appendix, Shiki code highlighting |
| `page` | Freeform pages (home, governed-fleet) addressed by document ID |
| `siteSettings` | Singleton — site title, global SEO, the `noindex` flag |
| `provenance` | Reusable object: author, generating agent, reviewer, context, confidence score (0–1) |
| `seo` | Reusable object: meta title, description, OG image with asset reference expansion |

The `provenance` object tracks *who* made the content (human or AI), *who* reviewed it, and a self-reported `confidenceScore` from the generating agent. An `article` also carries `epistemicStatus` (draft → working → reviewed → canonical → superseded → deprecated → archived) and `supersededBy` as a typed reference to its replacement.

### AI Discoverability

Content pages emit JSON-LD structured data (`schema.org/Article` for articles) with headline, description, author, datePublished, and image. SSR means the full content is in the HTML source — no JS execution required. OG images are vector-rendered via Satori at 2x retina resolution.

### Rendering Strategy

Index pages (`/`, `/articles/`) and the `/governed-fleet/` explainer export `prerender = true` — built once, served from CDN. Content detail pages (`/articles/[slug]`) are SSR — a `loadQuery` call on every request, so edits in the Studio appear immediately without a rebuild. The tradeoff is explicit: prerendered pages are fast and cheap; detail pages are fresh and slightly slower.

## Why Epistemic Governance

This site mixes AI-assisted content with human-authored content. The epistemic governance fields are an experiment in making that mixture legible: every article carries metadata about who wrote it, whether an AI helped, and where the content sits in a lifecycle from `draft` to `canonical` to `archived`. The `supersededBy` reference field lets a deprecated article point to its replacement.

## Design System

CSS custom properties throughout — no utility classes, no CSS-in-JS. Typography on a major-third scale (1.25 ratio). Three font stacks: Source Serif 4 for prose, Inter for UI, JetBrains Mono for code. Dark mode via `data-theme` attribute with `prefers-color-scheme` fallback. `prefers-reduced-motion` respected globally. Skip link, visible focus indicators, `65ch` measure constraint for readability.

See `src/styles/global.css` for the full token set.

## Tour of the Repository

**Interactive work:**
- `src/pages/governed-fleet/index.astro` — dependency-free interactive explainer; three vanilla-JS widgets with real gating, themed via design tokens, machine identifiers redacted

**Best Astro/Sanity integration:**
- `src/sanity/lib/load-query.ts` — dual-mode fetch wrapper (does a lot in a few lines)
- `src/layouts/BaseLayout.astro` — module-cached siteSettings fetch, SEO/OG/JSON-LD assembly, theme bootstrap

**Content architecture decisions:**
- `src/sanity/schemas/objects/provenance.ts` — authorship, confidence, and review tracking
- `src/sanity/schemas/article.ts` — full lifecycle status with supersession references

**Accessibility & polish:**
- `src/components/InlineTOC.astro` — extracts headings from Portable Text, generates navigation, stega-cleans before slugifying
- `src/components/ReadingProgress.astro` — GPU-accelerated scroll indicator with `requestAnimationFrame` throttling
- `src/components/Code.astro` — Shiki highlighting in a keyboard-focusable scroll region

**Security:**
- `scripts/security-gate.sh` — deterministic PII / infra / secret denylist scanner; the publish gate

**Infrastructure:**
- `.github/workflows/ci.yml` — build + typecheck, Playwright accessibility, Lighthouse audits
- `playwright.config.ts` — analytics suppression via `storageState`, dynamic content discovery

## Quality

CI enforces on every push: TypeScript check, production build, Playwright accessibility tests, Lighthouse audits (>= 95 accessibility and best practices). A pre-commit hook warns when architectural files change without documentation updates. `scripts/security-gate.sh` scans for PII, infrastructure identifiers, and secrets.

## Stack

- [Astro 5](https://astro.build) — SSR + static prerendering + island architecture
- [Sanity v3](https://www.sanity.io) — structured content, embedded Studio, visual editing via Presentation Tool
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
bash scripts/security-gate.sh   # PII / infra / secret scan
```

Sanity Studio is embedded in the Astro app — no separate process needed.

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
