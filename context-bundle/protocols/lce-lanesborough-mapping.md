# LCE-Lanesborough Mapping

> **Source:** Basic Memory (`patterns/lce-lanesborough-mapping`)
> **Status:** active
> **Valid from:** 2026-01-15
> **Last verified:** 2026-01-16
> **Bundle version:** 2026-02-27

**Purpose:** Map Language-Constrained Execution Pattern onto Lanesborough Protocol

---

## Role Mapping

| LCE Role | Lanesborough Entity | Notes |
|----------|---------------------|-------|
| **Proposer** | GA (Generalizing AI) | Generates plans, hypotheses, execution strategies |
| **Proposer** | IA (Inspecting AI) | When paraphrasing or interpreting (non-authoritative) |
| **Inspector** | Tools (`ffprobe`, `stat`, `sha256sum`) | **NEW**: Tools are first-class participants, not utilities |
| **Inspector** | IA | Only when flagging `[cannot verify]` or `[contradicts]` |
| **Registrar** | PRT (Parameter Reconciliation Table) | Must become write-once, artifact-derived |
| **Executor** | GA + Tools | Post-AG execution only |
| **---** | HO (Human Orchestrator) | **Transcends LCE**: Gate certification, judgment, override |

### Critical Insight

IA's adversarial paraphrase is **Proposer activity**, not Inspector activity.

IA inspects *language* (GA's claims). Tools inspect *reality* (artifacts).

Only tool output has Inspector authority over scalars.

---

## Object Mapping

| LCE Object | Lanesborough Equivalent | Changes Required |
|------------|------------------------|------------------|
| **Artifact** | Tool outputs, file hashes, command results | Formalize as first-class log entries |
| **Scalar** | PRT row | Add provenance column: `[verified:artifact]` / `[assumed]` / `[derived]` |
| **Register** | PRT | Make append-only; conflicts are hard errors |
| **Plan** | Execution Plan (post-AG) | Must reference scalar IDs, not assert values |
| **State Machine** | Gates (UG, AG, Articulation) | Replace with formal FSM (see below) |

---

## Gate to State Machine Transformation

### Current (Rhetorical Gates)

```
UG (Understanding Gate)
  | "We are talking about the same thing"
AG (Agreement Gate)
  | "We think the same thing is true"
Articulation Gate
  | "We have a concrete plan"
Execution
```

**Problem:** Gates are declared via language. Language drifts.

### Proposed (Formal FSM)

```
INIT
  | [artifact inspection complete]
OVG_CLOSED (Object Verification Gate)
  | [all scalars registered, none assumed]
PRT_LOCKED
  | [GA and IA paraphrases exist]
UG_CLOSED
  | [disagreements resolved or explicitly unresolved]
AG_CLOSED
  | [execution plan hash matches PRT hash]
PLAN_LOCKED
  | [HO certifies]
EXECUTING
  | [deliverables exist]
COMPLETE
```

### Transition Rules (Hard)

| Transition | Requires |
|------------|----------|
| INIT -> OVG_CLOSED | >=1 artifact exists; all scalars derived from artifacts |
| OVG_CLOSED -> PRT_LOCKED | No `[assumed]` scalars in PRT |
| PRT_LOCKED -> UG_CLOSED | GA paraphrase + IA paraphrase exist |
| UG_CLOSED -> AG_CLOSED | All `[contradicts]` flags resolved or marked `[unresolved:accepted]` |
| AG_CLOSED -> PLAN_LOCKED | `hash(plan) = f(hash(PRT))` |
| PLAN_LOCKED -> EXECUTING | HO token exists |
| EXECUTING -> COMPLETE | Deliverable artifacts exist |

### Illegal Transitions (Enforced)

- No backward transitions (ever)
- No skipping states
- Any scalar mutation after PRT_LOCKED -> reset to OVG_CLOSED
- Any plan edit after PLAN_LOCKED -> reset to AG_CLOSED

---

## New Protocol Element: OVG (Object Verification Gate)

**This is the key addition.**

OVG closes when:

1. All source artifacts have been inspected by tools
2. All scalars are written to PRT with `[verified:artifact]` provenance
3. Zero scalars are marked `[assumed]`

**OVG precedes UG.** You cannot discuss understanding until you have established facts.

### OVG Checklist (Mechanical)

```
[ ] Source artifact exists and is accessible
[ ] ffprobe/stat/file run on artifact
[ ] Output captured as artifact (JSON/text)
[ ] Scalars extracted and written to PRT
[ ] Each scalar cites source artifact
[ ] No scalar is [assumed]
```

---

## PRT Schema (LCE-Compliant)

```yaml
parameters:
  sample_rate:
    value: 44100
    unit: Hz
    provenance: verified:artifact
    source: artifacts/ffprobe_IMG_7118.json
    extracted_at: 2026-01-10T14:23:00Z

  duration:
    value: 183.4
    unit: seconds
    provenance: verified:artifact
    source: artifacts/ffprobe_IMG_7118.json
    extracted_at: 2026-01-10T14:23:00Z
```

### Provenance Values (Enum)

| Value | Meaning | Blocks AG? |
|-------|---------|------------|
| `verified:artifact` | Tool output, byte-level | No |
| `derived` | Computed from other verified scalars | No |
| `assumed` | Language-based ("usually", "typically") | **YES** |
| `human:attested` | HO declared, not tool-verified | No (HO override) |

---

## Verification Status Markers (Updated)

Original Lanesborough markers still apply to *claims*, but scalars get provenance:

| Marker | Applies To | LCE Role |
|--------|-----------|----------|
| `[verified]` | Claims (IA confirming GA statement) | Proposer<->Proposer |
| `[contradicts: X]` | Claims | Proposer<->Proposer |
| `[cannot verify]` | Claims | Proposer acknowledging limit |
| `[verified:artifact]` | **Scalars** | Inspector->Registrar |
| `[assumed]` | **Scalars** | Proposer (blocks AG) |

---

## What Changes in Practice

### Before (Forensic Audio Skill Forge Failure)
```
GA: "iPhone records at 48kHz"
IA: "Agreed, 48kHz is standard"
-> AG closes
-> Execution uses 48kHz
-> WRONG (actual: 44.1kHz)
```

### After (LCE-Compliant)
```
GA: "We need to determine sample rate"
Tool: ffprobe -> 44100 Hz
PRT: sample_rate = 44100 [verified:artifact]
-> OVG closes
GA: "Plan uses sample_rate from PRT"
-> AG closes
-> Execution reads 44100 from PRT
-> CORRECT
```

**No agent ever "agreed" on 44100. It was looked up.**

---

## HO's Special Status

HO transcends the LCE role structure:

- [Can Override] Any gate, any scalar (with `human:attested`)
- [Cannot Be Automated] Judgment, taste, "vibe"
- [Certifies] PLAN_LOCKED -> EXECUTING transition
- [Intervenes] Impasse resolution, scope changes

HO is not Proposer, Inspector, Registrar, or Executor.
HO is the **authority that authorizes the authority structure itself**.

---

## Summary: The One Rule That Would Have Prevented Failure

> **No scalar may be registered unless it was extracted from an artifact produced during this engagement.**

"iPhones usually record 48kHz" is not an artifact.
`ffprobe` output is an artifact.

That's the entire lesson.
