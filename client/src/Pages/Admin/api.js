import { API_URL } from '../../config/api'

const TOKEN_KEY = 'st-admin-token'

export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export const setToken = (token) => {
    try {
        localStorage.setItem(TOKEN_KEY, token)
    } catch {
        // localStorage unavailable — session won't survive a reload
    }
}

export const clearToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY)
    } catch {
        // ignore
    }
}

/** Thrown on 401/403 — the caller should drop back to the login screen. */
export class AuthError extends Error {}

const request = async (path, { method = 'GET', body, auth = false } = {}) => {
    const headers = {}
    let payload = body
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
        payload = JSON.stringify(body)
    }
    if (auth) headers.Authorization = `Bearer ${getToken()}`

    let res
    try {
        res = await fetch(`${API_URL}${path}`, { method, headers, body: payload })
    } catch {
        throw new Error('Cannot reach the server — is the API running?')
    }

    let json = null
    try {
        json = await res.json()
    } catch {
        // non-JSON response body
    }

    if (res.status === 401 || res.status === 403) {
        if (auth) clearToken()
        throw new AuthError(json?.message || 'Session expired — please log in again')
    }
    if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `Request failed (${res.status})`)
    }
    return json?.data
}

export const api = {
    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: { email, password } }),
    profile: () => request('/auth/profile', { auth: true }),

    posts: () => request('/api/posts'),
    postBySlug: (slug) => request(`/api/posts/${slug}`),
    addPostView: (slug) => request(`/api/posts/${slug}/view`, { method: 'POST' }),
    allPosts: () => request('/api/posts/all', { auth: true }),
    createPost: (body) => request('/api/post', { method: 'POST', body, auth: true }),
    updatePost: (id, body) => request(`/api/post/${id}`, { method: 'PUT', body, auth: true }),
    togglePublish: (id) => request(`/api/post/${id}/publish`, { method: 'PATCH', auth: true }),

    skills: () => request('/api/skills'),
    createSkill: (body) => request('/api/skill', { method: 'POST', body, auth: true }),
    adjustSkillLevel: (id, delta) =>
        request(`/api/skill/${id}/level`, { method: 'PATCH', body: { delta }, auth: true }),

    projects: () => request('/api/projects'),
    projectBySlug: (slug) => request(`/api/projects/${slug}`),
    createProject: (body) => request('/api/project', { method: 'POST', body, auth: true }),
    updateProject: (id, body) => request(`/api/project/${id}`, { method: 'PUT', body, auth: true }),
    deleteProject: (id) => request(`/api/project/${id}`, { method: 'DELETE', auth: true }),

    taxonomies: () => request('/api/taxonomies'),
    createTaxonomy: (label, kind) =>
        request('/api/taxonomy', { method: 'POST', body: { label, kind }, auth: true }),
    deleteTaxonomy: (id) => request(`/api/taxonomy/${id}`, { method: 'DELETE', auth: true }),

    analyticsSummary: (range) =>
        request(`/api/analytics/summary?range=${encodeURIComponent(range)}`, { auth: true }),
}
