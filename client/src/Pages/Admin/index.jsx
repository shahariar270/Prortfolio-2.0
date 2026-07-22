import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import '../../assets/styles/admin.scss'
import { AdminIcon } from './AdminIcon'
import {
    navItems,
    pageTitles,
    adminProfile,
    initialPosts,
    initialSkills,
    initialPostCats,
    initialSkillCats,
    skillLogoFor,
} from './helper'
import { Analytics } from './Views/Analytics'
import { Posts } from './Views/Posts'
import { Skills } from './Views/Skills'
import { Taxonomy } from './Views/Taxonomy'
import { PostEditorModal } from './PostEditorModal'
import { SkillEditorModal } from './SkillEditorModal'

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

// BACKEND: this whole panel is frontend-only. It has no authentication —
// /st-admin is publicly reachable and must get a login + protected API
// (e.g. JWT session against the Express server) before real data hooks up.

export const Admin = () => {
    const [tab, setTab] = useState('analytics')
    const [isDark, setIsDark] = useState(getInitialTheme)
    const [posts, setPosts] = useState(initialPosts)
    const [skills, setSkills] = useState(initialSkills)
    const [postCats, setPostCats] = useState(initialPostCats)
    const [skillCats, setSkillCats] = useState(initialSkillCats)
    const [editor, setEditor] = useState(null)
    const [skillEditorOpen, setSkillEditorOpen] = useState(false)
    const [toast, setToast] = useState(null)
    const toastTimer = useRef(null)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }, [isDark])

    useEffect(() => () => clearTimeout(toastTimer.current), [])

    const showToast = (msg) => {
        clearTimeout(toastTimer.current)
        setToast(msg)
        toastTimer.current = setTimeout(() => setToast(null), 2600)
    }

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

    const togglePublish = (index) => {
        const wasPublished = posts[index].published
        setPosts((prev) =>
            prev.map((post, i) => (i === index ? { ...post, published: !post.published } : post))
        )
        showToast(wasPublished ? 'Post moved to drafts' : 'Post published')
    }

    const savePost = (draft) => {
        const title = (draft.title || '').trim() || 'Untitled post'
        if (draft.index === null) {
            const now = new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
            setPosts((prev) => [
                {
                    category: draft.category,
                    title,
                    excerpt: draft.excerpt,
                    date: now,
                    views: '0',
                    image: draft.image || '/react.png',
                    published: draft.published,
                },
                ...prev,
            ])
            showToast('Post created')
        } else {
            setPosts((prev) =>
                prev.map((post, i) =>
                    i === draft.index
                        ? {
                              ...post,
                              category: draft.category,
                              title,
                              excerpt: draft.excerpt,
                              published: draft.published,
                              image: draft.image || post.image,
                          }
                        : post
                )
            )
            showToast('Post saved')
        }
        setEditor(null)
    }

    const adjustSkillLevel = (index, delta) => {
        setSkills((prev) =>
            prev.map((skill, i) =>
                i === index
                    ? { ...skill, level: Math.max(0, Math.min(100, skill.level + delta)) }
                    : skill
            )
        )
    }

    const saveSkill = (draft) => {
        const name = (draft.name || '').trim() || 'New skill'
        setSkills((prev) => [
            ...prev,
            { group: draft.group, name, logo: skillLogoFor(name), level: draft.level },
        ])
        setSkillEditorOpen(false)
        showToast('Skill added')
    }

    const addCat = (list, setList, value, kind) => {
        if (list.includes(value)) {
            showToast(`${kind} already exists`)
            return
        }
        setList((prev) => [...prev, value])
        showToast(`${kind} "${value}" added`)
    }

    const removeCat = (setList, value, kind) => {
        setList((prev) => prev.filter((item) => item !== value))
        showToast(`${kind} "${value}" removed`)
    }

    const [title, subtitle] = pageTitles[tab]

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
                        <button
                            key={item.key}
                            type="button"
                            className={tab === item.key ? 'is-active' : ''}
                            onClick={() => setTab(item.key)}
                        >
                            <AdminIcon name={item.icon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
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

                {tab === 'analytics' && <Analytics />}
                {tab === 'posts' && (
                    <Posts
                        posts={posts}
                        onTogglePublish={togglePublish}
                        onEdit={(index) => {
                            const post = posts[index]
                            setEditor({
                                index,
                                category: post.category,
                                title: post.title,
                                excerpt: post.excerpt || '',
                                published: post.published,
                                image: post.image || '',
                            })
                        }}
                        onAdd={() =>
                            setEditor({
                                index: null,
                                category: postCats[0] || 'React',
                                title: '',
                                excerpt: '',
                                published: false,
                                image: '',
                            })
                        }
                    />
                )}
                {tab === 'skills' && (
                    <Skills
                        skills={skills}
                        onAdjustLevel={adjustSkillLevel}
                        onAdd={() => setSkillEditorOpen(true)}
                    />
                )}
                {tab === 'taxonomy' && (
                    <Taxonomy
                        postCats={postCats}
                        skillCats={skillCats}
                        posts={posts}
                        skills={skills}
                        onAddPostCat={(v) => addCat(postCats, setPostCats, v, 'Category')}
                        onRemovePostCat={(v) => removeCat(setPostCats, v, 'Category')}
                        onAddSkillCat={(v) => addCat(skillCats, setSkillCats, v, 'Group')}
                        onRemoveSkillCat={(v) => removeCat(setSkillCats, v, 'Group')}
                    />
                )}
            </div>

            {toast && (
                <div className="st-admin__toast" role="status">
                    <span>✓</span>
                    {toast}
                </div>
            )}

            {editor && (
                <PostEditorModal
                    editor={editor}
                    categories={postCats}
                    onSave={savePost}
                    onClose={() => setEditor(null)}
                />
            )}

            {skillEditorOpen && (
                <SkillEditorModal
                    groups={skillCats}
                    onSave={saveSkill}
                    onClose={() => setSkillEditorOpen(false)}
                />
            )}
        </div>
    )
}
