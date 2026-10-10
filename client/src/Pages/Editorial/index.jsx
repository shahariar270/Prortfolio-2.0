import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import SeoHead from '@Component/SeoHead'
import { trackPageView } from '../../config/tracking'
import { useTheme } from '../../config/theme'
import { sections, sectionSeo } from './helper'
import { RailNav } from './RailNav'
import { Hero } from './Sections/Hero'
import { About } from './Sections/About'
import { Skills } from './Sections/Skills'
import { Projects } from './Sections/Projects'
import { Blog } from './Sections/Blog'
import { Contact } from './Sections/Contact'
import { fetchContent } from '../../store/slices/contentSlice'
import { QuickInfoModal } from '../../Component/QuickInfoModal'

const scrollToSection = (id, behavior = 'smooth') => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop, behavior })
}

export const Editorial = ({ section = 'sec-home' }) => {
    const dispatch = useDispatch()
    const location = useLocation()
    const hashId = location.hash.slice(1)
    const initialSection = sections.some((s) => s.id === hashId) ? hashId : section

    const [activeSection, setActiveSection] = useState(initialSection)
    const [isDark, toggleTheme] = useTheme()
    const [isQuickModalOpen, setIsQuickModalOpen] = useState(false)
    const lastSyncedSection = useRef(initialSection)

    useEffect(() => {
        dispatch(fetchContent())
    }, [dispatch])

    useEffect(() => {
        if (initialSection === 'sec-home') {
            window.scrollTo({ top: 0, behavior: 'auto' })
            return
        }

        scrollToSection(initialSection, 'auto')

        const observer = new ResizeObserver(() => scrollToSection(initialSection, 'auto'))
        observer.observe(document.body)
        const settleTimer = setTimeout(() => observer.disconnect(), 2000)

        return () => {
            observer.disconnect()
            clearTimeout(settleTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    useEffect(() => {
        const path = location.pathname
        const referrer = document.referrer
        const startedAt = Date.now()
        let sent = false

        const flush = () => {
            if (sent) return
            sent = true
            trackPageView({ path, referrer, durationMs: Date.now() - startedAt })
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') flush()
        }

        document.addEventListener('visibilitychange', onVisibilityChange)
        window.addEventListener('pagehide', flush)

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
            window.removeEventListener('pagehide', flush)
            flush()
        }
    }, [location.pathname])

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY + window.innerHeight * 0.35
            let active = 'sec-home'
            for (const s of sections) {
                const el = document.getElementById(s.id)
                if (el && el.offsetTop <= y) active = s.id
            }
            setActiveSection(active)

            if (active !== lastSyncedSection.current) {
                lastSyncedSection.current = active
                const url = active === 'sec-home' ? '/' : `/#${active}`
                window.history.replaceState(null, '', url)
            }
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const seo = sectionSeo[section] ?? sectionSeo['sec-home']

    return (
        <div className="st-editorial">
            <SeoHead title={seo.title} description={seo.description} />
            <RailNav
                activeSection={activeSection}
                isDark={isDark}
                onToggleTheme={toggleTheme}
                onOpenQuickModal={() => setIsQuickModalOpen(true)}
            />
            <main className="st-editorial__main">
                <Hero
                    onSeeWork={() => scrollToSection('sec-project')}
                    onOpenQuickModal={() => setIsQuickModalOpen(true)}
                />
                <About />
                <Skills />
                <Projects />
                <Blog />
                <Contact />
            </main>

            {/* Floating Quick Action Button */}
            <button
                type="button"
                className="st-quick-fab"
                onClick={() => setIsQuickModalOpen(true)}
                aria-label="Quick Contact & Info"
                title="Quick Contact & Info"
            >
                <span className="st-fab-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                </span>
                <span>Quick Contact</span>
            </button>

            {/* Quick Contact & Info Popup Modal */}
            <QuickInfoModal
                isOpen={isQuickModalOpen}
                onClose={() => setIsQuickModalOpen(false)}
            />
        </div>
    )
}
