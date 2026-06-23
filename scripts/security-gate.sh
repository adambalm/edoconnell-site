#!/usr/bin/env bash
# security-gate.sh — deterministic PII / infra / secret denylist scanner.
#
# Exits 0 ONLY if zero forbidden matches exist across tracked files.
# Prints every hit with file:line so failures are actionable.
#
#   bash scripts/security-gate.sh            # scan tracked working tree
#   bash scripts/security-gate.sh --history  # also assert PII is gone from git history
#
# This is the "verified receipt" for the repo: a change is not publishable
# until this prints PASS. Wire it into CI and/or a Stop hook.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 2

fail=0
PATHSPEC=( -- . ':(exclude)package-lock.json' ':(exclude)*.min.*' ':(exclude)scripts/security-gate.sh' ':(exclude)tests/governed-fleet.spec.ts' ':(exclude)tests/governed-fleet-production.spec.ts' )

scan() { # $1=label  $2=regex  $3=optional allowlist-regex (lines matching it are OK)
  local label="$1" re="$2" allow="${3:-}"
  local out
  out=$(git grep -nIiE "$re" "${PATHSPEC[@]}" 2>/dev/null) || true
  if [ -n "$allow" ] && [ -n "$out" ]; then
    out=$(printf '%s\n' "$out" | grep -viE "$allow") || true
  fi
  if [ -n "$out" ]; then
    echo "[$label] FORBIDDEN:"
    printf '%s\n' "$out" | sed 's/^/  x /'
    fail=1
  fi
}

echo "== security-gate: scanning tracked files =="

# --- PII (school account-security incident) ---
scan "pii:name"          'Angelene'
scan "pii:admin-email"   'admin@springfieldca\.org'
scan "pii:domain"        '@springfieldca\.org'
scan "pii:attack"        'password-spray'
scan "pii:incident-id"   'CN-[0-9]'

# --- Infra: machine identification (hardware/OS are allowed; hostnames are not) ---
scan "infra:host-suphouse" '\bsuphouse\b'
scan "infra:host-imac"     'eds-imac'
# 'adambalm' as a machine hostname is forbidden; the public GitHub username/org is allowed.
scan "infra:host-adambalm" '\badambalm\b' 'github\.com/adambalm|adambalm/(edoconnell-site|sca-website-sample|portfolio|memento|memento-public)'
scan "infra:home-path"     '/home/ed\b'
scan "infra:nvm-path"      '\.nvm/versions'
scan "infra:tailscale"     '\bTailscale\b|100\.126\.163\.59|100\.111\.114\.84'

# --- Secrets: VALUES, not variable names ---
scan "secret:sk-token"     'sk-[A-Za-z0-9_-]{20,}'
scan "secret:private-key"  'BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY'
scan "secret:assigned-tok" '(SANITY_API_(READ|WRITE)_TOKEN|WEBHOOK_SECRET|BYPASS_TOKEN|EXPERIMENTS_PASSWORD)[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9_-]{12,}'

if [ "${1:-}" = "--history" ]; then
  echo "== scanning git history for purged content =="
  # The PII (seat-audit briefing) and personal reflections (handwritten) only
  # ever lived under these paths; if no reachable commit touches them, history
  # is clean. A string pickaxe is avoided here: it would false-positive on this
  # scanner's own denylist patterns.
  hist=$(git log --all --oneline -- src/pages/experiments/seat-audit-2026-05-12 src/content/handwritten 2>/dev/null)
  if printf '%s' "$hist" | grep -q .; then
    echo "  x [history] sensitive paths STILL reachable in git history:"
    printf '%s\n' "$hist" | sort -u | sed 's/^/      /'
    fail=1
  else
    echo "  ok [history] seat-audit + handwritten absent from all reachable commits"
  fi
fi

if [ "$fail" -eq 0 ]; then
  echo "== security-gate: PASS (0 forbidden matches) =="
  exit 0
fi
echo "== security-gate: FAIL =="
exit 1
