import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import RichTextEditor from '@Component/RichTextEditor'
import { createTaxonomy } from '../../../store/slices/taxonomiesSlice'

const DEFAULT_CATEGORIES = ['Web Design', 'Web Development']

const normalizeCategory = (cat) => {
    if (!cat) return 'Web Development'
    if (cat === 'design') return 'Web Design'
    if (cat === 'development') return 'Web Development'
    return cat
}

// The preview stays a FileReader data URL, but the picked File itself is kept
// on the draft (imageFile) so saving can upload it as multipart form data.
// Mounted only once its data is fully resolved (see Views/Projects.jsx) —
// safe to seed state from `project` once, on mount.

export const ProjectEditor = ({ mode, project, categories = [], onSave, onCancel }) => {
    const isNew = mode === 'new'
    const dispatch = useDispatch()
    const [newCatInput, setNewCatInput] = useState('')
    const [showNewCatInput, setShowNewCatInput] = useState(false)

    const initialCategory = normalizeCategory(project?.category || categories[0])

    const [draft, setDraft] = useState({
        label: project?.label || '',
        category: initialCategory,
        type: project?.type || '',
        description: project?.description || '',
        // stored as an array — comma-joined for editing
        technologies: (project?.technologies || []).join(', '),
        liveDemo: project?.liveDemo || '',
        image: project?.image || '',
        imageFile: null,
        seoTitle: project?.seoTitle || '',
        seoDescription: project?.seoDescription || '',
        tags: Array.isArray(project?.tags) ? project.tags.join(', ') : (project?.tags || ''),
    })

    const patch = (changes) => setDraft((prev) => ({ ...prev, ...changes }))

    const availableCategories = Array.from(
        new Set([
            ...(categories.length > 0 ? categories : DEFAULT_CATEGORIES),
            draft.category,
        ].filter(Boolean))
    )

    const handleAddCategory = async () => {
        const val = newCatInput.trim()
        if (!val) return
        patch({ category: val })
        try {
            await dispatch(createTaxonomy({ label: val, kind: 'project_category' })).unwrap()
        } catch {}
        setShowNewCatInput(false)
        setNewCatInput('')
    }

    const pickImage = (e) => {
        const file = e.target.files && e.target.files[0]
        e.target.value = ''
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => patch({ image: reader.result, imageFile: file })
        reader.readAsDataURL(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(draft, isNew ? undefined : project._id)
    }

    return (
        <main className="st-admin__view st-admin__editor-page">
            <div className="st-admin__editor-topbar">
                <button type="button" className="st-admin__editor-back" onClick={onCancel}>
                    ← Back to projects
                </button>
                <button type="submit" form="project-editor-form" className="st-admin__btn-primary">
                    Save project
                </button>
            </div>

            <form id="project-editor-form" className="st-admin__editor-grid" onSubmit={handleSubmit}>
                <div className="st-admin__card st-admin__editor-main">
                    <h1>{isNew ? 'New project' : 'Edit project'}</h1>

                    <label className="st-admin__field">
                        <span>Label</span>
                        <input
                            value={draft.label}
                            onChange={(e) => patch({ label: e.target.value })}
                            placeholder="Project name"
                        />
                    </label>

                    <div className="st-admin__field">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span>Category</span>
                            <Link
                                to="/st-admin/taxonomy"
                                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}
                            >
                                Manage in Taxonomy ↗
                            </Link>
                        </div>
                        <div className="st-admin__chip-options" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={draft.category === cat ? 'is-active' : ''}
                                    onClick={() => patch({ category: cat })}
                                >
                                    {cat}
                                </button>
                            ))}
                            {!showNewCatInput && (
                                <button
                                    type="button"
                                    style={{ borderStyle: 'dashed' }}
                                    onClick={() => setShowNewCatInput(true)}
                                >
                                    ＋ New category
                                </button>
                            )}
                        </div>
                        {showNewCatInput && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <input
                                    value={newCatInput}
                                    onChange={(e) => setNewCatInput(e.target.value)}
                                    placeholder="Enter new category name…"
                                    style={{
                                        flex: 1,
                                        padding: '7px 12px',
                                        fontSize: '0.9rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--surface-muted)',
                                        color: 'var(--text-primary)'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddCategory()
                                        } else if (e.key === 'Escape') {
                                            setShowNewCatInput(false)
                                            setNewCatInput('')
                                        }
                                    }}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="st-admin__btn-primary"
                                    style={{ padding: '0 14px', fontSize: '0.85rem' }}
                                    onClick={handleAddCategory}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="st-admin__btn-ghost"
                                    style={{ padding: '0 12px', fontSize: '0.85rem' }}
                                    onClick={() => {
                                        setShowNewCatInput(false)
                                        setNewCatInput('')
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <label className="st-admin__field">
                        <span>Type</span>
                        <input
                            value={draft.type}
                            onChange={(e) => patch({ type: e.target.value })}
                            placeholder="e.g. MERN Platform, Component Library…"
                        />
                    </label>

                    <div className="st-admin__field">
                        <span>Description</span>
                        <RichTextEditor
                            value={draft.description}
                            onChange={(html) => patch({ description: html })}
                            placeholder="What the project does and how it was built…"
                        />
                    </div>
                </div>

                <div className="st-admin__editor-sidebar">
                    <div className="st-admin__card">
                        <div className="st-admin__field">
                            <span>Preview image</span>
                            {draft.image ? (
                                <div className="st-admin__image-preview">
                                    <img src={draft.image} alt="Preview" />
                                    <div className="st-admin__image-actions">
                                        <label>
                                            Replace
                                            <input type="file" accept="image/*" onChange={pickImage} />
                                        </label>
                                        <button type="button" onClick={() => patch({ image: '', imageFile: null })}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="st-admin__dropzone">
                                    <span className="st-admin__dropzone-icon">↑</span>
                                    <strong>Upload preview image</strong>
                                    <span>PNG or JPG · click to choose a file</span>
                                    <input type="file" accept="image/*" onChange={pickImage} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="st-admin__card">
                        <label className="st-admin__field">
                            <span>Technologies</span>
                            <input
                                value={draft.technologies}
                                onChange={(e) => patch({ technologies: e.target.value })}
                                placeholder="Comma-separated, e.g. React, MongoDB, Redux Toolkit"
                            />
                        </label>
                    </div>

                    <div className="st-admin__card">
                        <label className="st-admin__field">
                            <span>Live demo URL</span>
                            <input
                                value={draft.liveDemo}
                                onChange={(e) => patch({ liveDemo: e.target.value })}
                                placeholder="https://…  (leave blank if there isn't one)"
                            />
                        </label>
                    </div>

                    <div className="st-admin__card">
                        <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>SEO Settings</h3>
                        <label className="st-admin__field">
                            <span>SEO Title</span>
                            <input
                                value={draft.seoTitle}
                                onChange={(e) => patch({ seoTitle: e.target.value })}
                                placeholder="Custom meta title (optional)"
                            />
                        </label>
                        <label className="st-admin__field">
                            <span>Meta Description</span>
                            <textarea
                                value={draft.seoDescription}
                                onChange={(e) => patch({ seoDescription: e.target.value })}
                                placeholder="Custom meta description for search engines…"
                                rows={3}
                            ></textarea>
                        </label>
                        <label className="st-admin__field">
                            <span>SEO Tags / Keywords</span>
                            <input
                                value={draft.tags}
                                onChange={(e) => patch({ tags: e.target.value })}
                                placeholder="mern, finance, hisabox, fullstack…"
                            />
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', display: 'block' }}>
                                Comma-separated tags for Google and search filters
                            </span>
                        </label>
                    </div>
                </div>
            </form>
        </main>
    )
}
