# Transport Automation Deliberation — Summary

> **Status:** Derived document (synthesized from GA and IA positions)
> **Date:** 2026-02-27
> **Decision status:** PENDING — awaiting HO (Ed) decision with external IA (ChatGPT) review
> **Full positions:** See `transport-automation_ga.md` and `transport-automation_ia.md`

---

## Decision Question

How should we automate the manual copy-paste transport between models during Lanesborough/Skill Forge deliberations?

## Options

### Option 2: Simple API Script (~60 lines, 30-60 min to build)
A minimal `ask-ia.mjs` script that reads a dialogue log, sends it to the OpenAI API, and appends the formatted response. Follows Ed's existing script conventions.

### Option 3: Multi-Model Deliberation CLI (~200-400 lines, 1-4 hours to build)
A structured `deliberate.mjs` script with dialogue parsing, FSM-aware context packaging, multi-provider support, and protocol-governed formatting. Phased: Phase 1 is functionally equivalent to Option 2 with structural bones.

## Where GA and IA Agree

1. Git as mechanism of record (not gist) — deliberation logs live in `deliberations/`
2. Single-file script in `scripts/`, not a framework
3. `--dry-run` flag for safety
4. `.env.local` for API keys
5. Ed reviews before committing (human stays in the loop)
6. No auto-committing, no daemon, no orchestration

## Where They Diverge

| Point | GA (Option 3) | IA (Option 2) |
|---|---|---|
| What is the expensive step? | Context packaging + formatting | Copy-paste transport |
| `parseDialogue` worth building? | Yes — enables smart context and dry-run | No — premature; markdown is informal |
| Protocol stability | Lookup table is easy to update | Protocol proposed TODAY — any parser will be wrong |
| Upgrade path | Phase 1 ~ Option 2 + 50 lines | Start minimal, add flags as needed |
| Effort estimate | Phase 1: 1-2 hours (~200 lines) | 30-60 min (~60 lines) |

## Five Decision Questions (for IA review)

1. **Is the GA's phased approach genuinely different from Option 2, or is it Option 2 wearing a trenchcoat?** Phase 1 is "functionally equivalent to Option 2" by the GA's own admission. Does `parseDialogue` earn its 50 extra lines?

2. **Is context packaging actually the bottleneck?** The IA says Ed never reported low-quality IA responses due to too much context. The GA says future deliberations will be longer. Who has the stronger claim?

3. **Protocol instability — blocker or non-issue?** The unified protocol was drafted today. The IA says any FSM parser built now will be wrong. The GA says the context rules are a simple lookup table. Which framing is more honest?

4. **Are we missing a third option?** Both positions assume a Node.js script. Are there simpler or more powerful approaches neither considered?

5. **The meta-question:** We are using the very protocol we're trying to automate to decide how to automate it. Does this create a blind spot?
