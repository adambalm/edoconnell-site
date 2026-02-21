/**
 * patch-sa-brief-v2.mjs — Editorial revisions round 2.
 *
 * Changes (7 total):
 *   1. Pin "AI-ready" definition in intro paragraph (block 8c0dcbd61e1c)
 *   2. Insert GO/NO-GO decision scaffold after intro (after block 0aa03d7d0303)
 *   3. Insert micro-demo with real GROQ after GO/NO-GO
 *   4. Soften "internet-trained guessing" (block k167)
 *   5. Scope "Every risk observed" claim (block k217)
 *   6. Rephrase deploy doctrine (block k129)
 *   7. Insert "Platform Mapping: Why Sanity" section (after block k131)
 *
 * Usage:
 *   node scripts/patch-sa-brief-v2.mjs --dry-run   # Preview changes
 *   node scripts/patch-sa-brief-v2.mjs              # Apply patches
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

function codeBlock(language, code) {
  return {
    _key: key(),
    _type: 'code',
    language,
    code,
  };
}

// ============================================================
// Edit 1: Pin "AI-ready" = queryable, governed, attributable
// Target: block 8c0dcbd61e1c — replace span 898f05b41fc5
// ============================================================
function applyEdit1(body) {
  const idx = body.findIndex(b => b._key === '8c0dcbd61e1c');
  if (idx === -1) { console.error('Edit 1: block 8c0dcbd61e1c not found'); return false; }

  // Replace the span that says: ' who needs a credible path to "AI-ready" and a '
  // with: ' who needs a credible path to "AI-ready" — content that is queryable, governed, and attributable — and a '
  const b = body[idx];
  const spanIdx = b.children.findIndex(s => s._key === '898f05b41fc5');
  if (spanIdx === -1) { console.error('Edit 1: span 898f05b41fc5 not found'); return false; }

  b.children[spanIdx].text = ' who needs a credible path to \u201cAI-ready\u201d \u2014 content that is queryable, governed, and attributable \u2014 and a ';
  console.log('Edit 1: Pinned "AI-ready" definition');
  return true;
}

// ============================================================
// Edit 2+3: Insert GO/NO-GO scaffold and micro-demo
// after block 0aa03d7d0303 (the "Next: the decision context..." paragraph)
// ============================================================
function buildGoNoGoBlocks() {
  return [
    block('h3', 'Should You Read Further? A Decision Scaffold'),

    block('normal', [
      span('This brief proposes a phased architecture. Before committing time to the details, an executive sponsor should be able to answer three questions. If any answer is '),
      span('no', ['strong']),
      span(', stop here \u2014 the approach won\u2019t fit.'),
    ]),

    block('normal', [
      span('Does the organization have content that is maintained in more than one place \u2014 or content that editors cannot update without developer help?', ['strong']),
      span(' If all content lives in one system and editors can publish independently, the problem this brief solves may not exist yet.'),
    ], { listItem: 'number' }),

    block('normal', [
      span('Is there an active or imminent mandate to use AI with institutional content?', ['strong']),
      span(' If AI is not on the roadmap, Phase 1 alone (structured content + editorial independence) may be sufficient. Phase 3 can wait.'),
    ], { listItem: 'number' }),

    block('normal', [
      span('Can the organization commit a content lead and a technical lead to a time-boxed proof of concept?', ['strong']),
      span(' The PoC requires two roles, not a team. But it does require dedicated time. If neither person exists, the constraint is staffing, not architecture.'),
    ], { listItem: 'number' }),

    block('normal', [
      span('Kill criteria:', ['strong']),
      span(' If discovery (Workshop 1) reveals fewer than three content types maintained in multiple places, the ROI of a structured content platform is unlikely to justify the migration cost. Recommend a simpler editorial tool instead.'),
    ]),

    block('normal', [
      span('What this brief is not:', ['strong']),
      span(' It is not a redesign proposal. It does not cover enterprise system integration (ERP, SIS, HRIS). It does not propose an AI product \u2014 it proposes the data layer that makes AI products possible without making them dangerous.'),
    ]),
  ];
}

function buildMicroDemoBlocks() {
  return [
    block('h3', 'What Structured Content Makes Possible: A 30-Second Demo'),

    block('normal', 'When content is structured as typed entities with explicit relationships, a single query can answer questions that would otherwise require a human to navigate multiple pages:'),

    codeBlock('groq', `// "What programs does the science department run, and who leads each?"
*[_type == "program" && department->name == "Science"] {
  title,
  status,
  "director": lead->{
    name,
    role,
    email
  }
}`),

    block('normal', 'The response is a predictable JSON shape:'),

    codeBlock('json', `[
  {
    "title": "Marine Biology Research Initiative",
    "status": "active",
    "director": {
      "name": "Dr. Sarah Chen",
      "role": "Program Director",
      "email": "s.chen@example.org"
    }
  }
]`),

    block('normal', [
      span('This is not a search result. It is a structured query against typed, validated data \u2014 the same data that renders the website, feeds the newsletter, and populates the annual report. An AI agent consuming this API gets a verifiable answer, not a generated guess. The '),
      span('->', ['code']),
      span(' operator follows the reference from program to person to department, resolving relationships that in a page builder would require copy-pasting the same name in three places.'),
    ]),
  ];
}

// ============================================================
// Edit 4: Soften "internet-trained guessing"
// Target: block k167, span k166
// ============================================================
function applyEdit4(body) {
  const idx = body.findIndex(b => b._key === 'k167');
  if (idx === -1) { console.error('Edit 4: block k167 not found'); return false; }

  body[idx].children[0].text = 'Goal: Enable AI capabilities that are grounded in structured institutional data \u2014 not general-purpose model output with no institutional context.';
  console.log('Edit 4: Softened "internet-trained guessing"');
  return true;
}

// ============================================================
// Edit 5: Scope "Every risk observed" claim
// Target: block k217, span k216
// ============================================================
function applyEdit5(body) {
  const idx = body.findIndex(b => b._key === 'k217');
  if (idx === -1) { console.error('Edit 5: block k217 not found'); return false; }

  body[idx].children[0].text = 'The risks below are common failure modes in content-managed organizations. Each control is designed to be enforceable at the platform level, not dependent on team discipline.';
  console.log('Edit 5: Scoped risk claim');
  return true;
}

// ============================================================
// Edit 6: Rephrase deploy doctrine
// Target: block k129, span k128
// ============================================================
function applyEdit6(body) {
  const idx = body.findIndex(b => b._key === 'k129');
  if (idx === -1) { console.error('Edit 6: block k129 not found'); return false; }

  const spanIdx = body[idx].children.findIndex(s => s._key === 'k128');
  if (spanIdx === -1) { console.error('Edit 6: span k128 not found'); return false; }

  body[idx].children[spanIdx].text = ' \u2014 Live content served via API. Deployments are explicit \u2014 CLI command or CI pipeline with approval gates. Git-triggered deploys are optional, not default. No surprises.';
  console.log('Edit 6: Rephrased deploy doctrine');
  return true;
}

// ============================================================
// Edit 7: Insert "Platform Mapping: Why Sanity" section
// after block k131 (last block of Environment Strategy)
// ============================================================
function buildSanityDifferentiators() {
  return [
    block('h3', 'Platform Mapping: Why Sanity'),

    block('normal', 'The patterns described above are not theoretical. Sanity provides specific platform capabilities that map to each architectural requirement:'),

    block('normal', [
      span('Draft/published document separation.', ['strong']),
      span(' Every document exists in two states. Editors work on drafts; publishing is an explicit action. There is no risk of in-progress edits appearing on the live site.'),
    ], { listItem: 'bullet' }),

    block('normal', [
      span('Schema-level validation.', ['strong']),
      span(' Required fields, reference integrity, and controlled vocabularies are enforced by the schema definition, not by editorial convention. An article without an author cannot be published \u2014 the studio won\u2019t allow it.'),
    ], { listItem: 'bullet' }),

    block('normal', [
      span('Role-based access control.', ['strong']),
      span(' Content studio permissions separate who can draft, who can publish, and who can modify the schema. These are platform-enforced boundaries, not shared-password workarounds.'),
    ], { listItem: 'bullet' }),

    block('normal', [
      span('Real-time visual editing.', ['strong']),
      span(' Editors see changes rendered on the actual frontend as they type. This closes the feedback loop between editing and previewing that causes most content-related bugs.'),
    ], { listItem: 'bullet' }),

    block('normal', [
      span('GROQ query language.', ['strong']),
      span(' Content is queryable via a purpose-built query language with reference expansion, ordering, and projection. AI agents and frontends consume the same API with the same query syntax.'),
    ], { listItem: 'bullet' }),

    block('normal', 'These are not unique-to-Sanity concepts \u2014 other structured content platforms implement some of them. What matters is that all five are available in a single platform with a single content API, which eliminates the integration overhead of assembling them from separate tools.'),
  ];
}


async function main() {
  // Fetch the published document (we'll create/update a draft)
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

  // --- Edit 1: Pin "AI-ready" definition ---
  if (!applyEdit1(body)) process.exit(1);

  // --- Edit 4: Soften "internet-trained guessing" ---
  if (!applyEdit4(body)) process.exit(1);

  // --- Edit 5: Scope risk claim ---
  if (!applyEdit5(body)) process.exit(1);

  // --- Edit 6: Rephrase deploy doctrine ---
  if (!applyEdit6(body)) process.exit(1);

  // --- Edit 7: Insert Sanity differentiators after k131 ---
  const k131Idx = body.findIndex(b => b._key === 'k131');
  if (k131Idx === -1) { console.error('Edit 7: block k131 not found'); process.exit(1); }
  const sanityBlocks = buildSanityDifferentiators();
  body.splice(k131Idx + 1, 0, ...sanityBlocks);
  console.log(`Edit 7: Inserted ${sanityBlocks.length} Sanity differentiator blocks after k131`);

  // --- Edits 2+3: Insert GO/NO-GO + micro-demo after 0aa03d7d0303 ---
  const introEndIdx = body.findIndex(b => b._key === '0aa03d7d0303');
  if (introEndIdx === -1) { console.error('Edits 2+3: block 0aa03d7d0303 not found'); process.exit(1); }
  const goNoGoBlocks = buildGoNoGoBlocks();
  const microDemoBlocks = buildMicroDemoBlocks();
  body.splice(introEndIdx + 1, 0, ...goNoGoBlocks, ...microDemoBlocks);
  console.log(`Edits 2+3: Inserted ${goNoGoBlocks.length} GO/NO-GO blocks and ${microDemoBlocks.length} micro-demo blocks after intro`);

  console.log(`\nFinal body: ${body.length} blocks (was ${doc.body.length})`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.\n');

    // Show GO/NO-GO neighborhood
    const goIdx = body.findIndex(b =>
      b.children?.some(c => c.text?.includes('Should You Read Further'))
    );
    console.log('GO/NO-GO section (first 4 blocks):');
    for (const b of body.slice(goIdx, goIdx + 4)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 60)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  [${b.style || b._type}] ${text.slice(0, 120)}`);
    }

    // Show micro-demo neighborhood
    const demoIdx = body.findIndex(b =>
      b.children?.some(c => c.text?.includes('30-Second Demo'))
    );
    console.log('\nMicro-demo section (first 4 blocks):');
    for (const b of body.slice(demoIdx, demoIdx + 4)) {
      const text = b._type === 'code'
        ? `[code:${b.language}] ${b.code.slice(0, 80)}...`
        : b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  [${b.style || b._type}] ${text.slice(0, 120)}`);
    }

    // Show Sanity differentiators
    const sanityIdx = body.findIndex(b =>
      b.children?.some(c => c.text?.includes('Platform Mapping'))
    );
    console.log('\nSanity differentiators (first 3 blocks):');
    for (const b of body.slice(sanityIdx, sanityIdx + 3)) {
      const text = b.children?.map(c => c.text).join('') || '(empty)';
      console.log(`  [${b.style || b._type}] ${text.slice(0, 120)}`);
    }

    // Show edited blocks
    console.log('\nEdited block k167 (Phase 3 goal):');
    const k167 = body.find(b => b._key === 'k167');
    console.log(`  ${k167.children.map(c => c.text).join('')}`);

    console.log('\nEdited block k217 (Risk intro):');
    const k217 = body.find(b => b._key === 'k217');
    console.log(`  ${k217.children.map(c => c.text).join('')}`);

    console.log('\nEdited block k129 (Deploy doctrine):');
    const k129 = body.find(b => b._key === 'k129');
    console.log(`  ${k129.children.map(c => c.text).join('')}`);

    console.log('\nEdited block 8c0dcbd61e1c (AI-ready pin):');
    const aiReady = body.find(b => b._key === '8c0dcbd61e1c');
    console.log(`  ${aiReady.children.map(c => c.text).join('')}`);

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
