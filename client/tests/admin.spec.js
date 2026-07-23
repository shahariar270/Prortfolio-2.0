import fs from 'node:fs'
import { test, expect } from '@playwright/test'
import { TOKEN_FILE } from './global-setup'

// dev credentials from server/.env.local (seeded via npm run seed:admin)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dev.shahariar.official@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

test('login screen appears without a token and rejects bad credentials', async ({ page }, testInfo) => {
    // functional, not responsive — the auth rate limit (20 req/15min) makes
    // repeating real login attempts across all 6 viewport projects wasteful
    test.skip(testInfo.project.name !== 'desktop-1440', 'runs once, not per viewport')

    // no addInitScript here — it re-fires on every navigation within a test,
    // which would silently restore a token removed mid-test
    await page.goto('/st-admin')
    await expect(page.locator('.st-admin__login-card')).toBeVisible()
    await page.fill('.st-admin__login-card input[type="email"]', ADMIN_EMAIL)
    await page.fill('.st-admin__login-card input[type="password"]', 'wrong-password')
    await page.locator('.st-admin__login-card button[type="submit"]').click()
    await expect(page.locator('.st-admin__login-error')).toBeVisible()
    // then a real login works
    await page.fill('.st-admin__login-card input[type="password"]', ADMIN_PASSWORD)
    await page.locator('.st-admin__login-card button[type="submit"]').click()
    await expect(page.locator('.st-admin__kpi').first()).toBeVisible()
})

test.describe('authenticated', () => {
    test.beforeEach(async ({ page }) => {
        // reuse the token global-setup logged in with once, rather than
        // hitting the rate-limited /auth/login endpoint per test
        const { token } = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'))
        await page.addInitScript((t) => {
            window.localStorage.setItem('st-admin-token', t)
        }, token)

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
            await page.locator('.st-admin__nav a', { hasText: label }).click()
            await expect(page.locator(marker).first()).toBeVisible()
            const { scrollWidth, clientWidth } = await page.evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
            }))
            expect(scrollWidth, `${label} view overflows`).toBeLessThanOrEqual(clientWidth + 1)
        }
    })

    test('post editor modal opens and closes', async ({ page }) => {
        await page.locator('.st-admin__nav a', { hasText: 'Posts' }).click()
        await page.locator('.st-admin__btn-primary', { hasText: 'New post' }).click()
        await expect(page.locator('.st-admin__modal')).toBeVisible()
        await page.locator('.st-admin__modal-foot .st-admin__btn-ghost').click()
        await expect(page.locator('.st-admin__modal')).toHaveCount(0)
    })

    test('sidebar navigation updates the URL and stays active on reload', async ({ page }) => {
        await expect(page).toHaveURL(/\/st-admin\/analytics$/)
        await expect(page.locator('.st-admin__nav a', { hasText: 'Site Analytics' })).toHaveClass(/is-active/)

        await page.locator('.st-admin__nav a', { hasText: 'Posts' }).click()
        await expect(page).toHaveURL(/\/st-admin\/posts$/)
        await expect(page.locator('.st-admin__nav a', { hasText: 'Posts' })).toHaveClass(/is-active/)
        await expect(page.locator('.st-admin__topbar h1')).toHaveText('Posts')

        // deep link: a fresh load of /st-admin/skills lands directly on Skills
        await page.goto('/st-admin/skills')
        await expect(page.locator('.st-admin__topbar h1')).toHaveText('Skills')
        await expect(page.locator('.st-admin__skill-row').first()).toBeVisible()

        // bare /st-admin redirects to the analytics tab
        await page.goto('/st-admin')
        await expect(page).toHaveURL(/\/st-admin\/analytics$/)
    })

    test('analytics reflects real tracked page views and reacts to range switch', async ({ page, request }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-1440', 'API aggregation is not viewport-dependent')

        // seed one real page view so the current period has a data point to show
        await request.post('http://localhost:3000/api/track', {
            data: { path: '/', visitor_id: `pw-test-${Date.now()}`, duration_ms: 5000 },
        })
        await page.reload()
        await page.waitForSelector('.st-admin__kpi')
        await expect(page.locator('.st-admin__chart-bar').first()).toBeVisible()

        await page.locator('.st-admin__range-switch button', { hasText: '30d' }).click()
        await expect(page.locator('.st-admin__range-switch button.is-active')).toHaveText('30d')
        await expect(page.locator('.st-admin__kpi').first()).toBeVisible()
    })
})
