/*
 * agent-write.mjs — the ONLY sanctioned path for agent mutations of site content.
 *
 * Enforces the per-document `agentEditable` flag and logs every mutation to
 * logs/agent-mutations.jsonl (tracked in git — the log is a receipt).
 *
 * HONEST BOUNDARY (stated in content-architecture.md): Sanity tokens scope to
 * dataset roles, not documents. This gateway binds agents because it is the only
 * path agents are given — the platform does not enforce the flag. Keep the write
 * token out of agent prompts; it belongs only in this script's environment.
 *
 * Usage:
 *   node scripts/agent-write.mjs --id <docId> --set '<json>' [--agent <name>] [--execute]
 *
 * Without --execute this is a dry run: it reads the document, reports what would
 * change, and writes nothing. Requires SANITY_API_WRITE_TOKEN (from .env.local).
 */
import { createClient } from '@sanity/client'
import { appendFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import 'dotenv/config'

const args = process.argv.slice(2)
const getArg = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}
const has = (name) => args.includes(`--${name}`)

const id = getArg('id')
const setJson = getArg('set')
const agent = getArg('agent') ?? 'unnamed-agent'
const execute = has('execute')

if (!id || !setJson) {
  console.error('Usage: node scripts/agent-write.mjs --id <docId> --set \'<json>\' [--agent <name>] [--execute]')
  process.exit(1)
}

let patch
try {
  patch = JSON.parse(setJson)
} catch {
  console.error('agent-write: --set is not valid JSON')
  process.exit(1)
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? 'zu6l9t4j'
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('agent-write: SANITY_API_WRITE_TOKEN missing (expected in .env.local)')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

const doc = await client.getDocument(id)
if (!doc) {
  console.error(`agent-write: document ${id} not found`)
  process.exit(1)
}

if (doc.agentEditable !== true) {
  console.error(`agent-write: REFUSED — ${id} (${doc._type} "${doc.title ?? id}") has agentEditable=${String(doc.agentEditable)}.`)
  console.error('Only documents Ed has explicitly flagged agentEditable=true may be modified by agents.')
  process.exit(2)
}

console.log(`agent-write: ${execute ? 'EXECUTING' : 'dry run'} on ${id} (${doc._type} "${doc.title ?? id}")`)
console.log('  fields to set:', Object.keys(patch).join(', '))

if (!execute) {
  console.log('  no write performed. Re-run with --execute to apply.')
  process.exit(0)
}

const result = await client.patch(id).set(patch).commit()

const __dirname = dirname(fileURLToPath(import.meta.url))
const logPath = resolve(__dirname, '..', 'logs', 'agent-mutations.jsonl')
mkdirSync(dirname(logPath), { recursive: true })
appendFileSync(
  logPath,
  JSON.stringify({
    at: new Date().toISOString(),
    agent,
    id,
    type: doc._type,
    title: doc.title ?? null,
    set: Object.keys(patch),
    revBefore: doc._rev,
    revAfter: result._rev,
  }) + '\n',
)

console.log(`agent-write: applied. rev ${doc._rev} -> ${result._rev}; logged to logs/agent-mutations.jsonl`)
