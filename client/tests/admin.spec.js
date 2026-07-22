import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/st-admin')
    await page.waitForSelector('.st-admin__kpi')
    await page.evaluate(() => document.fonts.ready)
})

test('admin page has no horizontal overflow', async ({ page }) => {
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
})

test('all four admin views render without overflow', async ({ page }) => {
    const views = [
        ['Posts', '.st-admin__post'],
        ['Skills', '.st-admin__skill-row'],
        ['Taxonomy', '.st-admin__tax-row'],
        ['Site Analytics', '.st-admin__kpi'],
    ]
    for (const [label, marker] of views) {
        await page.locator('.st-admin__nav button', { hasText: label }).click()
        await expect(page.locator(marker).first()).toBeVisible()
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }))
        expect(scrollWidth, `${label} view overflows`).toBeLessThanOrEqual(clientWidth + 1)
    }
})

test('post editor modal opens and closes', async ({ page }) => {
    await page.locator('.st-admin__nav button', { hasText: 'Posts' }).click()
    await page.locator('.st-admin__btn-primary', { hasText: 'New post' }).click()
    await expect(page.locator('.st-admin__modal')).toBeVisible()
    await page.locator('.st-admin__modal-foot .st-admin__btn-ghost').click()
    await expect(page.locator('.st-admin__modal')).toHaveCount(0)
})

test('analytics range switch updates the chart', async ({ page }) => {
    await expect(page.locator('.st-admin__chart-bar')).toHaveCount(7)
    await page.locator('.st-admin__range-switch button', { hasText: '30d' }).click()
    await expect(page.locator('.st-admin__chart-bar')).toHaveCount(5)
})
