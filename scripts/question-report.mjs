/*
 * question-report.mjs — what visitors actually ask the archive.
 *
 * Reads logs/feedback.jsonl and prints the asked questions grouped by
 * outcome (answered / deferred / error / offline), newest last. The
 * deferred group is the corpus-gap list: each entry is a question the
 * corpus could not answer — Ed reads it and decides what to add.
 *
 * Usage: node scripts/question-report.mjs [--json]
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const path = resolve(process.cwd(), 'logs', 'feedback.jsonl')
let lines
try {
  lines = readFileSync(path, 'utf-8').trim().split('\n')
} catch {
  console.log('No feedback log yet at logs/feedback.jsonl')
  process.exit(0)
}

const groups = { answered: [], deferred: [], error: [], offline: [], marks: [] }
for (const line of lines) {
  let e
  try {
    e = JSON.parse(line)
  } catch {
    continue
  }
  const a = String(e.anchor ?? '')
  if (a === 'archive:question-answered') groups.answered.push(e)
  else if (a === 'archive:question-deferred' || a === 'archive:question') groups.deferred.push(e)
  else if (a === 'archive:question-error' || a === 'archive:question-refused') groups.error.push(e)
  else if (a === 'archive:question-no-key') groups.offline.push(e)
  else groups.marks.push(e)
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(groups, null, 2))
  process.exit(0)
}

const show = (title, list) => {
  console.log(`\n== ${title} (${list.length}) ==`)
  for (const e of list) console.log(`  [${(e.ts ?? '').slice(0, 16)}] ${e.text}`)
}

show('DEFERRED — corpus gaps, read these first', groups.deferred)
show('Answered', groups.answered)
show('Errors/refusals', groups.error)
show('Asked while offline', groups.offline)
console.log(`\n(${groups.marks.length} page work-order marks not shown — they are build notes, not questions)`)
