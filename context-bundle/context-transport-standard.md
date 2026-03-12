# Context Transport Standard

> **Version:** 0.1.0
> **Date:** 2026-02-27
> **Status:** Draft — proposed standard, not yet ratified by HO
> **Scope:** Cross-project standard for transporting deliberation context between AI models

---

## Purpose

When multiple AI models collaborate on a decision (Lanesborough Protocol, Skill Forge, etc.), they need shared context: protocol rules, project constraints, prior turns, and decision status. This standard defines how that context is packaged, versioned, transported, and kept in sync across projects and sessions.

**Design principles:**
- Explicit over inferred (no smart parsing, no state inference)
- Human-declared manifests over automated detection
- Plain text over proprietary formats
- Versioned references over "latest"
- Git as the mechanism of record

---

## 1. Two-Layer Architecture

### Layer 1: GLOBAL Protocol Pack (GPP)

The canonical protocol stack. Reusable across all projects. Changes rarely. Versioned explicitly.

**Contents:**
- Lanesborough Protocol (base collaboration framework)
- Skill Forge Pattern (articulation gate, skill extraction, heterogeneous models)
- Language-Constrained Execution (core axiom, PRT, functional roles)
- Black Flag Protocol (epistemic hygiene, all 17 clauses)
- LCE-Lanesborough Mapping (formal FSM, OVG, PRT schema)
- Unified Design Cycle Protocol (draft consolidation — when ratified)

**Versioning:** Semantic versioning (`vX.Y.Z`).
- MAJOR: Protocol structure changes (new states, removed gates)
- MINOR: New clauses, expanded guidance, clarifications
- PATCH: Typo fixes, formatting, editorial

**Storage:** A dedicated GitHub Gist (stable URL) OR a `protocol-pack/` folder in a shared repo.

### Layer 2: PROJECT Context Pack (PCP)

Project-specific overlay. Changes frequently. One per project.

**Contents:**
- Project summary (what this project is, tech stack, current state)
- Environment constraints (ports, deployment targets, CI setup)
- Active deliberations (current decision threads)
- Project-specific constraints beyond the global protocol
- Links to prior deliberation logs

**Storage:** A per-project GitHub Gist (stable URL) OR a `context-bundle/` folder in the project repo.

---

## 2. Artifact Types and Naming Rules

### Global Protocol Pack (GPP)

Single-file option:
```
protocol-pack_v1.0.0.md
```

Multi-file option:
```
protocols/
  lanesborough.md
  skill-forge.md
  lce.md
  black-flag.md
  lce-lanesborough-mapping.md
  unified-design-cycle-draft.md
```

Each protocol file includes a header block:
```markdown
> **Source:** Basic Memory (`permalink`)
> **Status:** canonical | draft | active
> **Valid from:** YYYY-MM-DD
> **Last verified:** YYYY-MM-DD
> **Bundle version:** YYYY-MM-DD
```

### Project Context Pack (PCP)

```
project/
  <project-name>-context.md
```

### Deliberation Packet (DP)

One per decision thread:
```
deliberations/
  <topic>_manifest.yaml          # Required: metadata and links
  <topic>_ga.md                  # GA position (full, uncondensed)
  <topic>_ia.md                  # IA position (full, uncondensed)
  <topic>_summary.md             # Optional: derived synthesis
  <topic>_decision.md            # Written after HO decides
```

Naming convention: `<topic>` uses kebab-case, e.g. `transport-automation`.

---

## 3. Versioning and Anti-Drift Rules

### Protocol Version Tracking

Each protocol document in the bundle carries:
- Version identifier (semantic version or date)
- Last verified date
- Content hash (SHA-256, first 12 chars) recorded in INDEX.md

### Project References to Global Protocols

Projects reference global protocols by **version + hash**, not by "latest":

```yaml
# In project manifest or INDEX.md
protocol_references:
  lanesborough: { version: "2025-09-01", hash: "a1b2c3d4e5f6" }
  skill-forge:  { version: "2025-12-28", hash: "f6e5d4c3b2a1" }
  lce:          { version: "2026-01-15", hash: "1a2b3c4d5e6f" }
  black-flag:   { version: "2024-11-26", hash: "6f5e4d3c2b1a" }
```

### Anti-Drift Rule

**If a global protocol changes, projects do NOT silently inherit the change.** The project must:
1. Notice the version bump (via hash mismatch or explicit notification)
2. Review the changelog
3. Explicitly bump its reference to the new version
4. Verify no project-specific constraints are violated

This prevents "the rules changed under us" failures.

---

## 4. Transport Mechanisms (Ranked)

### Preferred: Git Repo Folder

```
project-repo/
  context-bundle/
    INDEX.md
    protocols/
    deliberations/
    project/
    scripts/
```

**Advantages:** Full audit trail, branching, PR review for protocol changes, co-located with code.

**When to use:** Default for projects with established repos.

### Acceptable: GitHub Gist

One gist per project (stable URL). Protocol pack may be a separate gist.

**Advantages:** Fast sharing (URL paste into any model), no repo setup required, public or secret.

**Limitations:** Flat namespace (no directories), limited diff history, no branching.

**Naming convention for gist files:** Since gists have no directories, use prefixed basenames:
```
INDEX.md
context-transport-standard.md
lanesborough.md
skill-forge.md
lce.md
black-flag.md
lce-lanesborough-mapping.md
unified-design-cycle-draft.md
transport-automation_ga.md
transport-automation_ia.md
transport-automation_summary.md
edoconnell-site-context.md
scripts-README.md
ask-ia-stub.mjs
deliberate-stub.mjs
```

**When to use:** Sharing context with models that can read URLs (ChatGPT, Gemini). Fast bootstrapping for new deliberations.

### Emergency: Paste into Chat

For small, bounded context only. Maximum ~2,000 lines.

**When to use:** Quick consultation. Ad-hoc inspection of a single turn. Models without URL access.

**Rule:** Emergency transport MUST be followed by proper archival in git or gist.

---

## 5. Update Workflow

### When to Update an Existing Gist

- New deliberation turn → append new file to the gist
- Protocol editorial fix → update the file, bump patch version in INDEX.md
- Project state change → update project context file

### When to Create a New Gist

- New project → new project gist
- Major protocol version bump → new GPP gist (old one stays as historical record)

### Suggested Policy

| Artifact | Gist Strategy | URL Stability |
|----------|--------------|---------------|
| Global Protocol Pack | One gist, stable URL, version bumps are file updates | Permanent |
| Per-project bundle | One gist per project, stable URL | Permanent per project |
| Deliberation turns | New files in the project gist | Appended, never overwritten |

**Never overwrite canonical protocol files without a version bump.** The INDEX.md changelog tracks all changes.

---

## 6. Deliberation Manifest Format

Every deliberation packet includes a manifest. This is explicit, not inferred.

### Sample Manifest

```yaml
# deliberations/transport-automation_manifest.yaml

deliberation:
  id: "transport-automation-2026-02-27"
  project_id: "edoconnell-site"
  decision_question: >
    How should we automate the manual copy-paste transport between models
    during Lanesborough/Skill Forge deliberations?

roles:
  ho:
    name: "Ed O'Connell"
    type: "human"
  ga:
    name: "Claude Code (Opus 4.6)"
    type: "ai"
    model: "claude-opus-4-6"
    role_in_deliberation: "Simulated GA (arguing Option 3)"
  ia:
    name: "Claude Code (Opus 4.6)"
    type: "ai"
    model: "claude-opus-4-6"
    role_in_deliberation: "Simulated IA (arguing Option 2)"
  external_ia:
    name: "ChatGPT 5.2"
    type: "ai"
    model: "gpt-5.2-thinking"
    role_in_deliberation: "External IA review"

protocol_versions:
  lanesborough: "2025-09-01"
  skill_forge: "2025-12-28"
  lce: "2026-01-15"
  black_flag: "2024-11-26"
  unified_draft: "2026-02-27"  # Draft — not yet ratified

context_includes:
  - "protocols/*.md (full protocol pack)"
  - "project/edoconnell-site-context.md"
  - "deliberations/transport-automation_ga.md (full GA position)"
  - "deliberations/transport-automation_ia.md (full IA position)"
  - "deliberations/transport-automation_summary.md (derived)"

constraints:
  token_cap: null  # No explicit cap
  cost_cap: null   # No explicit cap
  no_web: false    # Web access permitted
  security: "No secrets, API keys, tokens, or credentials in any shared artifact"

outputs_expected:
  - "IA inspection with verification flags"
  - "Risk assessment for both options"
  - "Recommendation with evidence"
  - "Identification of any missing third option"

gate_status:
  eliciting: "N/A — problem well-defined"
  ovg: "N/A — no verifiable artifacts required for this decision"
  ug: "OPEN — GA and IA positions written, external IA review pending"
  ag: "OPEN — awaiting convergence"
  articulation: "OPEN — HO must articulate decision before approving"
  plan_locked: "OPEN"
  executing: "NOT_REACHED"

notes: >
  This deliberation was simulated by Claude Code spawning two agents internally.
  Both agents had access to Basic Memory and the full protocol stack.
  The GA argued for Option 3 (multi-model CLI); the IA argued for Option 2
  (simple API script). ChatGPT is being brought in as external IA to
  pressure-test both positions before HO decides.
```

### Required Fields

| Field | Required? | Description |
|-------|-----------|-------------|
| `deliberation.id` | Yes | Unique identifier (kebab-case + date) |
| `deliberation.project_id` | Yes | Which project this belongs to |
| `deliberation.decision_question` | Yes | The exact question being decided |
| `roles` | Yes | All participants with model names |
| `protocol_versions` | Yes | Pinned versions of protocols being used |
| `context_includes` | Yes | Explicit list of files included |
| `constraints` | Yes | Bounds on the deliberation |
| `outputs_expected` | Yes | What the deliberation should produce |
| `gate_status` | Yes | Current state of each gate (human-attested) |
| `notes` | No | Additional context |

---

## 7. Security and Privacy Rules

### Redaction Checklist

Before sharing any bundle:

- [ ] No API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `SANITY_API_*_TOKEN`, etc.)
- [ ] No bearer tokens or auth headers
- [ ] No `.env` file contents (references to `.env.local` are OK; actual values are not)
- [ ] No cookies, session tokens, or auth state files
- [ ] No private URLs with embedded tokens (e.g., `?token=abc123`)
- [ ] No personal data (names of students, clients, etc.) unless explicitly authorized
- [ ] No employer-identifying information unless explicitly authorized
- [ ] No credentials for third-party services

### Sanitization Rules

- **Public project IDs** (e.g., Sanity project ID): OK to include — these are public.
- **Gist IDs**: OK to include — gists are either public or secret (secret = unlisted, not encrypted).
- **GitHub usernames**: OK if the repo is public or the user consented.
- **Model names and versions**: Always include — they are part of the deliberation record.
- **Cost figures**: OK to include (e.g., "$0.15 spent on API calls").

### NON-SHAREABLE Marking

If any deliberation contains sensitive content that cannot be redacted:

```yaml
sharing:
  status: NON-SHAREABLE
  reason: "Contains student names from [project]"
  safe_subset: "deliberations/transport-automation_summary.md only"
```

The bundle INDEX.md must flag this. Non-shareable files are excluded from gist creation.
