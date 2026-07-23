import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import '../../assets/styles/admin.scss'
import { api, getToken, clearToken, AuthError } from './api'
import { Login } from './Login'
import { AdminIcon } from './AdminIcon'
import { navItems, pageTitles, adminProfile, skillLogoFor } from './helper'
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

export const Admin = () => {
    const [token, setTokenState] = useState(getToken)
    const [isDark, setIsDark] = useState(getInitialTheme)
    const [posts, setPosts] = useState([])
    const [skills, setSkills] = useState([])
    const [taxonomies, setTaxonomies] = useState([])
    const [editor, setEditor] = useState(null)
    const [skillEditorOpen, setSkillEditorOpen] = useState(false)
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
        api.taxonomies().then(setTaxonomies).catch(handleApiError)
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

    const openNewPostEditor = () => {
        setEditor({
            index: null,
            category: postCats[0] || 'React',
            title: '',
            excerpt: '',
            published: false,
            image: '',
        })
    }

    const openEditPostEditor = (index) => {
        const post = posts[index]
        setEditor({
            index,
            category: post.category,
            title: post.title,
            excerpt: post.excerpt || '',
            published: post.published,
            image: post.image || '',
        })
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

    const postCats = taxonomies
        .filter((tax) => tax.kind === 'post_category')
        .map((tax) => tax.label)
    const skillCats = taxonomies
        .filter((tax) => tax.kind === 'skill_group')
        .map((tax) => tax.label)

    const addTaxonomy = async (label, kind, kindName) => {
        if (taxonomies.some((tax) => tax.kind === kind && tax.label === label)) {
            showToast(`${kindName} already exists`)
            return
        }
        try {
            const created = await api.createTaxonomy(label, kind)
            setTaxonomies((prev) => [...prev, created])
            showToast(`${kindName} "${label}" added`)
        } catch (err) {
            handleApiError(err)
        }
    }

    const removeTaxonomy = async (tax, kindName) => {
        try {
            await api.deleteTaxonomy(tax._id)
            setTaxonomies((prev) => prev.filter((item) => item._id !== tax._id))
            showToast(`${kindName} "${tax.label}" removed`)
        } catch (err) {
            // an in-use label comes back as 409 with a descriptive message
            handleApiError(err)
        }
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

    const outletContext = {
        handleApiError,
        posts,
        skills,
        taxonomies,
        postCats,
        skillCats,
        togglePublish,
        openNewPostEditor,
        openEditPostEditor,
        adjustSkillLevel,
        openSkillEditor: () => setSkillEditorOpen(true),
        addTaxonomy,
        removeTaxonomy,
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

                <Outlet context={outletContext} />
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

export const AdminAnalytics = () => {
    const { handleApiError } = useOutletContext()
    return <Analytics onError={handleApiError} />
}

export const AdminPosts = () => {
    const { posts, togglePublish, openEditPostEditor, openNewPostEditor } = useOutletContext()
    return (
        <Posts
            posts={posts}
            onTogglePublish={togglePublish}
            onEdit={openEditPostEditor}
            onAdd={openNewPostEditor}
        />
    )
}

export const AdminSkills = () => {
    const { skills, adjustSkillLevel, openSkillEditor } = useOutletContext()
    return <Skills skills={skills} onAdjustLevel={adjustSkillLevel} onAdd={openSkillEditor} />
}

export const AdminTaxonomy = () => {
    const { taxonomies, posts, skills, addTaxonomy, removeTaxonomy } = useOutletContext()
    return (
        <Taxonomy
            taxonomies={taxonomies}
            posts={posts}
            skills={skills}
            onAddPostCat={(v) => addTaxonomy(v, 'post_category', 'Category')}
            onRemovePostCat={(tax) => removeTaxonomy(tax, 'Category')}
            onAddSkillCat={(v) => addTaxonomy(v, 'skill_group', 'Group')}
            onRemoveSkillCat={(tax) => removeTaxonomy(tax, 'Group')}
        />
    )
}
