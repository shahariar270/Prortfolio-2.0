import { test, expect } from '@playwright/test'

const SECTION_IDS = ['sec-home', 'sec-about', 'sec-skill', 'sec-project', 'sec-blog', 'sec-contact']
const MOBILE_BREAKPOINT = 640

const isMobileRail = (viewport) => viewport.width <= MOBILE_BREAKPOINT

/** Elements wider than the viewport, reported as "tag.class (width)" for diagnosis. */
const findOverflowingElements = (page) =>
    page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const offenders = []
        for (const el of document.querySelectorAll('body *')) {
            const rect = el.getBoundingClientRect()
            if (rect.width > vw + 1 || rect.right > vw + 1) {
                const cls = typeof el.className === 'string' && el.className ? `.${el.className.split(' ')[0]}` : ''
                offenders.push(`${el.tagName.toLowerCase()}${cls} right=${Math.round(rect.right)} w=${Math.round(rect.width)} (vw=${vw})`)
            }
        }
        return offenders.slice(0, 12)
    })

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.st-editorial__hero h1')
    await page.evaluate(() => document.fonts.ready)
})

test('page has no horizontal overflow', async ({ page }) => {
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
    }))
    const offenders = await findOverflowingElements(page)
    expect(scrollWidth, `overflowing elements:\n${offenders.join('\n')}`).toBeLessThanOrEqual(clientWidth + 1)
})

test('every section fits inside the viewport width', async ({ page }) => {
    for (const id of SECTION_IDS) {
        await page.evaluate((secId) => {
            window.scrollTo({ top: document.getElementById(secId).offsetTop, behavior: 'auto' })
        }, id)
        await page.waitForTimeout(100)
        const offenders = await findOverflowingElements(page)
        expect(offenders, `section ${id} overflows:\n${offenders.join('\n')}`).toEqual([])
    }
})

test('rail nav adapts to the viewport', async ({ page, viewport }) => {
    const rail = page.locator('.st-editorial__rail')
    await expect(rail).toBeVisible()
    const box = await rail.boundingBox()

    if (isMobileRail(viewport)) {
        // bottom bar spanning the full width
        expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1)
        expect(box.y + box.height).toBeGreaterThanOrEqual(viewport.height - 1)
        // main content must not sit behind the bar horizontally
        const mainBox = await page.locator('.st-editorial__main').boundingBox()
        expect(mainBox.x).toBe(0)
    } else {
        // fixed left rail, main offset by its width
        expect(box.x).toBe(0)
        expect(box.width).toBe(84)
        expect(box.height).toBeGreaterThanOrEqual(viewport.height - 1)
        const mainBox = await page.locator('.st-editorial__main').boundingBox()
        expect(mainBox.x).toBe(84)
    }

    // all 6 items + theme toggle fit inside the rail without overflow
    for (const item of await page.locator('.st-editorial__rail-item').all()) {
        const itemBox = await item.boundingBox()
        expect(itemBox.x).toBeGreaterThanOrEqual(box.x - 1)
        expect(itemBox.x + itemBox.width).toBeLessThanOrEqual(box.x + box.width + 1)
        expect(itemBox.y).toBeGreaterThanOrEqual(box.y - 1)
        expect(itemBox.y + itemBox.height).toBeLessThanOrEqual(box.y + box.height + 1)
    }
    const toggleBox = await page.locator('.st-editorial__rail-theme').boundingBox()
    expect(toggleBox.x + toggleBox.width).toBeLessThanOrEqual(box.x + box.width + 1)
    expect(toggleBox.y + toggleBox.height).toBeLessThanOrEqual(box.y + box.height + 1)
})

test('rail navigation scrolls to the section and marks it active', async ({ page }) => {
    await page.locator('.st-editorial__rail-item', { hasText: 'Work' }).click()
    await page.waitForFunction(() => {
        const el = document.getElementById('sec-project')
        return Math.abs(window.scrollY - el.offsetTop) < 5
    })
    await expect(page.locator('.st-editorial__rail-item.is-active')).toHaveText(/Work/)
})

test('theme toggle switches and persists the theme', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.locator('.st-editorial__rail-theme').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('hero content is visible and actions are tappable', async ({ page }) => {
    await expect(page.locator('.st-editorial__hero h1')).toBeVisible()
    for (const btn of await page.locator('.st-editorial__hero-actions > *').all()) {
        const box = await btn.boundingBox()
        expect(box.height).toBeGreaterThanOrEqual(40)
        expect(box.x).toBeGreaterThanOrEqual(0)
    }
})

test('project tabs filter the list', async ({ page }) => {
    await page.evaluate(() => {
        window.scrollTo({ top: document.getElementById('sec-project').offsetTop, behavior: 'auto' })
    })
    await page.locator('.st-editorial__tab', { hasText: 'Web Design' }).click()
    await expect(page.locator('.st-editorial__project-card')).toHaveCount(1)
    await page.locator('.st-editorial__tab', { hasText: 'All' }).click()
    await expect(page.locator('.st-editorial__project-card')).toHaveCount(4)
})

test('blog post expands and collapses', async ({ page }) => {
    await page.evaluate(() => {
        window.scrollTo({ top: document.getElementById('sec-blog').offsetTop, behavior: 'auto' })
    })
    const firstRow = page.locator('.st-editorial__blog-row').first()
    await firstRow.click()
    await expect(page.locator('.st-editorial__blog-content')).toHaveCount(1)
    await firstRow.click()
    await expect(page.locator('.st-editorial__blog-content')).toHaveCount(0)
})

test('contact form fields fit and accept input', async ({ page }) => {
    await page.evaluate(() => {
        window.scrollTo({ top: document.getElementById('sec-contact').offsetTop, behavior: 'auto' })
    })
    const form = page.locator('.st-editorial__contact-form')
    await expect(form).toBeVisible()
    const formBox = await form.boundingBox()
    const vw = await page.evaluate(() => document.documentElement.clientWidth)
    expect(formBox.x).toBeGreaterThanOrEqual(0)
    expect(formBox.x + formBox.width).toBeLessThanOrEqual(vw + 1)
    await form.locator('input[name="name"]').fill('Test User')
    await expect(form.locator('input[name="name"]')).toHaveValue('Test User')
})

test('deep-link routes land on their section', async ({ page }) => {
    await page.goto('/about')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => {
        const el = document.getElementById('sec-about')
        return el && Math.abs(window.scrollY - el.offsetTop) < 5
    })
    await expect(page).toHaveTitle(/About/)
})
