import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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

const scrollToSection = (id, behavior = 'smooth') => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop, behavior })
}

export const Editorial = ({ section = 'sec-home' }) => {
    const location = useLocation()
    const hashId = location.hash.slice(1)
    // a URL hash (deep link, refresh, shared link) should win over the
    // route's default section so both the scroll target and the highlighted
    // rail item are correct on the very first render, not just after a click
    const initialSection = sections.some((s) => s.id === hashId) ? hashId : section

    const [activeSection, setActiveSection] = useState(initialSection)
    const [isDark, toggleTheme] = useTheme()

    useEffect(() => {
        if (initialSection === 'sec-home') {
            window.scrollTo({ top: 0, behavior: 'auto' })
            return
        }

        scrollToSection(initialSection, 'auto')

        // Skills/Projects/Blog fetch their data on mount and can grow the
        // page after this jump, leaving the scroll position stale — keep
        // correcting while the page is still settling from those fetches
        const observer = new ResizeObserver(() => scrollToSection(initialSection, 'auto'))
        observer.observe(document.body)
        const settleTimer = setTimeout(() => observer.disconnect(), 2000)

        return () => {
            observer.disconnect()
            clearTimeout(settleTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    // page-view beacon: fires once per mounted path, flushed with a duration
    // on tab-hide or page unload (whichever comes first)
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
            />
            <main className="st-editorial__main">
                <Hero onSeeWork={() => scrollToSection('sec-project')} />
                <About />
                <Skills />
                <Projects />
                <Blog />
                <Contact />
            </main>
        </div>
    )
}
