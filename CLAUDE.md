# CLAUDE.md

> **Last verified:** 2026-02-11
> **Phase:** Skill Forge deliberation (pre-build)

## Project Overview

Rebuild of edoconnell.org as an Astro + Sanity + Vercel site. This is a portfolio piece — the repo itself demonstrates craftsmanship. Commit history, file structure, and quality infrastructure are all part of what reviewers see.

## Current State

The project is in **pre-build deliberation**. Architecture is being decided via Skill Forge dialogue between ChatGPT (GA), Claude Code (IA), and Ed O'Connell (HO).

- Dialogue log: `dialogues/001-site-rebuild.md` (gitignored — local context only)
- Prior site: `github.com/adambalm/portfolio` (React 19 + Vite, deployed to Vercel)
- Target stack: Astro 5 + Sanity v3 + Vercel + TypeScript

<!-- verified: 2026-02-11 -->

## Architecture

*Populated after Skill Forge Understanding Gate closes.*

<!-- verified: 2026-02-11 — not yet applicable -->

## Commands

*Populated when Astro project is initialized.*

```bash
# After project init, expect:
# npm run dev          — Astro dev server
# npm run build        — production build
# npm run dev:studio   — Sanity Studio
```

<!-- verified: 2026-02-11 — not yet applicable -->

## Sanity Configuration

- **Project:** NEW personal project (NOT SCA project `wesg5rw8`)
- **Dataset:** `production`
- **Tokens:** `.env.local` (never committed)

<!-- verified: 2026-02-11 — project not yet created -->

## Quality Infrastructure

### Pre-commit Hook

A git pre-commit hook warns (non-blocking) when architectural files change without a corresponding CLAUDE.md update. Architectural files include: config files, schema definitions, layout components, package.json, and `.claude/` settings.

**Setup after clone:**
```bash
git config core.hooksPath .githooks
```

This runs automatically via the `prepare` script after `npm install` once the project is initialized.

### Conventions

- **Commit messages:** Imperative mood, concise. Co-author tag for AI-assisted commits.
- **No secrets in repo:** Tokens, passwords, API keys in `.env.local` only.
- **TypeScript:** Strict mode. Typed props for all components.
- **Accessibility:** WCAG AA minimum. Semantic HTML. Keyboard navigable.
- **Performance:** Lighthouse >= 95 across all categories.

<!-- verified: 2026-02-11 -->

## Deliberation Context

This project uses the **Lanesborough Protocol** (Skill Forge pattern) for architectural decisions. The append-only dialogue log at `dialogues/001-site-rebuild.md` contains the full decision history.

**Roles:**
- **HO** (Ed O'Connell): Human orchestrator, owns all gates
- **GA** (ChatGPT): Generalizing Agent — proposes architecture, schemas, design
- **IA** (Claude Code): Inspecting Agent — verifies, tests, implements

**Prior art:** Memento MCP Architecture dialogue (2026-01-01) in the portfolio repo.

If you are an agent starting work in this repo, read the dialogue log first. It contains the agreed architecture, schema decisions, and open questions.

<!-- verified: 2026-02-11 -->

## Cross-Project Context

| Project | Path | Relevance |
|---------|------|-----------|
| portfolio (current site) | `C:/Users/Guest1/dev-sandbox/portfolio/` | Migration source — React 19, 3 interactive demos |
| sca-explainers | `C:/Users/Guest1/dev-sandbox/sca-explainers/` | Solution Architecture brief (writing sample) |
| sca-website | `C:/Users/Guest1/dev-sandbox/sca-website/` | Sanity schema patterns (reference only) |

**Basic Memory:**
- Project context: `memory://continuity/cross-instance/sca-website-context`
- Skill Forge case studies: `memory://case-studies/`
- Voice contract: extracted from prior engagements (see dialogue log)

<!-- verified: 2026-02-11 -->
