import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import { createBlogSlug, featuredPosts } from '@Pages/Blog/helper'
import { sections, sectionSeo } from './helper'
import { RailNav } from './RailNav'
import { Hero } from './Sections/Hero'
import { About } from './Sections/About'
import { Skills } from './Sections/Skills'
import { Projects } from './Sections/Projects'
import { Blog } from './Sections/Blog'
import { Contact } from './Sections/Contact'

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

const scrollToSection = (id, behavior = 'smooth') => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.offsetTop, behavior })
}

export const Editorial = ({ section = 'sec-home' }) => {
    const [activeSection, setActiveSection] = useState(section)
    const [isDark, setIsDark] = useState(getInitialTheme)
    const { title } = useParams()

    const expandedPostIndex = title
        ? featuredPosts.findIndex((post) => createBlogSlug(post.title) === title)
        : -1

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }, [isDark])

    useEffect(() => {
        if (section === 'sec-home') {
            window.scrollTo({ top: 0, behavior: 'auto' })
        } else {
            scrollToSection(section, 'auto')
        }
    }, [section])

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

    const seo = sectionSeo[section] ?? sectionSeo['sec-home']

    return (
        <div className="st-editorial">
            <SeoHead title={seo.title} description={seo.description} />
            <RailNav
                activeSection={activeSection}
                onNavigate={(id) => scrollToSection(id)}
                isDark={isDark}
                onToggleTheme={toggleTheme}
            />
            <main className="st-editorial__main">
                <Hero onSeeWork={() => scrollToSection('sec-project')} />
                <About />
                <Skills />
                <Projects />
                <Blog initialExpanded={expandedPostIndex >= 0 ? expandedPostIndex : null} />
                <Contact />
            </main>
        </div>
    )
}
