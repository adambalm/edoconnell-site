# The Lanesborough Protocol

> **Source:** Basic Memory (`lanesborough-protocol`)
> **Status:** canonical
> **Valid from:** 2025-09-01
> **Last verified:** 2025-12-08
> **Bundle version:** 2026-02-27

---

## Supersession Notice

**This document supersedes the previous version (2024-11-26).**

**Reason:** The earlier version was an AI-inferred reconstruction based on conceptual patterns, not cited from the authoritative specification. That version described a "debate model" with Primary/Challenger/Verifier roles that was never the actual protocol.

**Epistemic lesson (Black Flag Protocol):** AI agents must distinguish between inferred patterns and cited specifications. When specifications exist, cite them. When they do not, explicitly flag content as "inferred" or "proposed."

---

## Purpose

The Lanesborough Protocol governs collaboration between human and AI agents in multi-step workflows. It ensures clarity, recoverability, accountability, and convergence toward auditable outcomes.

---

## Roles

### Human Orchestrator (HO)
- Defines high-level goals.
- Sets iteration limits.
- Grants final execution approval.
- Intervenes in case of impasse.

### Generalizing AI (GA)
- Architect role.
- Produces high-level proposals, abstractions, and plans.
- Issues tasks/questions to the IA.

### Inspecting AI (IA)
- Ground-truth role.
- Paraphrases GA proposals, challenges them, and validates against concrete details.
- Executes tests and records decisions in the log.

---

## Protocol Phases

### 1. Initiation
- **Actor:** HO
- **Action:** States the goal and sets the maximum number of refinement iterations.

### 2. Proposal
- **Actor:** GA
- **Action:** Produces the initial high-level plan or architectural approach.
- **Output:** Must be specific enough for IA to test and refine.

### 3. Refinement Loop
- **Actor:** GA and IA alternate turns.
- **Process:**
  1. **Mirror and Counter (IA):** IA paraphrases GA proposal, offers critique or alternative.
  2. **Refine and Re-task (GA):** GA accepts/corrects IA understanding, adjusts plan.
  3. **Closure Condition (Handshake):** One agent issues Summary of Agreement + "Agreed." Partner replies "Agreed."

- **Exit:** Loop continues until handshake or max iterations.

### 4. Escalation
- **If successful handshake:** Last AI requests HO approval to execute.
- **If impasse (max iterations reached):** IA reports impasse and requests HO intervention.

### 5. Execution and Logging
- **Actor:** IA
- **Action:** Upon HO approval, IA executes or records the decision.
- **Mandatory Logging:** Append to engagement log with timestamp, decision, GA/IA contributions.

---

## Exception Handling
- **Actor:** IA
- **Trigger:** If IA cannot complete a task (error, missing file, failed test).
- **Action:** Halt process and issue EXCEPTION with description.
- **Resolution:** Resume only when GA revises plan or HO provides new instructions.

---

## Structural Rules

Every exchange is prefixed with Handshake Turn Markers:

    === HANDSHAKE TURN N (agent) ===

These ensure deterministic sequencing and allow recovery if context is lost.

---

## Log Maintenance Rules

### Rule 1: Header Sections Are Live Status

Lanesborough Logs contain two types of content:

1. **Header sections** (Protocol Invocation, Role Assignments, Problem Statement) — These are **live status summaries** that reflect current state. They MUST be updated when log entries change protocol state.

2. **Log entries** — These are **append-only historical records**. Never edit past entries except for editorial notes flagged as `Type: housekeeping`.

**Rationale:** Readers should not need to parse the entire log to understand current state. Header sections provide at-a-glance status while log entries preserve the full deliberation history.

### Rule 2: Human Gate Events Must Be Logged

When the Human Orchestrator (HO) grants approval, makes a decision, or otherwise advances the protocol past a gate, this MUST be recorded as a log entry:

```
### HO DECISION
**Timestamp:** [ISO 8601]
**Type:** gate-approval | decision | intervention | rejection
**Author:** [HO name]

[Description of what was approved/decided/rejected]

**Effect:** [What this enables - e.g., "Phase 1 may now proceed"]
```

### Rule 3: Editorial Notes Are Permitted

Non-substantive maintenance (fixing formatting, resolving merge conflicts, updating stale header status) may be recorded as editorial notes.

### Rule 4: Protocol Closure Requires Implementation Plan

When a Lanesborough Protocol debate concludes with HO approval, the closing agent MUST produce an **Implementation Plan** artifact that captures:

1. **Agreed architecture** — What was decided (diagram or description)
2. **Implementation steps** — Numbered, concrete actions
3. **Ownership matrix** — Who owns each step (HO, GA, IA, or "either")
4. **Dependencies** — Which steps block others
5. **Success criteria** — How to know when complete
6. **Deferred scope** — What was explicitly excluded and why

---

## Naming and Versioning

- Official name: **The Lanesborough Protocol**
- Supersedes: Asymmetric Convergence Protocol (ACP)
- Finalized: September 2025

---

## Integration with Other Protocols

### Black Flag Protocol
- All agents follow epistemic hygiene rules.
- Claims must be cited rather than inferred.

### Temporal Validity Protocol
- Converged decisions become canonical documents.
- Supersession applies when specifications change.
