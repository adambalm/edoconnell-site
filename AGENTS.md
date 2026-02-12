# AGENTS.md

> Context for AI agents working with or evaluating this codebase.
> Last verified: 2026-02-11

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

*This section is populated when the project is initialized. Currently in pre-build deliberation.*

Key architectural decisions are documented in the commit history and (locally) in the deliberation log.

<!-- verified: 2026-02-11 — pre-build phase -->

## Content Model

*This section is populated when Sanity schemas are created.*

Design principle: content as infrastructure, not content as pages. A "program" or "demo" is a data object with typed fields and relationships — rendered as a web page, consumed by an API, or queried by an AI agent. The schema models relationships (references, not just strings), enabling traversal and discovery.

<!-- verified: 2026-02-11 — pre-build phase -->

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
.github/workflows/    CI pipeline
.githooks/            Git hooks (pre-commit doc freshness check)
src/
  layouts/            Astro layout components
  pages/              Astro page routes
  components/         Reusable Astro + React components
  content/            Astro content collections (structured markdown/MDX)
  sanity/
    schemas/          Sanity document and object type definitions
    lib/              GROQ queries and Sanity client config
  styles/             Design tokens and global styles
```

*Updated as directories are created.*

<!-- verified: 2026-02-11 — pre-build phase -->

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
