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

async function askAndMeasure(page: import('@playwright/test').Page, scenario: string, question: string) {
  const t0 = Date.now()
  await page.fill('#ask-q', question)
  await page.keyboard.press('Enter')

  // Immediate echo of the question (visibility of system status)
  await expect(page.locator('.turn.q .body').last()).toHaveText(question, { timeout: 1000 })
  const msToEcho = Date.now() - t0

  // Thinking indicator appears; controls are disabled
  await expect(page.locator('.turn.a .body.thinking').last()).toBeVisible({ timeout: 1500 })
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

test('cold load: form, starters, and no dead surface', async ({ page }) => {
  await page.goto('/next/archive/')
  await expect(page.locator('h1')).toHaveText('Ask the archive')
  await expect(page.locator('#ask-q')).toBeVisible()
  const starters = page.locator('.starter')
  expect(await starters.count()).toBeGreaterThanOrEqual(3)
})

test('grounded question: echo, thinking state, streamed answer, antecedent', async ({ page }) => {
  await page.goto('/next/archive/')
  const answer = await askAndMeasure(page, 'grounded', 'What has Ed actually built?')
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
