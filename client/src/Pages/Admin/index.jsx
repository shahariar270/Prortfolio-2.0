import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import '../../assets/styles/admin.scss'
import { api, getToken, clearToken } from './api'
import { Login } from './Login'
import { AdminIcon } from './AdminIcon'
import { navItems, pageTitles, adminProfile } from './helper'
import { Analytics } from './Views/Analytics'
import { Posts } from './Views/Posts'
import { Skills } from './Views/Skills'
import { Projects } from './Views/Projects'
import { Taxonomy } from './Views/Taxonomy'

const THEME_STORAGE_KEY = 'portfolio-redesign-b-theme'

const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (saved) return saved === 'dark'
    } catch {
        // localStorage unavailable — fall back to default
    }
    return true
}

// Each tab is its own route (see route/index.jsx) and its own component
// (Views/*) that fetches exactly the data it needs on mount — the shell only
// owns cross-cutting concerns: auth/session, theme, and toast notifications.
export const Admin = () => {
    const [token, setTokenState] = useState(getToken)
    const [isDark, setIsDark] = useState(getInitialTheme)
    const [toast, setToast] = useState(null)
    const toastTimer = useRef(null)
    const location = useLocation()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }, [isDark])

    useEffect(() => () => clearTimeout(toastTimer.current), [])

    const showToast = (msg) => {
        clearTimeout(toastTimer.current)
        setToast(msg)
        toastTimer.current = setTimeout(() => setToast(null), 2600)
    }

    const logout = () => {
        clearToken()
        setTokenState(null)
    }

    // shared handler: Views dispatch Redux thunks whose rejection payload is
    // { message, isAuthError } (see toErrorPayload in the slices) — expired/
    // invalid sessions drop back to the login screen
    const handleApiError = (err) => {
        if (err?.isAuthError) {
            clearToken()
            setTokenState(null)
        }
        showToast(err?.message ?? String(err))
    }

    // reject a stale token early so an expired session bounces to login
    // instead of failing silently on whichever page loads its own data
    useEffect(() => {
        if (!token) return
        api.profile().catch(() => logout())
    }, [token])

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev
            try {
                localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
            } catch {
                // localStorage unavailable — theme just won't persist
            }
            return next
        })
    }

    if (!token) {
        return (
            <div className="st-admin">
                <SeoHead title="Admin" description="Portfolio admin panel" noIndex />
                <Login onLogin={() => setTokenState(getToken())} />
            </div>
        )
    }

    const activeKey = navItems.find((item) => location.pathname.endsWith(`/${item.key}`))?.key ?? 'analytics'
    const [title, subtitle] = pageTitles[activeKey]

    return (
        <div className="st-admin">
            <SeoHead title="Admin" description="Portfolio admin panel" noIndex />

            <aside className="st-admin__sidebar">
                <div className="st-admin__profile">
                    <img src={adminProfile.avatar} alt={adminProfile.name} />
                    <div>
                        <strong>{adminProfile.name}</strong>
                        <span>{adminProfile.role}</span>
                    </div>
                </div>
                <nav className="st-admin__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.key}
                            to={`/st-admin/${item.key}`}
                            className={({ isActive }) => (isActive ? 'is-active' : '')}
                        >
                            <AdminIcon name={item.icon} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <button type="button" className="st-admin__logout" onClick={logout}>
                    ⎋ <span>Log out</span>
                </button>
                <Link className="st-admin__back-link" to="/">
                    ← <span>View live site</span>
                </Link>
            </aside>

            <div className="st-admin__main">
                <header className="st-admin__topbar">
                    <div>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDark}
                        aria-label="Toggle dark mode"
                        className="st-admin__theme-toggle"
                        onClick={toggleTheme}
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                </header>

                <Outlet context={{ onError: handleApiError, onNotify: showToast }} />
            </div>

            {toast && (
                <div className="st-admin__toast" role="status">
                    <span>✓</span>
                    {toast}
                </div>
            )}
        </div>
    )
}

export const AdminAnalytics = () => {
    const { onError } = useOutletContext()
    return <Analytics onError={onError} />
}

export const AdminPosts = () => {
    const { onError, onNotify } = useOutletContext()
    return <Posts onError={onError} onNotify={onNotify} />
}

export const AdminSkills = () => {
    const { onError, onNotify } = useOutletContext()
    return <Skills onError={onError} onNotify={onNotify} />
}

export const AdminProjects = () => {
    const { onError, onNotify } = useOutletContext()
    return <Projects onError={onError} onNotify={onNotify} />
}

export const AdminTaxonomy = () => {
    const { onError, onNotify } = useOutletContext()
    return <Taxonomy onError={onError} onNotify={onNotify} />
}
