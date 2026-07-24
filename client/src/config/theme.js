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
