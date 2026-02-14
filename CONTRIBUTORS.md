# Contributors

This project is built through orchestrated collaboration between human direction and AI agents. Each contributor is credited with their role and what they contributed.

## Human

| Contributor | Role | Contributions |
|---|---|---|
| **Ed O'Connell** | Human Orchestrator (HO) | Architecture decisions, content strategy, quality gates, editorial voice |

## AI Agents

| Agent | Model | Role | Contributions |
|---|---|---|---|
| **Claude Code** | Claude Opus 4.6 (Anthropic) | Inspecting Agent (IA) | Foundation build, schema implementation, infrastructure, testing, documentation |
| **ChatGPT** | GPT-4o (OpenAI) | Generalizing Agent (GA) | Architecture proposals, schema design, content model deliberation |
| **Kimi** | Kimi 2.5 (Moonshot AI) | Design Contributor | Design system proposal (evaluation pending) |

## Collaboration Model

This project uses the **Lanesborough Protocol** — a structured deliberation framework where a Generalizing Agent proposes, an Inspecting Agent verifies, and a Human Orchestrator holds all decision gates.

### Deliberation History

The full decision history is preserved in an append-only dialogue log (`dialogues/001-site-rebuild.md`). This log is **gitignored** — it contains session-level context, agent deliberation, and working notes that are operationally useful but not part of the public artifact. The log is synced to a private GitHub Gist for persistence across machines.

The architectural decisions *resulting* from deliberation are reflected in committed files: schema designs, documentation updates, and the commit history itself. The dialogue log is the "how we got here"; the committed code is the "what we decided."

### Attribution Tracking

AI contributions are tracked at two levels:
- **Codebase level:** This file and git co-author tags on commits
- **Content level:** The `provenance` field on every Sanity document records authorship, AI assistance, review status, and context

## Adding Contributors

When a new AI agent or human contributor participates in this project, add them here with their role and specific contributions. This file is part of the committed repo — transparency about how the work was produced is itself a professional signal.
