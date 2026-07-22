import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import '../../assets/styles/admin.scss'
import { api, getToken, clearToken, AuthError } from './api'
import { Login } from './Login'
import { AdminIcon } from './AdminIcon'
import {
    navItems,
    pageTitles,
    adminProfile,
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
    const [token, setTokenState] = useState(getToken)
    const [tab, setTab] = useState('analytics')
    const [isDark, setIsDark] = useState(getInitialTheme)
    const [posts, setPosts] = useState([])
    const [skills, setSkills] = useState([])
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

    const logout = () => {
        clearToken()
        setTokenState(null)
    }

    // shared handler: expired/invalid sessions drop back to the login screen
    const handleApiError = (err) => {
        if (err instanceof AuthError) {
            clearToken()
            setTokenState(null)
        }
        showToast(err.message)
    }

    // reject a stale token early instead of failing on the first action,
    // then load the panel's data
    useEffect(() => {
        if (!token) return
        api.profile().catch(() => logout())
        api.allPosts().then(setPosts).catch(handleApiError)
        api.skills().then(setSkills).catch(handleApiError)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const togglePublish = async (index) => {
        try {
            const updated = await api.togglePublish(posts[index]._id)
            setPosts((prev) => prev.map((post, i) => (i === index ? updated : post)))
            showToast(updated.published ? 'Post published' : 'Post moved to drafts')
        } catch (err) {
            handleApiError(err)
        }
    }

    const savePost = async (draft) => {
        const title = (draft.title || '').trim() || 'Untitled post'
        try {
            let body
            if (draft.imageFile) {
                body = new FormData()
                body.append('title', title)
                body.append('category', draft.category)
                body.append('excerpt', draft.excerpt)
                body.append('published', String(draft.published))
                body.append('image', draft.imageFile)
            } else {
                body = {
                    title,
                    category: draft.category,
                    excerpt: draft.excerpt,
                    published: draft.published,
                }
                // send the image only when it's a real URL or an explicit
                // clear — never a stale FileReader data: preview
                if (!draft.image || !draft.image.startsWith('data:')) {
                    body.image = draft.image
                }
            }

            const saved = draft.index === null
                ? await api.createPost(body)
                : await api.updatePost(posts[draft.index]._id, body)

            setPosts((prev) =>
                draft.index === null
                    ? [saved, ...prev]
                    : prev.map((post, i) => (i === draft.index ? saved : post))
            )
            showToast(draft.index === null ? 'Post created' : 'Post saved')
            setEditor(null)
        } catch (err) {
            handleApiError(err)
        }
    }

    const adjustSkillLevel = async (index, delta) => {
        try {
            const updated = await api.adjustSkillLevel(skills[index]._id, delta)
            setSkills((prev) => prev.map((skill, i) => (i === index ? updated : skill)))
        } catch (err) {
            handleApiError(err)
        }
    }

    const saveSkill = async (draft) => {
        const name = (draft.name || '').trim() || 'New skill'
        try {
            const created = await api.createSkill({
                name,
                group: draft.group,
                logo: skillLogoFor(name),
                level: draft.level,
            })
            setSkills((prev) => [...prev, created])
            setSkillEditorOpen(false)
            showToast('Skill added')
        } catch (err) {
            handleApiError(err)
        }
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

    if (!token) {
        return (
            <div className="st-admin">
                <SeoHead title="Admin" description="Portfolio admin panel" noIndex />
                <Login onLogin={() => setTokenState(getToken())} />
            </div>
        )
    }

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
