import fs from 'node:fs'
import { test, expect } from '@playwright/test'
import { TOKEN_FILE } from './global-setup'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dev.shahariar.official@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

test.describe.configure({ mode: 'serial' })

test.describe('1. Public Site Interactive Elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.waitForLoadState('networkidle')
    })

    test('Theme toggle switches and persists theme', async ({ page }) => {
        const html = page.locator('html')
        const initialTheme = await html.getAttribute('data-theme')
        const toggleBtn = page.locator('.st-editorial__rail-theme')
        await expect(toggleBtn).toBeVisible()

        await toggleBtn.click()
        const switchedTheme = await html.getAttribute('data-theme')
        expect(switchedTheme).not.toBe(initialTheme)

        await toggleBtn.click()
        expect(await html.getAttribute('data-theme')).toBe(initialTheme)
    })

    test('Hero section buttons and content work', async ({ page }) => {
        await expect(page.locator('.st-editorial__hero')).toBeVisible()
        await expect(page.locator('.st-editorial__hero h1')).toBeVisible()

        const seeWorkBtn = page.locator('.st-editorial__hero-actions button', { hasText: 'See the work' })
        await expect(seeWorkBtn).toBeVisible()
        await seeWorkBtn.click()
        await page.waitForTimeout(600)

        const resumeBtn = page.locator('.st-editorial__hero-actions a', { hasText: 'Resume' })
        await expect(resumeBtn).toBeVisible()
        const href = await resumeBtn.getAttribute('href')
        expect(href).toBeTruthy()
    })

    test('Rail navigation links scroll to all sections', async ({ page }) => {
        const sections = [
            { id: 'sec-about', label: 'About' },
            { id: 'sec-skill', label: 'Skills' },
            { id: 'sec-project', label: 'Projects' },
            { id: 'sec-blog', label: 'Blog' },
            { id: 'sec-contact', label: 'Contact' },
            { id: 'sec-home', label: 'Home' },
        ]

        for (const s of sections) {
            const navItem = page.locator(`.st-editorial__rail-item[href*="#${s.id}"]`)
            await expect(navItem).toBeVisible()
            await navItem.click()
            await page.waitForTimeout(300)
            const targetEl = page.locator(`#${s.id}`)
            await expect(targetEl).toBeVisible()
        }
    })

    test('Projects category tabs filter items', async ({ page }) => {
        const projectSection = page.locator('#sec-project')
        await projectSection.scrollIntoViewIfNeeded()

        const tabs = page.locator('.st-editorial__projects-tabs button')
        const tabCount = await tabs.count()
        expect(tabCount).toBeGreaterThanOrEqual(2)

        for (let i = 0; i < tabCount; i++) {
            const tab = tabs.nth(i)
            await tab.click()
            await page.waitForTimeout(200)
            await expect(tab).toHaveClass(/is-active/)
        }
    })

    test('Project detail page navigation works', async ({ page }) => {
        const projectSection = page.locator('#sec-project')
        await projectSection.scrollIntoViewIfNeeded()

        const seeMoreLinks = page.locator('.st-editorial__project-card a.st-editorial__see-more')
        const count = await seeMoreLinks.count()
        if (count > 0) {
            await seeMoreLinks.first().click()
            await page.waitForURL(/\/project\//)
            await expect(page.locator('.st-editorial-read__title')).toBeVisible()

            const backBtn = page.locator('.st-editorial-read__back')
            await expect(backBtn).toBeVisible()
            await backBtn.click()
            await page.waitForURL(/\/project\/?$|\/$/)
        }
    })

    test('Blog detail page navigation works', async ({ page }) => {
        const blogSection = page.locator('#sec-blog')
        await blogSection.scrollIntoViewIfNeeded()

        const blogLinks = page.locator('.st-editorial__blog-row')
        const count = await blogLinks.count()
        if (count > 0) {
            await blogLinks.first().click()
            await page.waitForURL(/\/blog\//)
            await expect(page.locator('.st-editorial-read__title')).toBeVisible()

            const backBtn = page.locator('.st-editorial-read__back')
            await expect(backBtn).toBeVisible()
            await backBtn.click()
            await page.waitForURL(/\/blog\/?$|\/$/)
        }
    })

    test('Contact form accepts input and handles submission', async ({ page }) => {
        const contactSection = page.locator('#sec-contact')
        await contactSection.scrollIntoViewIfNeeded()

        const form = page.locator('.st-editorial__contact-form')
        await expect(form).toBeVisible()

        await form.locator('input[name="name"]').fill('Local Tester')
        await form.locator('input[name="email"]').fill('tester@example.local')
        await form.locator('textarea[name="content"]').fill('This is a local Playwright automated test message.')

        page.once('dialog', async (dialog) => {
            await dialog.accept()
        })

        await form.locator('button[type="submit"]').click()
        await page.waitForTimeout(1000)
    })
})

test.describe('2. Admin Dashboard & Local Data Modifications', () => {
    test('Login screen validation rejects bad credentials and logs in', async ({ page }) => {
        await page.goto('/st-admin')
        await expect(page.locator('.st-admin__login-card')).toBeVisible()

        await page.fill('.st-admin__login-card input[type="email"]', ADMIN_EMAIL)
        await page.fill('.st-admin__login-card input[type="password"]', 'badpass')
        await page.click('.st-admin__login-card button[type="submit"]')
        await expect(page.locator('.st-admin__login-error')).toBeVisible()

        await page.fill('.st-admin__login-card input[type="password"]', ADMIN_PASSWORD)
        await page.click('.st-admin__login-card button[type="submit"]')
        await expect(page.locator('.st-admin__main')).toBeVisible()
    })

    test.describe('Authenticated Admin Sessions', () => {
        test.beforeEach(async ({ page }) => {
            let token = ''
            try {
                const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'))
                token = data.token
            } catch {}

            if (token) {
                await page.addInitScript((t) => {
                    window.localStorage.setItem('st-admin-token', t)
                }, token)
            }
        })

        test('Site Analytics tab and range switching', async ({ page }) => {
            await page.goto('/st-admin/analytics')
            await expect(page.locator('.st-admin__kpis')).toBeVisible()

            const rangeBtns = page.locator('.st-admin__range-switch button')
            const rangeCount = await rangeBtns.count()
            expect(rangeCount).toBeGreaterThanOrEqual(2)

            for (let i = 0; i < rangeCount; i++) {
                await rangeBtns.nth(i).click()
                await page.waitForTimeout(300)
                await expect(rangeBtns.nth(i)).toHaveClass(/is-active/)
            }
        })

        test('Posts CRUD in Admin', async ({ page }) => {
            await page.goto('/st-admin/posts')
            await page.waitForSelector('.st-admin__btn-primary')
            const testPostTitle = `Audit Note ${Date.now()}`

            await page.locator('.st-admin__btn-primary', { hasText: 'New post' }).click()
            await page.waitForURL(/action=new/)
            await expect(page.locator('.st-admin__editor-page')).toBeVisible()

            await page.fill('input[placeholder="Post title"]', testPostTitle)
            await page.fill('textarea[placeholder="Short summary shown on the blog card…"]', 'Automated local test excerpt.')
            
            await page.fill('input[placeholder="Custom meta title (optional)"]', 'SEO Test Title')
            await page.fill('textarea[placeholder="Custom meta description for search engines…"]', 'SEO Test Meta Description')
            await page.fill('input[placeholder="react, mern, hisabox, tutorial…"]', 'test, playwright, automated')

            const quillEditor = page.locator('.ql-editor')
            if (await quillEditor.isVisible()) {
                await quillEditor.fill('This is local test blog post content body.')
            }

            // Click save button
            await page.locator('button[form="post-editor-form"]').click()
            await page.waitForTimeout(1500)

            await expect(page.locator('.st-admin__post', { hasText: testPostTitle })).toBeVisible()

            const postCard = page.locator('.st-admin__post', { hasText: testPostTitle })
            const toggleBtn = postCard.locator('button', { hasText: /Publish|Unpublish/ })
            await toggleBtn.click()
            await page.waitForTimeout(1000)

            const deleteBtn = postCard.locator('button', { hasText: 'Delete' })
            await deleteBtn.click()
            await page.waitForTimeout(1000)

            await expect(page.locator('.st-admin__post', { hasText: testPostTitle })).toHaveCount(0)
        })

        test('Skills CRUD in Admin', async ({ page }) => {
            await page.goto('/st-admin/skills')
            const testSkillName = `Skill_${Date.now()}`

            await page.locator('.st-admin__btn-primary', { hasText: 'Add skill' }).click()
            await expect(page.locator('.st-admin__modal')).toBeVisible()

            await page.fill('.st-admin__modal input[placeholder*="GraphQL"]', testSkillName)
            await page.locator('.st-admin__modal button[type="submit"]').click()
            await page.waitForTimeout(1000)

            const skillRow = page.locator('.st-admin__skill-row', { hasText: testSkillName })
            await expect(skillRow).toBeVisible()

            const plusBtn = skillRow.locator('button', { hasText: '＋' })
            if (await plusBtn.isVisible()) {
                await plusBtn.click()
                await page.waitForTimeout(500)
            }

            const deleteBtn = skillRow.locator('button', { hasText: '✕' })
            await deleteBtn.click()
            await page.waitForTimeout(1000)
            await expect(page.locator('.st-admin__skill-row', { hasText: testSkillName })).toHaveCount(0)
        })

        test('Projects CRUD in Admin', async ({ page }) => {
            await page.goto('/st-admin/projects')
            const testProjectName = `Project_${Date.now()}`

            await page.locator('.st-admin__btn-primary', { hasText: 'New project' }).click()
            await page.waitForURL(/action=new/)
            await expect(page.locator('.st-admin__editor-page')).toBeVisible()

            await page.fill('input[placeholder="Project name"]', testProjectName)
            await page.fill('input[placeholder="e.g. MERN Platform, Component Library…"]', 'Automated Test App')
            await page.fill('input[placeholder="Comma-separated, e.g. React, MongoDB, Redux Toolkit"]', 'React, Playwright, Node')
            
            await page.fill('input[placeholder="Custom meta title (optional)"]', 'SEO Project Title')
            await page.fill('textarea[placeholder="Custom meta description for search engines…"]', 'SEO Project Description')
            await page.fill('input[placeholder="mern, finance, hisabox, fullstack…"]', 'playwright, test')

            await page.locator('button[form="project-editor-form"]').click()
            await page.waitForTimeout(1500)

            const projectCard = page.locator('.st-admin__post', { hasText: testProjectName })
            await expect(projectCard).toBeVisible()

            const deleteBtn = projectCard.locator('button', { hasText: 'Delete' })
            await deleteBtn.click()
            await page.waitForTimeout(1000)
            await expect(page.locator('.st-admin__post', { hasText: testProjectName })).toHaveCount(0)
        })

        test('Taxonomy Management in Admin', async ({ page }) => {
            await page.goto('/st-admin/taxonomy')
            const testCatName = `Cat_${Date.now()}`
            const renamedCatName = `${testCatName}_renamed`

            const firstTaxForm = page.locator('.st-admin__tax-form').first()
            await firstTaxForm.locator('input[name="cat"]').fill(testCatName)
            await firstTaxForm.locator('button[type="submit"]').click()
            await page.waitForTimeout(1000)

            const taxRow = page.locator('.st-admin__tax-row', { hasText: testCatName })
            await expect(taxRow).toBeVisible()

            // Test Edit functionality
            await taxRow.locator('.st-admin__tax-btn-edit').click()
            const editInput = page.locator('.st-admin__tax-edit-form input')
            await expect(editInput).toBeVisible()
            await editInput.fill(renamedCatName)
            await page.locator('.st-admin__tax-btn-save').click()
            await page.waitForTimeout(1000)

            const renamedRow = page.locator('.st-admin__tax-row', { hasText: renamedCatName })
            await expect(renamedRow).toBeVisible()

            // Delete the renamed category
            await page.locator(`.st-admin__tax-row:has-text("${renamedCatName}") .st-admin__tax-btn-delete`).dispatchEvent('click')
            await page.waitForTimeout(1000)
            await expect(page.locator('.st-admin__tax-row', { hasText: renamedCatName })).toHaveCount(0)
        })

        test('Site Content Editor in Admin', async ({ page }) => {
            await page.goto('/st-admin/content')
            await expect(page.locator('.st-admin__content-form')).toBeVisible()

            const headlineInput = page.locator('label:has-text("Headline") input, input[placeholder*="builds web products"]').first()
            await expect(headlineInput).toBeVisible()
            const currentHeadline = await headlineInput.inputValue()
            expect(currentHeadline).toBeTruthy()

            const modifiedStatus = `Available for work · ${Date.now()}`
            const statusInput = page.locator('input[placeholder="Available for work · City, Country"]')
            await statusInput.fill(modifiedStatus)

            await page.locator('.st-admin__btn-primary', { hasText: 'Save changes' }).click()
            await page.waitForTimeout(1500)

            await expect(page.locator('.st-admin__toast')).toBeVisible()
        })

        test('Admin Logout', async ({ page }) => {
            await page.goto('/st-admin')
            const logoutBtn = page.locator('.st-admin__logout')
            await expect(logoutBtn).toBeVisible()
            await logoutBtn.click()

            await expect(page.locator('.st-admin__login-card')).toBeVisible()
        })
    })
})
