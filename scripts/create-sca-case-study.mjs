/**
 * create-sca-case-study.mjs
 *
 * Creates the SCA Headless CMS case-study article in Sanity as a draft.
 *
 * Idempotent by default — uses createIfNotExists so re-runs do not clobber
 * edits made in Studio. Pass --force to use createOrReplace and overwrite
 * the existing draft.
 *
 * Usage:
 *   node scripts/create-sca-case-study.mjs --dry-run
 *   node scripts/create-sca-case-study.mjs            # idempotent create
 *   node scripts/create-sca-case-study.mjs --force    # overwrite draft
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env.local') })

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j'
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_WRITE_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')

const DOC_ID = 'd4e18c56-3a1a-40cd-8e44-7fe0160b4c47'
const SLUG = 'sca-headless-cms'

if (!TOKEN && !DRY_RUN) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
})

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function span(text, marks = []) {
  return { _key: key(), _type: 'span', text, marks }
}

function block(style, children, markDefs = []) {
  return {
    _key: key(),
    _type: 'block',
    style,
    markDefs,
    children: Array.isArray(children) ? children : [span(children)],
  }
}

function buildBody() {
  const blocks = []

  blocks.push(
    block(
      'normal',
      "Springfield Commonwealth Academy was running its public site on a Webflow build. Editors waited on a marketing vendor for routine updates. The pages had no structured layer underneath; everything was HTML rendered from a designer's canvas, and adding a new section meant cloning the closest neighbor and editing in place."
    )
  )

  blocks.push(block('h2', 'The problem we were overcoming'))
  blocks.push(
    block(
      'normal',
      'Editors could not change copy without a contractor. There was no way for a developer to ship a new content type without rebuilding the page. The site looked fine. Underneath, it was inert.'
    )
  )

  blocks.push(block('h2', 'Why structured content'))
  blocks.push(
    block(
      'normal',
      'Sanity treats content as queryable data. GROQ retrieves it. Portable Text holds prose without locking it to one rendering target. Editors compose pages from typed blocks; engineers add a block once and every editor gets it. The same content can render to a web page, an OG card, or a JSON-LD payload — without rewriting it.'
    )
  )

  blocks.push(block('h2', 'What I built'))
  blocks.push(
    block(
      'normal',
      'An Astro frontend on Vercel. A Sanity Studio. A schema with eleven page-builder blocks and a separate, state-machine-backed document type for student projects. A content extraction pipeline from the Webflow source, including image rehosting. Reference pages — block library, reskinning guide, platform overview — written for editors and successors, not just for me.'
    )
  )

  blocks.push(block('h2', 'How I work'))
  blocks.push(
    block(
      'normal',
      "AI generates code and prose. Verification is the part I don't delegate. Tooling catches what generation misses: typecheck, axe-core, Lighthouse, Playwright, manual API reads. AI-assisted documents on this site carry a provenance object — author, generator, reviewer, context, date. When the agent toolkit silently rewrote prose, I documented the behavior gap and filed it upstream."
    )
  )

  blocks.push(block('h2', 'What I am still refining'))
  blocks.push(
    block(
      'normal',
      'The student-project workflow has no formal review stage between provisioning complete and public visibility — the visibility toggle is the only gate. Provisioning is polling-driven, not webhook-driven; that was deliberate, but the migration path is on the list. Tool selection between Claude, GPT, and Gemini for a given role is empirical, not formalized. Most of the multi-agent work has been solo or two-party; team-scale evidence is limited.'
    )
  )

  return blocks
}

async function main() {
  const body = buildBody()
  console.log(`Built ${body.length} Portable Text blocks.`)
  const headings = body.filter((b) => b.style === 'h2')
  console.log(`Sections: ${headings.map((h) => h.children[0].text).join(' | ')}`)

  const doc = {
    _id: `drafts.${DOC_ID}`,
    _type: 'article',
    title: 'SCA Headless CMS',
    slug: { _type: 'slug', current: SLUG },
    kind: 'case-study',
    subtitle:
      'Migrating a school site from Webflow to Astro and Sanity — and writing the documentation that lets editors and successors take it from here.',
    abstract:
      'A retrospective on migrating Springfield Commonwealth Academy from Webflow to a headless stack — Sanity, Astro, Vercel — with a focus on what got built, how I work with AI assistance, and the gaps I am still closing.',
    body,
    epistemicStatus: 'working',
    publicationReadiness: 'internal',
    audienceContext:
      'Anyone evaluating implementation judgment on a headless-CMS migration. Assumes familiarity with content modeling and basic web architecture.',
    provenance: {
      _type: 'provenance',
      author: "Ed O'Connell",
      generatedBy: 'AI-assisted with human authorship and review',
      reviewedBy: "Ed O'Connell",
      context: 'Portfolio case study, May 2026',
      date: '2026-05-07',
    },
    seo: {
      _type: 'seo',
      metaTitle: 'SCA Headless CMS',
      metaDescription:
        'Migrating a school site from Webflow to Astro and Sanity. What got built, how I work, what I am still refining.',
    },
  }

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.\n')
    console.log(JSON.stringify({ ...doc, body: `[${body.length} PT blocks]` }, null, 2))
    return
  }

  if (FORCE) {
    const result = await client.createOrReplace(doc)
    console.log(`\nDraft replaced (force): ${result._id} (rev ${result._rev})`)
  } else {
    const result = await client.createIfNotExists(doc)
    if (result._rev === doc._rev) {
      console.log(`\nDraft already exists at ${doc._id} — no changes. Use --force to overwrite.`)
    } else {
      console.log(`\nDraft created: ${result._id} (rev ${result._rev})`)
    }
  }

  console.log(`Slug: ${SLUG}`)
  console.log(`Public URL after publish: /case-studies/${SLUG}`)
  console.log('\nReview in Sanity Studio at /admin (or sca-admin.sanity.studio), then publish when ready.')
}

main().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
