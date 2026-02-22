/**
 * patch-sa-brief-v3.mjs — Surgical line edits (4 changes).
 *
 * Reader-objection neutralization:
 *   1. "invisible to machines" → "not reliably readable by machines" (block ca340fd0765f)
 *   2. Insert bridging paragraph before GROQ demo (after block d14124ee057e)
 *   3. Insert "verifiable" definition (after block 49d10bd629ba)
 *   4. Phase 3: "verifiable answer" → "answer retrieved from the published dataset" (block k169)
 *
 * Usage:
 *   node scripts/patch-sa-brief-v3.mjs --dry-run   # Preview changes
 *   node scripts/patch-sa-brief-v3.mjs              # Apply patches
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j';
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const DOC_ID = 'fe19b4c6-f86c-441f-9e4c-5dab523656d3';

if (!TOKEN && !DRY_RUN) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function span(text, marks = []) {
  return { _key: key(), _type: 'span', text, marks };
}

function block(style, children) {
  return {
    _key: key(),
    _type: 'block',
    style,
    children: Array.isArray(children) ? children : [span(children)],
  };
}

// ============================================================
// Edit C: "invisible to machines" → "not reliably readable by machines"
// Target: block ca340fd0765f, span 080637666702
// ============================================================
function applyEditC(body) {
  const idx = body.findIndex(b => b._key === 'ca340fd0765f');
  if (idx === -1) { console.error('Edit C: block ca340fd0765f not found'); return false; }

  const spanIdx = body[idx].children.findIndex(s => s._key === '080637666702');
  if (spanIdx === -1) { console.error('Edit C: span 080637666702 not found'); return false; }

  body[idx].children[spanIdx].text =
    "Most organizations pursuing AI readiness have a content problem they haven\u2019t named. Their knowledge \u2014 programs, policies, people, procedures \u2014 lives in page builders, shared drives, and PDFs. Formatted for human eyes, not reliably readable by machines. AI doesn\u2019t fix this. AI accelerates it: coherence compounds, but so does confusion, and both at a speed that manual correction cannot match.";

  console.log('Edit C: Replaced "invisible to machines" with "not reliably readable by machines"');
  return true;
}

// ============================================================
// Edit B: Phase 3 "verifiable answer" → "answer retrieved from the published dataset"
// Target: block k169, span k168
// ============================================================
function applyEditB(body) {
  const idx = body.findIndex(b => b._key === 'k169');
  if (idx === -1) { console.error('Edit B: block k169 not found'); return false; }

  const spanIdx = body[idx].children.findIndex(s => s._key === 'k168');
  if (spanIdx === -1) { console.error('Edit B: span k168 not found'); return false; }

  body[idx].children[spanIdx].text =
    'AI agents query the content API to answer questions grounded in real institutional data. \u201cWhat programs does the science department offer?\u201d returns an answer retrieved from the published dataset, not a generated one.';

  console.log('Edit B: Replaced "verifiable answer" with "answer retrieved from the published dataset" in Phase 3');
  return true;
}

// ============================================================
// Edit A.1: Insert bridging paragraph before GROQ demo
// after block d14124ee057e ("When content is structured...")
// ============================================================
function buildBridgingBlock() {
  return block('normal',
    'The website still delivers HTML to a browser \u2014 that part doesn\u2019t change. What changes is what sits behind the HTML. In a page builder, the page is the data: what you see is all there is. In a structured content system, the page is one view of data that also exists as typed records with stable identifiers. A human may never type a query. But an AI agent answering \u201cWhat programs does the science department offer?\u201d will \u2014 and when AI speaks for your organization, the question is whether it is retrieving named records or scraping paragraphs.'
  );
}

// ============================================================
// Edit A.2: Insert "verifiable" definition
// after block 49d10bd629ba ("copy-pasting the same name...")
// ============================================================
function buildVerifiableBlock() {
  return block('normal',
    'Verifiable, in this context, means each value in the response \u2014 the program title, the director\u2019s name, the email address \u2014 is retrieved from a named record with a stable identifier in the published dataset. Run the same query tomorrow and the response is identical, because the query is reading records, not generating text.'
  );
}


async function main() {
  // Fetch the document (draft first, then published)
  let doc = await client.getDocument(`drafts.${DOC_ID}`);
  if (!doc) {
    doc = await client.getDocument(DOC_ID);
  }
  if (!doc) {
    console.error(`Document ${DOC_ID} not found`);
    process.exit(1);
  }

  const body = [...doc.body];
  console.log(`Fetched document (${doc._id}). Body has ${body.length} blocks.`);

  // --- Edit C: "invisible to machines" ---
  if (!applyEditC(body)) process.exit(1);

  // --- Edit B: Phase 3 "verifiable" ---
  if (!applyEditB(body)) process.exit(1);

  // --- Edit A.2: Insert "verifiable" definition after 49d10bd629ba ---
  // (Insert later-in-document first so earlier indices don't shift)
  const demoExplIdx = body.findIndex(b => b._key === '49d10bd629ba');
  if (demoExplIdx === -1) { console.error('Edit A.2: block 49d10bd629ba not found'); process.exit(1); }
  const verifiableBlock = buildVerifiableBlock();
  body.splice(demoExplIdx + 1, 0, verifiableBlock);
  console.log('Edit A.2: Inserted "verifiable" definition after demo explanation');

  // --- Edit A.1: Insert bridging paragraph after d14124ee057e ---
  const introIdx = body.findIndex(b => b._key === 'd14124ee057e');
  if (introIdx === -1) { console.error('Edit A.1: block d14124ee057e not found'); process.exit(1); }
  const bridgingBlock = buildBridgingBlock();
  body.splice(introIdx + 1, 0, bridgingBlock);
  console.log('Edit A.1: Inserted bridging paragraph before GROQ demo');

  console.log(`\nFinal body: ${body.length} blocks (was ${doc.body.length})`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.\n');

    // Show Edit C
    console.log('Edit C — block ca340fd0765f:');
    const editCBlock = body.find(b => b._key === 'ca340fd0765f');
    console.log(`  ${editCBlock.children.map(c => c.text).join('')}\n`);

    // Show Edit A.1 neighborhood
    const bridgeIdx = body.indexOf(bridgingBlock);
    console.log('Edit A.1 — bridging paragraph (and neighbors):');
    for (const b of body.slice(bridgeIdx - 1, bridgeIdx + 2)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 60)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  [${b.style || b._type}] ${text.slice(0, 140)}`);
    }

    // Show Edit A.2 neighborhood
    const verIdx = body.indexOf(verifiableBlock);
    console.log('\nEdit A.2 — verifiable definition (and neighbors):');
    for (const b of body.slice(verIdx - 1, verIdx + 2)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 60)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  [${b.style || b._type}] ${text.slice(0, 140)}`);
    }

    // Show Edit B
    console.log('\nEdit B — block k169 (Phase 3):');
    const editBBlock = body.find(b => b._key === 'k169');
    console.log(`  ${editBBlock.children.map(c => c.text).join('')}`);

    return;
  }

  // Apply as draft
  await client.createOrReplace({
    ...doc,
    _id: `drafts.${DOC_ID}`,
    body,
  });

  console.log(`\nPatches applied to drafts.${DOC_ID}`);
  console.log('Review in Sanity Studio, then publish when ready.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
