# Scripts — Transport Automation Candidates

> **Status:** Stubs only. Neither script is implemented. They exist to document the proposed interfaces for the two options under deliberation.

## Option 2: `ask-ia-stub.mjs`

Simple API script. Reads a dialogue log, sends full content to OpenAI, appends formatted response.

```bash
node scripts/ask-ia-stub.mjs dialogues/002-transport.md
node scripts/ask-ia-stub.mjs dialogues/002-transport.md --dry-run
```

**Effort estimate:** 30-60 minutes to implement.
**Dependencies:** `dotenv` (already installed), Node 18+ `fetch`.

## Option 3: `deliberate-stub.mjs`

Multi-model CLI with dialogue parsing, FSM-aware context packaging, and multi-provider support.

```bash
node scripts/deliberate-stub.mjs --dialogue dialogues/002-transport.md --model openai:gpt-4o
node scripts/deliberate-stub.mjs --dialogue dialogues/002-transport.md --model openai:gpt-4o --dry-run
node scripts/deliberate-stub.mjs --dialogue dialogues/002-transport.md --model google:gemini-2.5-pro
```

**Effort estimate:** Phase 1: 1-2 hours (~200 lines). Phase 2: additional 1-2 hours (~150 lines).
**Dependencies:** `dotenv`, `openai` SDK (new), Node 18+ `fetch` for Gemini.

## Required Environment Variables

Both scripts read from `.env.local` (never committed):

```
OPENAI_API_KEY=sk-...           # Required for OpenAI models
GOOGLE_AI_API_KEY=AI...         # Required for Google models (Option 3 only)
```

## How They Fit Together

The decision between these two approaches is the subject of the active deliberation in `deliberations/`. Neither should be implemented until HO (Ed) makes a decision.
