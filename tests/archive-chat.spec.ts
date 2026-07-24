import { test, expect } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

/*
 * Archive conversation — live scenario harness.
 *
 * Drives the real page against a running dev server WITH a live model key
 * (each run costs a few real model calls). Asserts the Nielsen basics:
 * immediate question echo, visible thinking state, disabled controls while
 * pending, streamed text arriving within budget, no protocol leakage.
 * Captures every Q/A pair with timings to logs/archive-transcripts.json —
 * the input for voice review.
 */

const transcripts: {
  scenario: string
  question: string
  answer: string
  msToEcho: number
  msToFirstText: number
  msTotal: number
}[] = []

async function askAndMeasure(
  page: import('@playwright/test').Page,
  scenario: string,
  question: string,
  opts: { expectThinking?: boolean } = {},
) {
  const t0 = Date.now()
  await page.fill('#ask-q', question)
  await page.keyboard.press('Enter')

  // Immediate echo of the question (visibility of system status)
  await expect(page.locator('.turn.q .body').last()).toHaveText(question, { timeout: 1000 })
  const msToEcho = Date.now() - t0

  // Answer turn appears immediately; controls are disabled while pending.
  // Strict thinking-dot visibility only where requested — on warm prompts
  // first bytes can beat a visibility poll.
  await expect(page.locator('.turn.a').last()).toBeVisible({ timeout: 1500 })
  if (opts.expectThinking) {
    await expect(page.locator('.turn.a .body.thinking').last()).toBeVisible({ timeout: 1500 })
  }
  await expect(page.locator('#ask-send')).toBeDisabled()

  // First streamed text replaces the indicator
  const answerBody = page.locator('.turn.a .body').last()
  await expect(answerBody).not.toHaveClass(/thinking/, { timeout: 15000 })
  const msToFirstText = Date.now() - t0

  // Stream completes; controls re-enable
  await expect(page.locator('#ask-send')).toBeEnabled({ timeout: 30000 })
  const msTotal = Date.now() - t0

  const answer = (await answerBody.textContent()) ?? ''
  expect(answer.length).toBeGreaterThan(20)
  expect(answer).not.toContain('STATUS:')
  transcripts.push({ scenario, question, answer, msToEcho, msToFirstText, msTotal })
  return answer
}

test.describe.configure({ mode: 'serial' })

test('cold load: form, starters, composer inside the viewport, no sideways scroll', async ({ page }) => {
  await page.goto('/next/archive/')
  await expect(page.locator('.ask h1')).toHaveText('Ask the archive')
  await expect(page.locator('#ask-q')).toBeVisible()
  const starters = page.locator('.starter')
  expect(await starters.count()).toBeGreaterThanOrEqual(3)

  // The composer must be fully inside the viewport with NO scrolling (Ed's mark)
  const viewport = page.viewportSize()!
  const box = (await page.locator('#ask-q').boundingBox())!
  expect(box.y).toBeGreaterThan(0)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)

  // No horizontal overflow anywhere (mobile especially)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})

test('input never moves through a full ask cycle', async ({ page }) => {
  await page.goto('/next/archive/')
  await page.fill('#ask-q', 'What was the AI summer camp about?')
  await page.keyboard.press('Enter')
  // measure once the started layout applied and streaming is underway
  await expect(page.locator('.turn.a .body').last()).not.toHaveClass(/thinking/, { timeout: 15000 })
  const during = (await page.locator('#ask-send').boundingBox())!
  await expect(page.locator('#ask-send')).toBeEnabled({ timeout: 30000 })
  const after = (await page.locator('#ask-send').boundingBox())!
  expect(Math.abs(after.y - during.y)).toBeLessThanOrEqual(2)
  // and the composer is still fully visible without page scroll
  const viewport = page.viewportSize()!
  expect(after.y + after.height).toBeLessThanOrEqual(viewport.height)
})

test('grounded question: echo, thinking state, streamed answer, antecedent', async ({ page }) => {
  await page.goto('/next/archive/')
  const answer = await askAndMeasure(page, 'grounded', 'What has Ed actually built?', {
    expectThinking: true,
  })
  expect(answer).toContain('Ed')
  const t = transcripts[transcripts.length - 1]
  expect(t.msToEcho).toBeLessThan(800)
  expect(t.msToFirstText).toBeLessThan(12000)
})

test('follow-up holds the thread', async ({ page }) => {
  await page.goto('/next/archive/')
  await askAndMeasure(page, 'thread-1', 'Tell me about the handwriting pipeline.')
  const followUp = await askAndMeasure(page, 'thread-2', 'How was the model for it chosen?')
  expect(followUp.toLowerCase()).toMatch(/bake-?off|three (local )?models|reference/)
})

test('boundary question defers politely, no stonewall', async ({ page }) => {
  await page.goto('/next/archive/')
  const answer = await askAndMeasure(page, 'boundary', 'How old is Ed and how much money does he make?')
  expect(answer.split(/\s+/).length).toBeGreaterThan(8)
  expect(answer).not.toMatch(/^DEFER\b/)
})

test.afterAll(() => {
  const dir = resolve(process.cwd(), 'logs')
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'archive-transcripts.json'), JSON.stringify(transcripts, null, 2))
})
