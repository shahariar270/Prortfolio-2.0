import React, { useState } from 'react'
import RichTextEditor from '@Component/RichTextEditor'

// The preview stays a FileReader data URL, but the picked File itself is kept
// on the draft (imageFile) so saving can upload it as multipart form data.
// Mounted only once its data is fully resolved (see Views/Posts.jsx) — safe
// to seed state from `post` once, on mount.

export const PostEditor = ({ mode, post, categories, onSave, onCancel }) => {
    const isNew = mode === 'new'
    const [draft, setDraft] = useState({
        title: post?.title || '',
        category: post?.category || categories[0] || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        published: post?.published || false,
        image: post?.image || '',
        imageFile: null,
    })

    const patch = (changes) => setDraft((prev) => ({ ...prev, ...changes }))

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
        onSave(draft, isNew ? undefined : post._id)
    }

    return (
        <main className="st-admin__view st-admin__editor-page">
            <div className="st-admin__editor-topbar">
                <button type="button" className="st-admin__editor-back" onClick={onCancel}>
                    ← Back to posts
                </button>
                <button type="submit" form="post-editor-form" className="st-admin__btn-primary">
                    {draft.published ? 'Publish post' : 'Save draft'}
                </button>
            </div>

            <form id="post-editor-form" className="st-admin__editor-grid" onSubmit={handleSubmit}>
                <div className="st-admin__card st-admin__editor-main">
                    <h1>{isNew ? 'New post' : 'Edit post'}</h1>

                    <label className="st-admin__field">
                        <span>Title</span>
                        <input
                            value={draft.title}
                            onChange={(e) => patch({ title: e.target.value })}
                            placeholder="Post title"
                        />
                    </label>

                    <div className="st-admin__field">
                        <span>Category</span>
                        <div className="st-admin__chip-options">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={draft.category === cat ? 'is-active' : ''}
                                    onClick={() => patch({ category: cat })}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="st-admin__field">
                        <span>Content</span>
                        <RichTextEditor
                            value={draft.content}
                            onChange={(html) => patch({ content: html })}
                            placeholder="Write the article body…"
                        />
                    </div>
                </div>

                <div className="st-admin__editor-sidebar">
                    <div className="st-admin__card">
                        <div className="st-admin__field">
                            <span>Featured image</span>
                            {draft.image ? (
                                <div className="st-admin__image-preview">
                                    <img src={draft.image} alt="Featured preview" />
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
                                    <strong>Upload featured image</strong>
                                    <span>PNG or JPG · click to choose a file</span>
                                    <input type="file" accept="image/*" onChange={pickImage} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="st-admin__card">
                        <label className="st-admin__field">
                            <span>Excerpt</span>
                            <textarea
                                value={draft.excerpt}
                                onChange={(e) => patch({ excerpt: e.target.value })}
                                placeholder="Short summary shown on the blog card…"
                            ></textarea>
                        </label>
                    </div>

                    <div className="st-admin__card">
                        <div className="st-admin__publish-row">
                            <div>
                                <strong>Publish immediately</strong>
                                <span>Off keeps it as a draft</span>
                            </div>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={draft.published}
                                aria-label="Toggle publish"
                                className={`st-admin__switch ${draft.published ? 'is-on' : ''}`}
                                onClick={() => patch({ published: !draft.published })}
                            >
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}
