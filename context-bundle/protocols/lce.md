# Language-Constrained Execution (LCE)

> **Source:** Basic Memory (`patterns/language-constrained-execution-pattern`)
> **Status:** active
> **Valid from:** 2026-01-15
> **Last verified:** 2026-01-15
> **Bundle version:** 2026-02-27

**Subtitle:** A pattern for binding language systems to objective state

**Origin:** Post-mortem analysis of Forensic Audio Skill Forge by ChatGPT, January 2026

---

## Executive Summary

This pattern emerged from analyzing a multi-agent AI collaboration that succeeded technically but exposed a systemic epistemic failure: **agreement without object-level verification**. Both AI agents (Claude and Gemini) agreed on a parameter (48kHz sample rate) from "general knowledge" that was objectively wrong (actual: 44.1kHz). The project was saved by late-stage tool inspection (`ffprobe`), not by the protocol.

The fix is not "be more careful." The fix is **forcing contact with reality at the protocol level**.

---

## Core Axiom

> **No system state may change unless the change is reducible to a verifiable artifact.**

This is non-negotiable. Everything else follows.

---

## The Problem LCE Solves

LLMs optimize for **coherence**, not **correspondence**.

Both agents converged on a *plausible world* rather than the *actual object*.

- [Root Cause] Narrative agreement substituted for scalar verification
- [Symptom] "We agreed" but reality was different
- [Pattern] "Typical behavior" reasoning (e.g., "iPhones usually record 48kHz")

---

## Roles (Abstract, Functional)

These are capabilities, not agents. Any system (human, LLM, script) may play a role, but **roles cannot collapse**.

| Role | Capability | Authority |
|------|------------|-----------|
| **Proposer** | Generates language (plans, hypotheses, instructions) | None |
| **Inspector** | Produces artifacts from reality (files, measurements, hashes) | High |
| **Registrar** | Writes immutable facts derived from artifacts | Absolute |
| **Executor** | Performs actions using registered facts | Absolute |

**Critical constraint:** No role may collapse into another in a single step. Language may not directly register facts. Execution may not infer facts.

---

## Objects (Minimal Set)

### 1. Artifact
A byte-producing output from a deterministic process. Command output, file hash, sensor reading, compiler output.

**Rule:** If it has no bytes, it does not exist.

### 2. Scalar
A single value extracted from an artifact.

**Rules:** Scalars are derived-only. Scalars are write-once. Scalars carry provenance.

### 3. Register
An append-only store of scalars. No overwrite, no mutation, any conflict is a hard error.

### 4. Plan
A sequence of actions parameterized only by scalar references. Plans do not assert facts. Plans depend on facts.

### 5. State Machine
A finite automaton governing legal transitions. Language cannot move the machine. Only validated artifacts can.

---

## Reference Architecture

```
        +------------+
        |  Proposer  |
        | (Language)  |
        +-----+------+
              | suggests
              v
        +------------+
        |  Inspector |
        |  (Tools)   |
        +-----+------+
              | produces artifacts
              v
        +------------+
        |  Registrar |
        |  (State)   |
        +-----+------+
              | locks scalars
              v
        +------------+
        |  Executor  |
        | (Actions)  |
        +------------+
```

**Key properties:**
- Unidirectional authority flow
- Language never touches state
- Execution is impossible without prior inspection
- State transitions are enumerable and finite

---

## Minimal Canonical Example

Domain: any media file. Goal: run a command that depends on sample rate **without ever asserting the rate in language**.

### Step 1: Inspection (Inspector)
```bash
ffprobe -v error -select_streams a:0 \
  -show_entries stream=sample_rate \
  -of json input.mov > artifact.json
```
Result: `artifact.json` (bytes exist)

### Step 2: Registration (Registrar)
```bash
RATE=$(jq '.streams[0].sample_rate | tonumber' artifact.json)
echo "{\"sample_rate\": {\"value\": $RATE, \"source\": \"artifact.json\"}}" > scalars.json
```
**Rule enforced:** If `sample_rate` already exists -> exit with error

### Step 3: Plan (Language, Non-authoritative)
```
Plan:
- Use sample_rate from scalars.json
- Pass it to ffmpeg
```
This plan cannot run by itself.

### Step 4: Execution (Executor)
```bash
RATE=$(jq '.sample_rate.value' scalars.json)
ffmpeg -ar "$RATE" -i input.mov output.wav
```
No rate was "decided." It was looked up.

---

## What LCE Guarantees

- [Eliminates] "We agreed but were wrong"
- [Eliminates] "It's usually X" reasoning
- [Eliminates] Context window drift
- [Eliminates] Stale assumptions
- [Eliminates] Narrative lock-in
- [Eliminates] Premature consensus

- [Preserves] Human judgment
- [Preserves] Interpretation
- [Preserves] Taste
- [Preserves] Creativity

**Judgment moves after truth binding, not before.**

---

## Enforceability Analysis

| Category | Percentage | Examples |
|----------|------------|----------|
| Fully mechanically enforceable | 70-75% | Artifact inspection, scalar register, hash locks, FSM |
| Mechanically gateable, human-asserted | 15-20% | Human readiness declarations, listening sign-off |
| Irreducibly human | 5-10% | Quality, vibe, interpretive understanding |

**That distribution is healthy.** If it were 100% enforceable, you'd have built a bureaucracy, not a thinking system.

---

## The Key Insight

> LLMs are not wrong because they hallucinate.
> They are wrong because we let language stand in for inspection.

This pattern makes that impossible.

---

## Origin Story

- [Discovered During] Forensic Audio Skill Forge
- [Failure That Revealed It] Both GA (Claude) and IA (Gemini) agreed on 48kHz; actual was 44.1kHz
- [Save That Proved It] `ffprobe` inspection in Phase 0 caught the error
- [Analyst] ChatGPT (post-mortem consultant role)
- [Date] January 2026
