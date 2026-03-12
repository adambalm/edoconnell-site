# Skill Forge Pattern

> **Source:** Basic Memory (`patterns/skill-forge-pattern`)
> **Status:** draft (treated as canonical in practice — see open question A5)
> **Valid from:** 2025-12-28
> **Last verified:** 2025-12-28
> **Bundle version:** 2026-02-27

---

## Summary

Skill Forge is a deliberative process for decisions too complex to trust to a single model or a single human judgment. It uses heterogeneous AI models to surface each other's blindspots through adversarial verification, then requires the human to demonstrate understanding before approving a model-produced skill. Full deliberation is expensive; the cost is amortized when the result is captured as an invocable skill for future decisions.

**Critical framing:** The goal is NOT AI consensus. The goal is **qualified human judgment**. The model produces the skill skeleton; the human's articulation proves they're qualified to approve it.

## When to Use

*Problem signature that triggers this pattern:*

- You face a **novel problem** requiring judgment beyond routine application of existing knowledge
- The problem domain is **technically complex** such that a single model (or single human) may have blindspots
- You need the human decision-maker to be **genuinely qualified**, not rubber-stamping
- The class of problem is **likely to recur**, making the upfront deliberation cost worthwhile
- You want to **accumulate executive capacity** over time, not just make isolated decisions

## Core Insight

The goal is not AI consensus or automated recommendation. The goal is **qualified human judgment** — expanding what complexity a human can competently decide by observing models surface each other's errors through adversarial verification.

**Paraphrase is adversarial, not reflective:**

Each model must treat the other's output as **suspect and possibly hallucinated**. The paraphrase step is not passive restatement—it's active verification.

| Layer | Function |
|-------|----------|
| Model B paraphrases Model A's proposal | Restates AND flags each claim with verification status |
| Model A paraphrases Model B's critique | Restates AND flags each claim with verification status |
| **Human articulates the outcome** | **Qualification gate** — if the human cannot restate the core, they cannot approve |

**Verification status per claim:**

| Status | Meaning | Who resolves |
|--------|---------|--------------|
| `[verified]` | Model B independently confirmed | Model B |
| `[contradicts: X]` | Model B's understanding differs | Models debate → resolve or escalate |
| `[cannot verify: no access to Y]` | Model B lacks information to check | Human may certify (after articulating the claim) |
| `[unverifiable: judgment call]` | No verification procedure exists | Human may certify (after articulating the claim) |
| `[unresolved]` | Not resolved, proceed with caution | Logged as open |

**Human certification:**

When models cannot verify a claim (lack of access, judgment call), the Human Orchestrator may certify it: `[certified by HO, YYYY-MM-DD]`. But certification is also gated: the human must first articulate the claim they're certifying.

## Mechanism

### 1. Novel Problem Triggers Full Deliberation

When existing skills don't apply or fail, invoke the full protocol:

1. **Human initiates** → prompts Model A for proposal
2. **Paraphrase-verify cycle** → Model B paraphrases AND flags each claim with verification status
3. **Understanding Gate (UG)** → closes when Model A has responded to all flags (not when all green)
4. **Substantive critique** → Model B surfaces failure modes, proposes tests (only after UG closed)
5. **Paraphrase reverses** → Model A paraphrases critique with flags, Model B confirms
6. **Agreement Gate (AG)** → executable test or qualified agreement
7. **Escalation** → after 3 passes without convergence, surface open questions to human
8. **Skill skeleton** → model(s) produce skill structure capturing the decision

### 2. Human Articulation Gate

The human, having observed the exchange, must restate the core decision in their own words. This is a **gate**, not a production step:

> If the Human Orchestrator cannot articulate the core decision in their own words, they cannot approve or refine the skill skeleton. The protocol has failed.

**Articulation proves qualification.** The human who can articulate it understands what they're approving. The human who cannot articulate it is rubber-stamping.

### 3. Human Approves Skill

After passing the articulation gate, the human may:
- **Approve** the model-produced skeleton as-is
- **Refine** specific parts (but must articulate what they're changing)

The approved skill is now authorized for use with full provenance:
- **Invocable**: Can be triggered when similar problems arise
- **Parameterizable**: Generalizes beyond the single case
- **Provenance-scored**: Per-claim verification status, who certified what, what the human articulated

### 4. Similar Problem → Invoke Skill

Next time this problem class arises, invoke the skill instead of re-running full deliberation. The expensive upfront cost is amortized.

### 5. Skill Fails → Route Back to Forge

When the skill fails to apply or produces unsatisfactory results, the failure routes back into full deliberation.

## Why Heterogeneous Models

Homogeneous models (same architecture, same training data) tend to share blindspots. Heterogeneous models—with genuinely different training corpora, optimization targets, and priors—implement **swiss cheese coverage**: each model's holes are covered by another's strengths.

The paraphrase step is where this coverage manifests. When Model B paraphrases Model A's proposal, it translates through its own priors:
- Emphasizes different aspects
- Interprets ambiguous terms differently
- Flags claims it cannot verify
- Surfaces assumptions Model A didn't know it was making

This is why the pattern uses different LLM providers (e.g., Claude + GPT), not just different instances of the same model.

## What Accumulates

| What | How |
|------|-----|
| **Human qualification** | They passed the articulation gate — demonstrated understanding of what they approved |
| **System capability** | Skill is invocable — cheaper than re-deliberation |
| **Domain coverage** | More skills = more solved problem classes |
| **Efficiency** | Full deliberation only for genuinely novel problems |
| **Provenance** | Per-claim verification status, who certified what, what they articulated |
| **Failure targeting** | When skill fails, trace to which claim broke and who certified it |

## Gates

### Understanding Gate (UG)

"We are talking about the same thing, and I have responded to your verification flags."

**UG closes when:**
- Model A has *responded* to all flags (not when all flags are green)
- Unverified claims are explicitly acknowledged with status, not papered over
- Human may certify unverifiable claims (after articulating them)

**UG does NOT close when:**
- Flags are ignored or hand-waved
- Model claims verification it didn't perform
- "I didn't check" is conflated with "I checked and it's fine"

### Agreement Gate (AG)

"We think the same thing is true/workable."

The reviewing model commits to a falsifiable, conditional, or explicitly unresolved stance. Agreement without demonstrated understanding is invalid.

**Critical distinction**: Understanding does NOT imply agreement. These are orthogonal.

### Articulation Gate (Human Qualification)

"I can restate this in my own words, so I understand what I'm approving."

**Gate clears when:** Human restates the relevant assertion demonstrating comprehension.
**Gate fails when:** Human cannot articulate, or articulation reveals misunderstanding.

## Anti-Patterns

- **Using for trivial decisions** — overhead exceeds value; invoke existing skills instead
- **Skipping human articulation** — rubber-stamping; no demonstrated understanding
- **Homogeneous models** — shared blindspots defeat the purpose
- **Not capturing the skill** — deliberation cost is wasted if not amortized
- **Routing around failures** — skill failures must return to the forge, not be patched ad-hoc
- **Passive paraphrase** ("Let me restate...") — relies on emergent self-correction; no verification performed

## Research Context

| Prior Work | Similarity | Difference |
|------------|------------|------------|
| **Irving et al. 2018** (AI Safety via Debate) | Judging debates easier than debating; expands human judgment | Same-model agents; didn't exploit heterogeneous priors |
| **A-HMAD** (Zhou & Chen 2025) | Heterogeneous agents with specialized roles | Role specialization vs. exploiting different training/priors |
| **Karpathy LLM Council** (2024) | Heterogeneous models, anonymized peer review | Goal is consensus output, not human qualification |
| **Swiss Cheese Model** (Reason 1990) | Layered defenses with different holes | Applied to guardrails not deliberation |
| **ExpeL / Agent Workflow Memory** | Learning from execution trajectories | Captures agent execution patterns; Skill Forge requires human qualification gate |

**What's novel in Skill Forge:**
1. Heterogeneous models with genuinely different priors (not just role specialization)
2. Adversarial paraphrase as active verification — each model flags claims with verification status
3. Human articulation as qualification gate — human must restate decision before they can approve
4. Human certification with accountability — when certifying unverifiable claims, human must first articulate what they're certifying
5. Provenance-scored knowledge capture enabling targeted re-forge on failure
