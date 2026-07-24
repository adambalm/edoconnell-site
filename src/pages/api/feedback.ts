/*
 * POST /api/feedback — per-element feedback intake (the mark layer's target).
 *
 * Stores each note as one JSONL line in logs/feedback.jsonl. Writing feedback
 * into Sanity as `feedback` documents is the intended production path, but
 * dataset writes are gated behind an HO-approved content model + a fresh
 * dataset export — until that gate clears, this endpoint stays filesystem-only.
 * Precedent for the route shape: src/pages/api/contact.ts.
 */
import type { APIRoute } from 'astro'
import { appendFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

export const prerender = false

const MAX_TEXT = 4000
const MAX_ANCHOR = 120

export const POST: APIRoute = async ({ request }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid JSON' }), { status: 400 })
  }

  const { anchor, text, page, ts } = (body ?? {}) as Record<string, unknown>
  if (typeof anchor !== 'string' || typeof text !== 'string' || !anchor || !text) {
    return new Response(JSON.stringify({ ok: false, error: 'anchor and text required' }), {
      status: 400,
    })
  }

  const entry = {
    anchor: anchor.slice(0, MAX_ANCHOR),
    text: text.slice(0, MAX_TEXT),
    page: typeof page === 'string' ? page.slice(0, 200) : null,
    ts: typeof ts === 'string' ? ts.slice(0, 40) : new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  }

  try {
    const dir = resolve(process.cwd(), 'logs')
    mkdirSync(dir, { recursive: true })
    appendFileSync(resolve(dir, 'feedback.jsonl'), JSON.stringify(entry) + '\n')
  } catch (e) {
    console.error('[feedback] write failed:', e instanceof Error ? e.message : e)
    return new Response(JSON.stringify({ ok: false, error: 'store failed' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
