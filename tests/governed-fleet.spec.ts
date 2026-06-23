import { test, expect } from '@playwright/test'

/**
 * Governed-fleet explainer — interactive behavior + redaction.
 *
 * Runs against the local dev server (baseURL). Structural a11y (axe) is
 * covered automatically by accessibility.spec.ts, which discovers this
 * prerendered page from dist/client. This spec asserts the three widgets
 * behave (gates actually gate) and that no machine identifiers leak.
 */

const ROUTE = '/governed-fleet/'

test.describe('Governed fleet explainer', () => {
  test('loads with a single h1 and all three widgets', async ({ page }) => {
    await page.goto(ROUTE)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#fleet-root')).toBeVisible()
    await expect(page.locator('#step-root')).toBeVisible()
    await expect(page.locator('#val-root')).toBeVisible()
  })

  test('no machine identifiers leak into the rendered DOM', async ({ page }) => {
    await page.goto(ROUTE)
    const text = (await page.locator('body').innerText()).toLowerCase()
    for (const id of ['suphouse', 'adambalm', 'eds-imac']) {
      expect(text, `machine id "${id}" must not appear`).not.toContain(id)
    }
  })

  test('fleet selector renders three nodes and switches the detail panel', async ({ page }) => {
    await page.goto(ROUTE)
    const btns = page.locator('#fleet-root .nodebtn')
    await expect(btns).toHaveCount(3)
    await expect(page.locator('#fleet-root .nodebtn.active')).toContainText('Primary workstation')
    await btns.nth(1).click()
    await expect(page.locator('#fleet-root .nodebtn.active')).toContainText('Compute server')
    await expect(page.locator('#fleet-root .card')).toContainText('Replica + compute')
  })

  test('decision stepper blocks Next at the verification gate until a receipt is attached', async ({ page }) => {
    await page.goto(ROUTE)
    await page.locator('#step-root #nx').click() // step 1 -> 2 (receipt gate)
    await expect(page.locator('#step-root #nx')).toBeDisabled()
    await expect(page.locator('#step-root .receipt')).toContainText('no state-receipt')
    await page.locator('#step-root #attachR').click()
    await expect(page.locator('#step-root .receipt')).toContainText('FRESHEN-OK')
    await expect(page.locator('#step-root #nx')).toBeEnabled()
  })

  test('decision stepper blocks at the human gate and reaches the counterfactual', async ({ page }) => {
    await page.goto(ROUTE)
    const next = () => page.locator('#step-root #nx')
    await next().click()                       // 1 -> 2
    await page.locator('#step-root #attachR').click()
    for (let i = 0; i < 4; i++) await next().click() // 2 -> 3 -> 4 -> 5 -> 6 (human gate)
    await expect(next()).toBeDisabled()
    await page.locator('#step-root #approveH').click()
    await expect(next()).toBeEnabled()
    await next().click()                       // 6 -> 7
    await next().click()                       // 7 -> 8 (last)
    await expect(page.locator('#step-root .banner.warn')).toContainText('Counterfactual')
    await expect(next()).toBeDisabled()
  })

  test('validity stepper advances a claim through supersession', async ({ page }) => {
    await page.goto(ROUTE)
    const adv = page.locator('#val-root #vf')
    await expect(page.locator('#val-root')).toContainText('Trusted')
    await adv.click()
    await expect(page.locator('#val-root .banner.warn')).toBeVisible()
    await adv.click()
    await expect(page.locator('#val-root .banner.dead')).toContainText('Superseded')
    await expect(page.locator('#val-root #vf')).toBeDisabled()
    await page.locator('#val-root #kCmd').click() // switch claim resets to Trusted
    await expect(page.locator('#val-root')).toContainText('Recovery command')
    await expect(page.locator('#val-root')).toContainText('Trusted')
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto(ROUTE)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(2)
  })

  test('site nav exposes the fleet link', async ({ page }) => {
    await page.goto('/')
    // The home quick-nav is visible on every viewport (the header desktop nav
    // is hidden on mobile and the mobile menu is collapsed by default).
    await expect(page.locator('.home-nav a[href="/governed-fleet/"]')).toBeVisible()
  })
})
