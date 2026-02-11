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

### CI Pipeline (`.github/workflows/ci.yml`)

Three-job pipeline that activates automatically when the project is initialized:

1. **build** — `npm ci`, TypeScript check, `astro build`, lint
2. **accessibility** — Playwright + axe-core a11y audit against built pages
3. **lighthouse** — Lighthouse CI with threshold enforcement (>= 95 all categories)

All jobs gracefully skip if `package.json` doesn't exist yet. The workflow is committed before the project so the quality floor is established from the first line of application code.

### Self-Review Practice (Articulation Gate for Code)

Before any deployment or PR, the implementing agent runs this checklist. This is not optional — it is the code equivalent of the Lanesborough articulation gate. The agent must be able to affirm each item, not just check a box.

**Structure & Craft:**
- [ ] Does the Astro component architecture demonstrate real Astro expertise? (Not just HTML in `.astro` files)
- [ ] Are React islands used only where client-side interactivity is genuinely needed?
- [ ] Are all component props typed with TypeScript?
- [ ] Is the component tree shallow and readable, or is it over-abstracted?

**Voice & Editorial:**
- [ ] Read every prose sentence aloud. Does it sound like Ed, or does it sound like a LinkedIn bio?
- [ ] No passion declarations, no consultant-speak, no generic sentences.
- [ ] The test: could this sentence appear on 10,000 other websites? If yes, rewrite or delete.

**Accessibility & Performance:**
- [ ] Semantic HTML: proper heading hierarchy, landmarks, button vs link distinction.
- [ ] Keyboard navigable: every interactive element reachable and operable via keyboard.
- [ ] Visible focus indicators on all focusable elements.
- [ ] `prefers-reduced-motion` respected for any animations.
- [ ] Lighthouse >= 95 across Performance, Accessibility, Best Practices, SEO.

**Security & Hygiene:**
- [ ] No secrets, tokens, or passwords in committed code.
- [ ] No employer-identifying information (institution names, internal references).
- [ ] CLAUDE.md updated if any architectural files changed.
- [ ] Commit message is imperative, concise, and accurate.

**The Medium Is the Message:**
- [ ] Would a technical reviewer learn something about Astro by reading this code?
- [ ] Would a hiring manager at a CMS or developer tools company see evidence of structured content thinking?
- [ ] Does the commit history tell a coherent story of professional engineering?

### Conventions

- **Commit messages:** Imperative mood, concise. Co-author tag for AI-assisted commits.
- **No secrets in repo:** Tokens, passwords, API keys in `.env.local` only.
- **TypeScript:** Strict mode. Typed props for all components.
- **Accessibility:** WCAG AA minimum. Semantic HTML. Keyboard navigable.
- **Performance:** Lighthouse >= 95 across all categories.
- **Commit history:** Each commit is self-contained and functional at the time it's made. No placeholder files. No "will fix later" commits. The history is part of the portfolio.

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
