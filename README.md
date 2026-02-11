# edoconnell.org

Personal site — under active development.

## Stack

- [Astro](https://astro.build) — static site generator with island architecture
- [Sanity](https://www.sanity.io) — structured content CMS
- [Vercel](https://vercel.com) — deployment
- TypeScript throughout

## Setup

```bash
git clone https://github.com/adambalm/edoconnell-site.git
cd edoconnell-site
npm install
```

The `prepare` script activates git hooks automatically after install.

## Development

```bash
npm run dev          # Astro dev server
npm run dev:studio   # Sanity Studio
npm run build        # Production build
npm run typecheck    # TypeScript validation
```

## Quality

CI runs on every push: build, TypeScript check, Playwright accessibility tests, and Lighthouse performance audits. Thresholds are enforced — Lighthouse >= 95 across all four categories.

A pre-commit hook warns when architectural files change without corresponding documentation updates.

## Documentation

- `AGENTS.md` — architecture and standards reference for AI tooling
- `CLAUDE.md` — operational context for Claude Code
