import { useEffect, useState } from 'react'

export const THEME_STORAGE_KEY = 'portfolio-redesign-b-theme'

export const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (saved) return saved === 'dark'
    } catch {
        // localStorage unavailable — fall back to default
    }
    return true
}

export const applyTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

// shared dark/light state — keeps the saved preference applied and in sync
// across every page that renders a theme toggle (RailNav)
export const useTheme = () => {
    const [isDark, setIsDark] = useState(getInitialTheme)

    useEffect(() => {
        applyTheme(isDark)
    }, [isDark])

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

    return [isDark, toggleTheme]
}
