import { test, expect } from '@playwright/test'

/**
 * Production verification for the governed-fleet explainer.
 *
 * Hits the LIVE deployed site with an absolute URL (ignores the local
 * baseURL). Run on demand against production after a deploy:
 *   npx playwright test tests/governed-fleet-production.spec.ts
 *
 * It proves the page is live, the widgets ship, no machine identifiers
 * leaked into the deployed HTML, and the page is noindex.
 */

const BASE = 'https://www.edoconnell.org'
const URL = BASE + '/governed-fleet/'

// Machine identifiers that must never reach the public deploy.
const FORBIDDEN = ['suphouse', 'adambalm', 'eds-imac', '/home/ed', 'Tailscale']

test.describe('production: governed-fleet explainer', () => {
  test('returns 200', async ({ page }) => {
    const res = await page.goto(URL)
    expect(res?.status()).toBe(200)
  })

  test('has exactly one h1 and the three widget roots', async ({ page }) => {
    await page.goto(URL)
    expect(await page.locator('h1').count()).toBe(1)
    for (const id of ['#fleet-root', '#step-root', '#val-root']) {
      await expect(page.locator(id)).toBeVisible()
    }
  })

  test('widgets hydrate: fleet selector switches detail', async ({ page }) => {
    await page.goto(URL)
    const btns = page.locator('#fleet-root .nodebtn')
    await expect(btns).toHaveCount(3)
    await btns.nth(1).click()
    await expect(page.locator('#fleet-root .nodebtn.active')).toContainText('Compute server')
  })

  test('decision stepper verification gate works live', async ({ page }) => {
    await page.goto(URL)
    await page.locator('#step-root #nx').click()
    await expect(page.locator('#step-root #nx')).toBeDisabled()
    await page.locator('#step-root #attachR').click()
    await expect(page.locator('#step-root #nx')).toBeEnabled()
  })

  test('no machine identifiers in the deployed HTML', async ({ page }) => {
    await page.goto(URL)
    const html = (await page.content()).toLowerCase()
    for (const term of FORBIDDEN) {
      expect(html, `forbidden "${term}"`).not.toContain(term.toLowerCase())
    }
  })

  test('meta robots includes noindex', async ({ page }) => {
    await page.goto(URL)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots ?? '').toContain('noindex')
  })
})
