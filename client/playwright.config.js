import { defineConfig } from '@playwright/test'

const viewports = [
    { name: 'mobile-320', width: 320, height: 568 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-landscape', width: 640, height: 360 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'laptop-1024', width: 1024, height: 768 },
    { name: 'desktop-1440', width: 1440, height: 900 },
]

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    retries: 0,
    reporter: [['list']],
    use: {
        baseURL: 'http://localhost:5173',
    },
    projects: viewports.map(({ name, width, height }) => ({
        name,
        use: {
            browserName: 'chromium',
            viewport: { width, height },
        },
    })),
    webServer: [
        {
            command: 'npm run dev',
            url: 'http://localhost:5173',
            reuseExistingServer: true,
            timeout: 60_000,
        },
        {
            // admin specs talk to the real API (needs local MongoDB running)
            command: 'node app.js',
            cwd: '../server',
            url: 'http://localhost:3000',
            reuseExistingServer: true,
            timeout: 60_000,
        },
    ],
})
