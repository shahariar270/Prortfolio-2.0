import { API_URL } from './api'

const VISITOR_KEY = 'st-visitor-id'

const makeId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
    return `v-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Stable, anonymous per-browser id — not tied to any personal identity. */
export const getVisitorId = () => {
    try {
        let id = localStorage.getItem(VISITOR_KEY)
        if (!id) {
            id = makeId()
            localStorage.setItem(VISITOR_KEY, id)
        }
        return id
    } catch {
        return makeId()
    }
}

/**
 * Fires a page-view beacon to /api/track. Uses fetch + keepalive (not
 * navigator.sendBeacon) so the JSON content-type and existing CORS setup
 * behave identically to every other API call this app makes, including
 * during page unload.
 */
export const trackPageView = ({ path, referrer, durationMs }) => {
    try {
        fetch(`${API_URL}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                path,
                visitor_id: getVisitorId(),
                referrer: referrer || '',
                duration_ms: Math.max(0, Math.round(durationMs)),
            }),
            keepalive: true,
        }).catch(() => {
            // analytics must never break the page
        })
    } catch {
        // ignore — e.g. fetch unavailable in some odd embedded context
    }
}
