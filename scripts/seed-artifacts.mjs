/*
 * seed-artifacts.mjs — seed the `artifact` documents from the framing-sweep
 * inventory (2026-07-24, every row verified by direct read that session).
 *
 * EXECUTE-GATED: dry run by default; nothing is written until --execute.
 * DO NOT run --execute before (1) Ed approves the content model at a
 * checkpoint and (2) a fresh `sanity dataset export` restore point exists.
 *
 * lastChecked is set ONLY where a real check ran (curl 200s, 2026-07-24).
 * Receipts carry only public URLs — no employer-identifying URL until Ed's
 * naming ruling (see framing-sweep.md).
 */
import { createClient } from '@sanity/client'
import process from 'node:process'
import 'dotenv/config'

const execute = process.argv.includes('--execute')

const SEEDS = [
  {
    _id: 'artifact-school-platform',
    title: 'School platform',
    kind: 'work',
    status: 'running',
    lastChecked: '2026-07-24',
    summary: "A school's public web presence, rebuilt end to end on structured content — four live domains.",
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-solar-companion',
    title: 'Solar decision companion',
    kind: 'work',
    status: 'working',
    summary: 'A home-solar decision calculator built on one real house, being generalized for any household.',
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-enrollment-automations',
    title: 'Enrollment automations',
    kind: 'work',
    status: 'in-use',
    summary: 'School enrollment paperwork cut from a week to a day.',
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-ai-summer-camp',
    title: 'AI summer camp',
    kind: 'work',
    status: 'concluded',
    statusDetail: 'Jul 2026',
    summary: 'An AI curriculum for students, built on daily handwritten journals.',
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-classroom-intelligence',
    title: 'Classroom intelligence',
    kind: 'work',
    status: 'designed',
    summary: "A teacher's structured, private view of student progress.",
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-talking-character',
    title: 'Talking character',
    kind: 'craft',
    status: 'experiment',
    summary: 'A drawn face taught to speak, generated and lip-synced on my own GPU.',
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-hand-drawn-layouts',
    title: 'Hand-drawn layouts',
    kind: 'craft',
    status: 'experiment',
    summary: 'Web pages drawn by hand first, then built responsive.',
    yearStart: 2026,
    yearsDisplay: '2026',
  },
  {
    _id: 'artifact-handwriting-pipeline',
    title: 'Handwriting pipeline',
    kind: 'craft',
    status: 'working',
    summary: 'About a thousand notebook pages, parsed, transcribed, and read by machines.',
    yearStart: 2025,
    yearsDisplay: '2025–',
  },
  {
    _id: 'artifact-music-to-video',
    title: 'Music-to-video pipeline',
    kind: 'craft',
    status: 'working',
    summary: 'A finished lyric video generated from a song file.',
    yearStart: 2025,
    yearsDisplay: '2025–',
  },
  {
    _id: 'artifact-three-machine-fleet',
    title: 'Three-machine fleet',
    kind: 'work',
    status: 'running',
    summary: 'Local models, shared memory, one private network.',
    yearStart: 2025,
    yearsDisplay: '2025–',
  },
  {
    _id: 'artifact-magazine-templates',
    title: 'University magazine templates',
    kind: 'work',
    status: 'running',
    statusDetail: 'still',
    lastChecked: '2026-07-24',
    summary: 'Publishing templates built for a university magazine, still serving it today.',
    yearStart: 2016,
    yearsDisplay: '2016–2024',
    receipts: [{ _type: 'receipt', _key: 'r1', label: 'magazine.wne.edu', url: 'https://magazine.wne.edu', checked: '2026-07-24' }],
  },
  {
    _id: 'artifact-university-cms',
    title: 'Two university CMS platforms',
    kind: 'work',
    status: 'retired',
    statusDetail: 'after long service',
    summary: 'Two content platforms co-built from scratch, carried through two migrations.',
    yearStart: 2002,
    yearsDisplay: '2002–2015',
  },
]

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'zu6l9t4j'
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

console.log(`seed-artifacts: ${SEEDS.length} nodes, target ${projectId}/${dataset}, ${execute ? 'EXECUTE' : 'dry run'}`)

if (!execute) {
  for (const s of SEEDS) console.log(`  would create ${s._id}: "${s.title}" (${s.kind} · ${s.status})`)
  console.log('No writes performed. Gate: Ed-approved content model + fresh dataset export, then --execute.')
  process.exit(0)
}

if (!token) {
  console.error('seed-artifacts: SANITY_API_WRITE_TOKEN missing')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })
for (const s of SEEDS) {
  const doc = {
    _type: 'artifact',
    agentEditable: false,
    slug: { _type: 'slug', current: s._id.replace(/^artifact-/, '') },
    provenance: {
      _type: 'provenance',
      generatedBy: 'Claude (redesign goal, session 9c020d90)',
      context: 'Seeded from the 2026-07-24 framing-sweep inventory; every row verified by direct read.',
      date: '2026-07-24',
    },
    ...s,
  }
  const res = await client.createIfNotExists(doc)
  console.log(`  ${res._id} ok`)
}
console.log('seed-artifacts: done. createIfNotExists — existing documents were not touched.')
