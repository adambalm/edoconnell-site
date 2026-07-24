import { test, expect } from '@playwright/test'

/*
 * /next preview namespace — smoke coverage.
 *
 * Every node page renders with a single h1 and the draft stamp; the feedback
 * endpoint accepts a well-formed note and rejects a malformed one. Runs
 * against the same dev server as the a11y suite.
 */

const pages = [
  { path: '/next/', h1: "Ed O'Connell" },
  { path: '/next/hai-camp-retrospective/', h1: 'The work looked finished before the thinking was.' },
  { path: '/next/solar-companion/', h1: 'Solar decision companion' },
  { path: '/next/talking-character/', h1: 'Talking character' },
  { path: '/next/classroom-intelligence/', h1: 'Classroom intelligence' },
  { path: '/next/handwriting-pipeline/', h1: 'Handwriting pipeline' },
  { path: '/next/enrollment-automations/', h1: 'Enrollment automations' },
  { path: '/next/music-to-video/', h1: 'Music-to-video pipeline' },
  { path: '/next/hand-drawn-layouts/', h1: 'Hand-drawn layouts' },
  { path: '/next/university-cms/', h1: 'Two university CMS platforms' },
  { path: '/next/archive/', h1: 'Ask the archive' },
]

for (const { path, h1 } of pages) {
  test(`${path} renders`, async ({ page }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(page.locator('main h1, article h1, .idx h1')).toHaveText(h1)
  })
}

test('index rows carry visible note buttons', async ({ page }) => {
  await page.goto('/next/')
  const buttons = page.locator('.marknote-btn')
  expect(await buttons.count()).toBeGreaterThan(10)
  await expect(buttons.first()).toBeVisible()
})

test('/api/feedback accepts a valid note', async ({ request }) => {
  const res = await request.post('/api/feedback', {
    data: { anchor: 'test:spec', text: 'smoke-test note', page: '/next/', ts: new Date().toISOString() },
  })
  expect(res.status()).toBe(200)
  expect((await res.json()).ok).toBe(true)
})

test('/api/feedback rejects a malformed note', async ({ request }) => {
  const res = await request.post('/api/feedback', { data: { nothing: true } })
  expect(res.status()).toBe(400)
})
