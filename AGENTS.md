# AGENTS.md

> Context for AI agents working with or evaluating this codebase.
> Last verified: 2026-02-12

## Project

edoconnell.org — personal site for Ed O'Connell. Astro frontend, Sanity CMS, deployed on Vercel.

The site serves as both a personal presence and a portfolio of working systems. Interactive demos, writing samples, and project documentation live here as structured content — authored once, queryable via API, rendered through components.

<!-- verified: 2026-02-11 -->

## Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Frontend | Astro 5 + TypeScript | Static site generation with island architecture |
| CMS | Sanity v3 | Structured content — schemas, GROQ queries, Studio |
| Hosting | Vercel | Deployment, preview URLs, edge functions |
| Interactive | React 19 | Client-side islands for stateful demos |
| Testing | Playwright + axe-core | Accessibility and integration testing |
| CI | GitHub Actions | Build, typecheck, accessibility, Lighthouse |

<!-- verified: 2026-02-11 -->

## Architecture

Single Astro 5 project with embedded Sanity Studio at `/admin`. Static output deployed to Vercel.

```
astro.config.mjs         Astro + Sanity + React + Vercel integrations
sanity.config.ts         Studio config (schemas, plugins)
src/
  layouts/BaseLayout     Semantic HTML shell: header, main, footer, skip-link, noindex
  pages/                 Astro routes — each page fetches via GROQ
  sanity/schemas/        Sanity document + object type definitions
  styles/global.css      Design tokens (typography scale, spacing, colors)
```

Content flows: **Sanity → GROQ → Astro → static HTML**. React islands hydrate only for interactive demos.

<!-- verified: 2026-02-12 -->

## Content Model

Design principle: content as infrastructure, not content as pages. Each document type is a data object with typed fields — rendered as a web page, consumed by an API, or queried by an AI agent.

| Document Type | Purpose | Key Fields |
|---------------|---------|------------|
| `demoItem` | Interactive demonstration | framing (Portable Text), renderMode (ISLAND/STATIC/EXTERNAL), componentName, epistemicStatus, audienceContext, publicationReadiness, provenance |
| `article` | Long-form authored content | kind (brief/essay/case-study), body + appendix (Portable Text), epistemicStatus, audienceContext, publicationReadiness, provenance |
| `page` | General content page | body (Portable Text), seo |
| `siteSettings` | Global config (singleton) | siteTitle, noindex toggle, default seo |

Shared objects: `seo` (metaTitle, metaDescription, ogImage) and `provenance` (author, generatedBy, reviewedBy, context, date).

**Epistemic governance fields** appear on content types that carry editorial weight. They track *who* produced the content, *what status* it has, and *who it's for* — not as decoration but as queryable structured data.

<!-- verified: 2026-02-12 -->

## Quality Standards

| Standard | Threshold | Enforcement |
|----------|-----------|-------------|
| TypeScript | Strict mode, typed props | CI: `astro check` |
| Lighthouse Performance | >= 95 | CI: Lighthouse CI |
| Lighthouse Accessibility | >= 95 | CI: Lighthouse CI |
| Lighthouse Best Practices | >= 95 | CI: Lighthouse CI |
| Lighthouse SEO | >= 95 | CI: Lighthouse CI |
| Accessibility | WCAG AA | CI: Playwright + axe-core |
| Documentation freshness | Pre-commit warning | Hook: `.githooks/pre-commit` |

<!-- verified: 2026-02-11 -->

## Key Patterns

- **Island architecture**: Static HTML pages with targeted React hydration. Interactive components use `client:load`, `client:visible`, or `client:idle` based on interaction requirements. No unnecessary client-side JavaScript.
- **Structured content**: All content authored in Sanity, queried via GROQ, rendered through typed Astro components. Content is not embedded in page templates.
- **Epistemic governance**: AI-generated and AI-assisted content carries provenance metadata — what agent produced it, when, in what context, with what epistemic status.
- **Accessibility-first**: Semantic HTML, heading hierarchy, landmark regions, keyboard navigation, visible focus, reduced motion support. Not retrofitted — built in.

<!-- verified: 2026-02-11 -->

## File Structure

```
.github/workflows/    CI pipeline (build, a11y, Lighthouse)
.githooks/            Git hooks (pre-commit doc freshness check)
public/               Static assets (favicon)
src/
  layouts/            Astro layout components (BaseLayout)
  pages/              Astro page routes (index, demos/)
  sanity/
    schemas/          Sanity document and object type definitions
      objects/        Shared object types (seo, provenance)
  styles/             Design tokens and global CSS
docs/                 Project documentation (voice profile)
```

<!-- verified: 2026-02-12 -->

## Documentation Map

| File | Audience | Purpose |
|------|----------|---------|
| `README.md` | Humans | Project description, setup, usage |
| `AGENTS.md` | AI agents | Architecture, standards, navigation (this file) |
| `CLAUDE.md` | Claude Code | Operational context, commands, deliberation state |
| `docs/voice-profile.md` | Any prose-generating agent | Ed O'Connell's writing style properties — living document |

All three root docs are maintained in sync. A pre-commit hook warns when architectural files change without corresponding documentation updates.

## Design Principles

- **Fractal quality**: Deep inspection should reveal deeper levels of quality. Semantic HTML, proper CSS inheritance, AI-readable structured data.
- **AI readiness**: The site is designed to interact well with agents — structured content, semantic markup, machine-parseable metadata.
- **noindex until authorized**: All pages carry `<meta name="robots" content="noindex">` during development.
- **Anti-salience**: The build process resists premature optimization for impressiveness. Coherence with the whole structure takes priority over local flair.

<!-- verified: 2026-02-11 -->

## Governing Protocols

This project operates under the protocol stack defined in Basic Memory at `memory://BOOTSTRAP`. Key protocols:

| Protocol | Purpose | Location (Basic Memory) |
|----------|---------|------------------------|
| Black Flag Protocol | Epistemic hygiene — confidence levels, citation, no fabrication | `protocols/Black Flag Protocol.md` |
| Lanesborough Protocol | Multi-agent collaboration — visible debate, HO decision logging | `protocols/Lanesborough Protocol.md` |
| Temporal Validity Protocol | Document lifecycle — status, supersession, staleness | `protocols/Temporal Validity Protocol.md` |
| LCE (Language-Constrained Execution) | Formal FSM, PRT with provenance, gate structure | `patterns/LCE-Lanesborough Mapping.md` |
| Skill Forge Pattern | Two deliverables per engagement — work product + extracted skills | `patterns/LCE-Skill Forge Mapping.md` |

All protocols are stored in Basic Memory and referenced via MCP. Agents should `build_context` with `memory://BOOTSTRAP` at session start.

<!-- verified: 2026-02-11 -->
