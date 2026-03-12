/**
 * deliberate.mjs — Option 3 candidate: Multi-model deliberation CLI.
 *
 * Reads a dialogue log, parses FSM state and last turn, packages context
 * per protocol rules, calls the appropriate model, formats the response,
 * and appends it to the log.
 *
 * STATUS: STUB — interface and TODOs only. Not yet implemented.
 *
 * Usage:
 *   node scripts/deliberate.mjs --dialogue <path> --model <provider:model> [--dry-run]
 *   node scripts/deliberate.mjs --dialogue dialogues/002-transport.md --model openai:gpt-4o
 *   node scripts/deliberate.mjs --dialogue dialogues/002-transport.md --model openai:gpt-4o --dry-run
 *   node scripts/deliberate.mjs --dialogue dialogues/002-transport.md --model google:gemini-2.5-pro
 *
 * Requires in .env.local:
 *   OPENAI_API_KEY=sk-...       (for openai: provider)
 *   GOOGLE_AI_API_KEY=AI...     (for google: provider)
 */

import { readFileSync, appendFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

// --- Argument parsing ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

function getArg(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

const dialoguePath = getArg('--dialogue');
const modelSpec = getArg('--model'); // e.g. "openai:gpt-4o"

if (!dialoguePath || !modelSpec) {
  console.error('Usage: node scripts/deliberate.mjs --dialogue <path> --model <provider:model> [--dry-run]');
  process.exit(1);
}

const [provider, model] = modelSpec.split(':');

// --- parseDialogue: Extract FSM state, last turn, turn count ---
// TODO: Implement
function parseDialogue(filePath) {
  const content = readFileSync(resolve(filePath), 'utf-8');

  // TODO: Extract FSM state from header
  // const fsmMatch = content.match(/^### FSM State: `(\w+)`/m);
  // const fsmState = fsmMatch ? fsmMatch[1] : 'UNKNOWN';

  // TODO: Extract last turn
  // const turns = content.split(/(?=^=== )/m);
  // const lastTurn = turns[turns.length - 1];

  // TODO: Determine next expected agent
  // const lastAgentMatch = lastTurn.match(/=== .+ \((\w+)\) ===/);

  return {
    content,
    fsmState: 'UNKNOWN', // TODO
    lastTurn: null,       // TODO
    turnNumber: 0,        // TODO
    nextAgent: null,      // TODO
  };
}

// --- packageContext: Build system prompt + user message per protocol rules ---
// TODO: Implement — see unified-design-cycle-draft.md Context Loading Guide
function packageContext(parsed, opts) {
  // Phase 1: Send full dialogue with correct system prompt
  // Phase 2: Section extraction based on FSM state
  const contextRules = {
    'ELICITING':   { sections: ['roles', 'eliciting_phase'] },
    'OVG_CLOSED':  { sections: ['roles', 'prt', 'ecm', 'deliberation'] },
    'UG_CLOSED':   { sections: ['roles', 'prt', 'deliberation'] },
    'AG_CLOSED':   { sections: ['roles', 'planning', 'agreed_architecture'] },
    'PLAN_LOCKED': { sections: ['edt', 'tac', 'ecm'] },
    'EXECUTING':   { sections: ['edt', 'tac', 'ecm'] },
  };

  // TODO: Build system prompt based on role assignment and protocol phase
  // TODO: Build user message from relevant dialogue sections

  return {
    systemPrompt: 'TODO: Build from protocol rules',
    userMessage: parsed.content, // Phase 1: full dialogue
  };
}

// --- callModel: Thin wrapper over provider APIs ---
// TODO: Implement
async function callModel(provider, model, messages) {
  switch (provider) {
    case 'openai':
      // TODO: Use fetch or openai SDK
      throw new Error('Not implemented: openai provider');
    case 'google':
      // TODO: Use Gemini REST API via fetch
      throw new Error('Not implemented: google provider');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// --- formatResponse: Add turn markers, strip provider artifacts ---
// TODO: Implement
function formatResponse(raw, turnNumber, agent, agentName) {
  // TODO: Strip ChatGPT citation artifacts
  // const cleaned = raw.replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '');

  // TODO: Add turn header with markers
  // const header = `=== HANDSHAKE TURN ${turnNumber} (${agent}) ===\n\n`
  //   + `**Agent:** ${agentName}\n`
  //   + `**Date:** ${new Date().toISOString().split('T')[0]}\n`;

  return raw; // TODO: return formatted
}

// --- Main ---
const parsed = parseDialogue(dialoguePath);

if (DRY_RUN) {
  console.log(`Dialogue: ${dialoguePath}`);
  console.log(`FSM State: ${parsed.fsmState}`);
  console.log(`Model: ${provider}:${model}`);
  console.log(`Content length: ${parsed.content.length} chars`);
  console.log('--- Dry run complete. No API call made. ---');
  process.exit(0);
}

console.log('STUB: Not yet implemented. See transport-automation_ga.md for the full design.');
