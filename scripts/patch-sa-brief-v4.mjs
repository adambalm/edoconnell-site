/**
 * patch-sa-brief-v4.mjs — Credibility and precision edits (8 changes).
 *
 * Based on forensic implementation review. Each edit addresses a specific
 * verifiability or precision gap:
 *
 *   1. Label GROQ demo as synthetic (before code block ccaacc3a5cdf)
 *   2. AI mandate acknowledgment (after block ca340fd0765f)
 *   3. Workshop 1 duration realism (block k44)
 *   4. Platform alternatives paragraph (after block 9496b9287da8)
 *   5. Fix "Real-time visual editing" wording (block 2f54b5b46442)
 *   6. PoC preview vs production clarity (after block k209)
 *   7. Editor "unfamiliar" phrasing — systems framing (block k245)
 *   8. Post-PoC migration realism (after block k213)
 *
 * Usage:
 *   node scripts/patch-sa-brief-v4.mjs --dry-run   # Preview changes
 *   node scripts/patch-sa-brief-v4.mjs              # Apply patches
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

function block(style, children, opts = {}) {
  return {
    _key: key(),
    _type: 'block',
    style,
    children: Array.isArray(children) ? children : [span(children)],
    ...(opts.listItem ? { listItem: opts.listItem, level: opts.level || 1 } : {}),
  };
}

// ============================================================
// Edit 1: Label GROQ demo as synthetic
// Insert one sentence before the GROQ code block (ccaacc3a5cdf)
// ============================================================
function applyEdit1(body) {
  const idx = body.findIndex(b => b._key === 'ccaacc3a5cdf');
  if (idx === -1) { console.error('Edit 1: code block ccaacc3a5cdf not found'); return false; }

  const label = block('normal',
    'Example query, shown for shape \u2014 not taken from this site\u2019s schema.'
  );
  body.splice(idx, 0, label);
  console.log('Edit 1: Inserted synthetic label before GROQ demo');
  return true;
}

// ============================================================
// Edit 2: AI mandate acknowledgment
// Add one sentence after the "AI amplifies" paragraph (ca340fd0765f)
// ============================================================
function applyEdit2(body) {
  const idx = body.findIndex(b => b._key === 'ca340fd0765f');
  if (idx === -1) { console.error('Edit 2: block ca340fd0765f not found'); return false; }

  const mandate = block('normal',
    'Assume the AI push is already decided. The question is how to do it without creating long-lived mess.'
  );
  body.splice(idx + 1, 0, mandate);
  console.log('Edit 2: Inserted AI mandate sentence after "AI amplifies" paragraph');
  return true;
}

// ============================================================
// Edit 3: Workshop 1 duration realism
// Replace span text in block k44
// ============================================================
function applyEdit3(body) {
  const idx = body.findIndex(b => b._key === 'k44');
  if (idx === -1) { console.error('Edit 3: block k44 not found'); return false; }

  const b = body[idx];
  const spanIdx = b.children.findIndex(s =>
    s.text && s.text.includes('Duration: 90 minutes')
  );
  if (spanIdx === -1) { console.error('Edit 3: "Duration: 90 minutes" span not found in k44'); return false; }

  b.children[spanIdx].text =
    'Duration: 90 minutes, plus 2\u20133 hours of pre-work distributed to attendees. If there are more than three active channels, schedule a second session. Attendees: Content leads, web team, one IT representative.';

  console.log('Edit 3: Updated Workshop 1 duration with pre-work and second-session condition');
  return true;
}

// ============================================================
// Edit 4: Platform alternatives paragraph
// Insert after the "not unique-to-Sanity" closing paragraph (9496b9287da8)
// ============================================================
function applyEdit4(body) {
  const idx = body.findIndex(b => b._key === '9496b9287da8');
  if (idx === -1) { console.error('Edit 4: block 9496b9287da8 not found'); return false; }

  const alt = block('normal',
    'Contentful, Strapi, and headless WordPress are viable alternatives depending on organizational constraints \u2014 existing infrastructure, team expertise, licensing budget. Sanity is selected here because it combines schema-level validation, a purpose-built query language (GROQ), Studio-side preview, and low DevOps overhead in a single platform. The architectural patterns transfer: typed content, reference integrity, governance metadata, API-first delivery. If you move to a different platform, the schema design and content model carry over. The query syntax changes; the thinking doesn\u2019t.'
  );
  body.splice(idx + 1, 0, alt);
  console.log('Edit 4: Inserted platform alternatives paragraph after Sanity mapping');
  return true;
}

// ============================================================
// Edit 5: Fix "Real-time visual editing" wording
// Replace span text in block 2f54b5b46442
// ============================================================
function applyEdit5(body) {
  const idx = body.findIndex(b => b._key === '2f54b5b46442');
  if (idx === -1) { console.error('Edit 5: block 2f54b5b46442 not found'); return false; }

  const b = body[idx];
  // Replace the bold label span
  const boldIdx = b.children.findIndex(s => s.marks && s.marks.includes('strong') && s.text.includes('visual editing'));
  if (boldIdx === -1) { console.error('Edit 5: bold "visual editing" span not found'); return false; }
  b.children[boldIdx].text = 'Studio-side preview and visual editing.';

  // Replace the description span
  const descIdx = b.children.findIndex(s => s.text && s.text.includes('Editors see changes rendered'));
  if (descIdx === -1) { console.error('Edit 5: description span not found'); return false; }
  b.children[descIdx].text =
    ' Editors preview drafts rendered on the actual frontend while editing, with draft/published separation preserved.';

  console.log('Edit 5: Replaced "Real-time visual editing" with accurate Studio-side wording');
  return true;
}

// ============================================================
// Edit 6: PoC preview vs production clarity
// Insert after acceptance test 6 (block k209)
// ============================================================
function applyEdit6(body) {
  const idx = body.findIndex(b => b._key === 'k209');
  if (idx === -1) { console.error('Edit 6: block k209 not found'); return false; }

  const clarity = block('normal',
    'Preview is token-gated and draft-aware; production delivery can be static or server-rendered, but published content remains the source of truth.'
  );
  body.splice(idx + 1, 0, clarity);
  console.log('Edit 6: Inserted PoC preview vs production clarification after acceptance tests');
  return true;
}

// ============================================================
// Edit 7: Editor "unfamiliar" phrasing — systems framing
// Target: block k245 contains "feels unfamiliar"
// ============================================================
function applyEdit7(body) {
  const idx = body.findIndex(b => b._key === 'k245');
  if (idx === -1) { console.error('Edit 7: block k245 not found'); return false; }

  const b = body[idx];
  const spanIdx = b.children.findIndex(s => s.text && s.text.includes('feels unfamiliar'));
  if (spanIdx === -1) {
    console.log('Edit 7: "feels unfamiliar" not found in k245 — NOT APPLICABLE');
    return true; // not a failure, just not present
  }

  b.children[spanIdx].text = b.children[spanIdx].text.replace(
    'because the content studio feels unfamiliar',
    'because the new workflow disrupts established patterns without an immediate compensating benefit'
  );

  console.log('Edit 7: Replaced editor-blame "feels unfamiliar" with systems framing');
  return true;
}

// ============================================================
// Edit 8: Post-PoC migration realism
// Insert after "What the PoC Does Not Cover" body (block k213)
// ============================================================
function applyEdit8(body) {
  const idx = body.findIndex(b => b._key === 'k213');
  if (idx === -1) { console.error('Edit 8: block k213 not found'); return false; }

  const realism = block('normal',
    'A passing PoC validates architecture, not migration difficulty. The usual Phase 1 failure is underestimating extraction from legacy page builders and PDFs. Budget content auditing as a separate workstream; some legacy content won\u2019t migrate cleanly and should be rebuilt or retired.'
  );
  body.splice(idx + 1, 0, realism);
  console.log('Edit 8: Inserted post-PoC migration realism paragraph');
  return true;
}


async function main() {
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

  // Apply edits in reverse document order so splice indices don't shift
  // Order by block position (latest first):
  //   Edit 8: k213 (PoC section)
  //   Edit 7: k245 (Risk section)  — text replacement, no splice
  //   Edit 6: k209 (Acceptance tests)
  //   Edit 5: 2f54b5b46442 (Why Sanity) — text replacement, no splice
  //   Edit 4: 9496b9287da8 (Why Sanity closing)
  //   Edit 3: k44 (Workshop 1) — text replacement, no splice
  //   Edit 2: ca340fd0765f (AI amplifies)
  //   Edit 1: ccaacc3a5cdf (GROQ demo)

  // Text replacements first (no index shifting)
  if (!applyEdit3(body)) process.exit(1);
  if (!applyEdit5(body)) process.exit(1);
  if (!applyEdit7(body)) process.exit(1);

  // Insertions in reverse document order
  if (!applyEdit8(body)) process.exit(1);  // k213
  if (!applyEdit6(body)) process.exit(1);  // k209
  if (!applyEdit4(body)) process.exit(1);  // 9496b9287da8
  if (!applyEdit2(body)) process.exit(1);  // ca340fd0765f
  if (!applyEdit1(body)) process.exit(1);  // ccaacc3a5cdf

  console.log(`\nFinal body: ${body.length} blocks (was ${doc.body.length})`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.\n');

    // Edit 1: synthetic label
    const synthIdx = body.findIndex(b => b._key === 'ccaacc3a5cdf') - 1;
    console.log('Edit 1 — synthetic label (before GROQ demo):');
    console.log(`  ${body[synthIdx].children.map(c => c.text).join('')}\n`);

    // Edit 2: mandate sentence
    const mandateIdx = body.findIndex(b => b._key === 'ca340fd0765f') + 1;
    console.log('Edit 2 — AI mandate (after "AI amplifies"):');
    console.log(`  ${body[mandateIdx].children.map(c => c.text).join('')}\n`);

    // Edit 3: workshop duration
    const k44 = body.find(b => b._key === 'k44');
    console.log('Edit 3 — Workshop 1 duration:');
    console.log(`  ${k44.children.map(c => c.text).join('')}\n`);

    // Edit 4: alternatives
    const altIdx = body.findIndex(b => b._key === '9496b9287da8') + 1;
    console.log('Edit 4 — Platform alternatives:');
    console.log(`  ${body[altIdx].children.map(c => c.text).join('').slice(0, 140)}...\n`);

    // Edit 5: visual editing
    const veBlock = body.find(b => b._key === '2f54b5b46442');
    console.log('Edit 5 — Visual editing wording:');
    console.log(`  ${veBlock.children.map(c => c.text).join('')}\n`);

    // Edit 6: PoC clarity
    const pocIdx = body.findIndex(b => b._key === 'k209') + 1;
    console.log('Edit 6 — PoC preview vs production:');
    console.log(`  ${body[pocIdx].children.map(c => c.text).join('')}\n`);

    // Edit 7: unfamiliar
    const k245 = body.find(b => b._key === 'k245');
    console.log('Edit 7 — Editor phrasing:');
    console.log(`  ${k245.children.map(c => c.text).join('')}\n`);

    // Edit 8: migration realism
    const migIdx = body.findIndex(b => b._key === 'k213') + 1;
    console.log('Edit 8 — Migration realism:');
    console.log(`  ${body[migIdx].children.map(c => c.text).join('')}`);

    return;
  }

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
