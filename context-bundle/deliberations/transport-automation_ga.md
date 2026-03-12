# GA Position: Option 3 — Multi-Model Deliberation CLI

> **Deliberation:** Transport Automation (Option 2 vs Option 3)
> **Agent:** Claude Code (Opus 4.6), acting as GA
> **Date:** 2026-02-27
> **Type:** Simulated — Claude Code spawned this agent internally to argue the GA position
> **Status:** Raw output, uncondensed

---

```
=== HANDSHAKE TURN 1 (GA) ===
```

**Agent:** Claude Code (Opus 4.6)
**Date:** 2026-02-27
**Type:** Proposal (Option 3 — Multi-Model Deliberation CLI)

---

## 1. The Actual Problem (Grounded in Evidence)

The edoconnell-site deliberation (`dialogues/001-site-rebuild.md`) ran 8 turns across GA (ChatGPT) and IA (Claude Code) with Ed manually routing messages. The transport mechanism was `scripts/sync-dialogue.sh` — a bash script that pushes the full 1,560-line dialogue log to a secret GitHub gist (`0209d571cb0e06a6382cdbbb8b2a4163`), which ChatGPT reads via URL. Ed copy-pastes ChatGPT's response back into the dialogue file, then syncs again.

The earlier Portfolio Skill Forge deliberation (January 2026, documented in Basic Memory as `case-studies/case-study-portfolio-skill-forge-heterogeneous-ai-deliberation`) used an even rawer transport: GitHub commits. Claude Code wrote to the dialogue log, committed and pushed; ChatGPT read the raw GitHub file. That case study explicitly identifies the async inspection protocol as a solved problem but says nothing about transport cost — because at 8 turns it was tolerable. The edoconnell deliberation, at 5 handshake turns plus HO decisions plus an implementation plan, shows the pattern repeating.

The Unified Design Cycle Protocol draft (`proposals/unified-design-cycle-protocol-draft-proposal` in Basic Memory, dated 2026-02-27) adds new states (ELICITING, EDT) and new artifacts (ECM, TAC). Future deliberations under this consolidated protocol will have *more* turns, not fewer. The transport cost will compound.

**What Ed actually does per IA turn today:**
1. Reads the dialogue log (or remembers context from having Claude Code open)
2. Opens ChatGPT
3. Pastes or shares the gist URL
4. Provides context about which turn to respond to and what role to play
5. Reads ChatGPT's response
6. Copies it
7. Pastes it into the local markdown file at the right location
8. Formats it (adds the `=== HANDSHAKE TURN N ===` markers, fixes ChatGPT's citation artifacts)
9. Runs `sync-dialogue.sh` to update the gist
10. Optionally commits

That is 10 steps per turn, and steps 4 (context packaging) and 8 (formatting) are the expensive ones — they require Ed to hold the full protocol state in his head to package the right instructions.

## 2. What Option 2 (Simple API Script) Does Not Solve

A script that reads the log, calls GPT-4, and writes the response back eliminates steps 2-3 and 5-7 (the copy-paste mechanics). That is real value. But it does not address:

**Problem A: Context packaging is the hard part.** The dialogue log is 1,560 lines. Sending it all to GPT-4 is wasteful and expensive. The IA does not need the full OVG checklist to write Turn 7 during execution. The Unified Design Cycle Protocol explicitly specifies a "Context Loading Guide" with per-state loading rules. A simple script that sends "the last turn" does not know what state the FSM is in, so it cannot package context appropriately.

**Problem B: Formatting is protocol-governed.** ChatGPT's raw output contains `contentReference[oaicite:N]{index=N}` artifacts (see the editorial note at line 1497 of the dialogue). Turn headers follow a specific pattern. A simple script would write raw API output — Ed would still hand-format.

**Problem C: Ed runs multiple deliberation types.** The edoconnell-site deliberation is a Skill Forge cycle. A future memento-mvp architecture deliberation might be a plain Lanesborough cycle. The Unified Design Cycle Protocol defines abbreviated cycles for "known problem with existing skill." A simple script hardcoded for one dialogue shape does not serve the workflow Ed is building toward.

**Problem D: Model choice is already heterogeneous.** The Portfolio Skill Forge case study paired Claude Code (GA) with ChatGPT (IA). The edoconnell-site deliberation reversed the roles — ChatGPT (GA) with Claude Code (IA). Future cycles may use Gemini or Claude via API as the external model. A script that calls only OpenAI's API has a lifespan measured in weeks.

## 3. What Option 3 Provides

A CLI tool that understands the protocol:

```bash
# Run the next IA turn on the edoconnell-site deliberation
node scripts/deliberate.mjs --dialogue dialogues/001-site-rebuild.md --model openai:gpt-4o

# Dry run: show what context would be packaged
node scripts/deliberate.mjs --dialogue dialogues/001-site-rebuild.md --model openai:gpt-4o --dry-run

# Use a different model
node scripts/deliberate.mjs --dialogue dialogues/001-site-rebuild.md --model google:gemini-2.5-pro
```

### Architecture

One file, ~400 lines, three concerns:

```
scripts/deliberate.mjs
├── parseDialogue(filePath)     — Read log, extract FSM state, last turn, turn count
├── packageContext(parsed, opts) — Build system prompt + user message per protocol rules
├── callModel(provider, model, messages) — Thin wrapper over provider APIs
├── formatResponse(raw, turnN, agent) — Add turn markers, strip provider artifacts
└── writeBack(filePath, formatted) — Append to dialogue, optionally sync gist
```

**Dependencies:** Zero new runtime dependencies beyond what's in `package.json`. The OpenAI SDK (`openai`) is the only addition. Google's Gemini API uses the same REST pattern and can be called via `fetch`. No framework, no config files, no abstractions.

### What `parseDialogue` Does

Reads the markdown file. Extracts:
- **FSM state** from the header section (regex: `/^### FSM State: \`(\w+)\`/m`)
- **Last turn** by finding the last `=== HANDSHAKE TURN N ===` or `=== IMPLEMENTATION PLAN ===` or `### HO DECISION` marker
- **Turn number** and **last agent** from the marker
- **Next expected agent** (alternation: if GA spoke last, IA is next; HO decisions are interjections)

This is not parsing the full protocol — it is reading the live status header that the Lanesborough Protocol's Log Rule 1 mandates be kept current.

### What `packageContext` Does

Uses the FSM state to decide what context to include:

```javascript
function packageContext(parsed, opts) {
  const { fsmState, lastTurn, turnNumber, dialogue } = parsed;

  // The Unified Design Cycle Protocol's Context Loading Guide
  const contextRules = {
    'ELICITING':   { sections: ['roles', 'eliciting_phase'] },
    'OVG_CLOSED':  { sections: ['roles', 'prt', 'ecm', 'deliberation'] },
    'UG_CLOSED':   { sections: ['roles', 'prt', 'deliberation'] },
    'AG_CLOSED':   { sections: ['roles', 'planning', 'agreed_architecture'] },
    'PLAN_LOCKED': { sections: ['edt', 'tac', 'ecm'] },
    'EXECUTING':   { sections: ['edt', 'tac', 'ecm'] },
  };

  const rules = contextRules[fsmState] || { sections: ['full'] };
  const systemPrompt = buildSystemPrompt(parsed, rules);
  const userMessage = buildUserMessage(lastTurn, turnNumber, opts);

  return { systemPrompt, userMessage };
}
```

### What a Turn Looks Like (End to End)

```
$ node scripts/deliberate.mjs --dialogue dialogues/002-contact-page.md --model openai:gpt-4o --dry-run

Dialogue: dialogues/002-contact-page.md
FSM State: UG_CLOSED
Last Turn: HANDSHAKE TURN 2 (GA) — ChatGPT
Next Expected: HANDSHAKE TURN 3 (IA)
Context Sections: roles, prt, deliberation (3 of 8 sections, ~2,100 tokens)

System prompt (742 tokens):
  You are the Inspecting Agent (IA) in a Lanesborough Protocol deliberation...
  [truncated for dry-run display]

User message (1,358 tokens):
  GA's Turn 2 proposes... [the actual turn content]

Would append ~2,000 tokens to dialogue. Estimated API cost: ~$0.03

Run without --dry-run to execute.
```

Ed still reviews before committing. The human stays in the loop.

## 4. Honest Assessment of Effort and Risks

### Effort

**Phase 1 (what I would build first):**
- `parseDialogue` — regex extraction from markdown. ~80 lines.
- `callModel` with OpenAI only — ~30 lines.
- `formatResponse` — ~20 lines.
- `writeBack` — ~15 lines.
- Basic `packageContext` — sends full dialogue with correct system prompt. ~40 lines.

**Phase 1 total: ~200 lines, 1-2 hours.** Functionally equivalent to Option 2 but with structural bones.

**Phase 2 (when a second deliberation starts):**
- Smart `packageContext` — section extraction based on FSM state. ~100 lines.
- Google provider in `callModel`. ~30 lines.
- `--dry-run` flag. ~20 lines.

**Phase 2 total: ~150 additional lines, 1-2 hours.**

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Over-engineering | Medium | Phase 1 is functionally a simple script. Phase 2 is additive, not required. |
| Parsing brittleness | Low | `--dry-run` shows what the parser sees before any API call or file write. |
| Context window cost | Low | GPT-4o handles 128k tokens. 1,560 lines is ~6,000 tokens input = ~$0.015/turn. |
| Protocol drift | Low | Context rules are a simple lookup table. Updating is a 5-line change. |

### Explicit Scope Exclusions

- No web UI
- No daemon/server process
- No database
- No orchestration (the script runs one turn, not an autopilot loop)
- No automatic committing
- No Claude API calls (Claude Code is already in the terminal)

## 5. Phase Plan

### Phase 1: Ship Now
Build `scripts/deliberate.mjs` with parseDialogue, callModel (OpenAI only), formatResponse, writeBack, basic packageContext, `--dry-run` flag.

### Phase 2: When the Second Deliberation Starts
Smart context packaging + Google Gemini provider + validation warnings.

### Never
No web UI, no daemon, no database, no autopilot, no auto-committing.

## 6. Why Option 3 Over Option 2

The delta between the two options in Phase 1 is approximately 50 lines of code — the `parseDialogue` function and the `--dry-run` flag. Option 2 would hardcode "read file, call API, write file." Option 3 structures the same work so that the second deliberation, the second model, and the smart context packaging are additive, not rewrites.

The difference is that Option 3 respects the fact that this workflow is not a one-off. Two completed deliberations already exist. A third (this very conversation) is happening now. Building for exactly one dialogue and exactly one model is building for last month.
