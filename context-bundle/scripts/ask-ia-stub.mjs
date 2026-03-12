/**
 * ask-ia.mjs — Option 2 candidate: Simple API script for deliberation transport.
 *
 * Reads a dialogue log, sends full content to an external model via API,
 * appends the formatted response to the log.
 *
 * STATUS: STUB — interface and TODOs only. Not yet implemented.
 *
 * Usage:
 *   node scripts/ask-ia.mjs <dialogue-log-path> [--dry-run]
 *   node scripts/ask-ia.mjs dialogues/002-transport.md
 *   node scripts/ask-ia.mjs dialogues/002-transport.md --dry-run
 *
 * Requires in .env.local:
 *   OPENAI_API_KEY=sk-...
 */

import { readFileSync, appendFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

// --- Configuration ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const logPath = process.argv[2];

// --- Validation ---
if (!logPath) {
  console.error('Usage: node scripts/ask-ia.mjs <dialogue-log-path> [--dry-run]');
  process.exit(1);
}

if (!OPENAI_API_KEY && !DRY_RUN) {
  console.error('Missing OPENAI_API_KEY in .env.local');
  process.exit(1);
}

// --- Read dialogue log ---
const log = readFileSync(resolve(logPath), 'utf-8');

// TODO: Extract the last turn (everything after the last "=== " marker)
// const turns = log.split(/(?=^=== )/m);
// const lastTurn = turns[turns.length - 1];

// --- System prompt ---
// TODO: Refine this based on whether this is a GA or IA turn
const systemPrompt = `You are the Inspecting Agent (IA) in a Lanesborough Protocol deliberation.
Your role: paraphrase the GA's proposal, flag verification concerns with markers
([verified], [contradicts: X], [cannot verify: Y], [unverifiable], [unresolved]),
challenge assumptions, and surface failure modes.
Respond with a properly formatted deliberation turn using === HANDSHAKE TURN N (IA) === markers.`;

// --- Dry run ---
if (DRY_RUN) {
  console.log('--- System prompt ---');
  console.log(systemPrompt);
  console.log(`--- Dialogue log: ${log.length} chars ---`);
  console.log('--- Would send full log as user message ---');
  console.log('--- Run without --dry-run to execute ---');
  process.exit(0);
}

// --- API call ---
// TODO: Implement the actual API call
// const response = await fetch('https://api.openai.com/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${OPENAI_API_KEY}`,
//   },
//   body: JSON.stringify({
//     model: 'gpt-4o',
//     messages: [
//       { role: 'system', content: systemPrompt },
//       { role: 'user', content: log },
//     ],
//     max_tokens: 4096,
//   }),
// });

// --- Format and write back ---
// TODO: Strip ChatGPT citation artifacts: contentReference[oaicite:N]{index=N}
// TODO: Add turn markers and timestamp
// TODO: appendFileSync(resolve(logPath), formatted);

console.log('STUB: Not yet implemented. See transport-automation_ia.md for the full design.');
