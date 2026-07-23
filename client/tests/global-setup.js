import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const TOKEN_FILE = path.join(__dirname, '.admin-token.json')

// The auth route is rate-limited (20 req/15min). Logging in once here and
// caching the token — instead of every test/project calling /auth/login in
// its own beforeEach — keeps the whole suite (6 projects x several tests)
// safely under that limit.
export default async function globalSetup() {
    const email = process.env.ADMIN_EMAIL || 'dev.shahariar.official@gmail.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'

    const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!json.success) {
        throw new Error(`global-setup admin login failed: ${json.message}`)
    }
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token: json.data.token }))
}
