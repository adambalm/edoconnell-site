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

### Sanity

Copy `.env.local.example` to `.env.local` and add your Sanity project ID:

```bash
cp .env.local.example .env.local
```

The project builds without a real Sanity project — GROQ queries degrade gracefully. Connect a project when ready.

## Development

```bash
npm run dev          # Astro dev server (localhost:4321)
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run preview      # Preview built site
```

Sanity Studio is embedded at `/admin` — no separate command needed.

## Quality

CI runs on every push: build, TypeScript check, Playwright accessibility tests, and Lighthouse performance audits. Thresholds are enforced — Lighthouse >= 95 across all four categories.

A pre-commit hook warns when architectural files change without corresponding documentation updates.

## Documentation

- `AGENTS.md` — architecture and standards reference for AI tooling
- `CLAUDE.md` — operational context for Claude Code
