import React, { useState } from 'react'

// The preview stays a FileReader data URL, but the picked File itself is kept
// on the draft (imageFile) so saving can upload it as multipart form data.

export const PostEditorModal = ({ editor, categories, onSave, onClose }) => {
    const [draft, setDraft] = useState(editor)
    const isNew = editor.index === null

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
        onSave(draft)
    }

    return (
        <div className="st-admin__overlay" onClick={onClose}>
            <form
                className="st-admin__modal"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="st-admin__modal-head">
                    <div>
                        <h2>{isNew ? 'New post' : 'Edit post'}</h2>
                        <p>Fill in the details and save</p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="st-admin__modal-body">
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

                    <label className="st-admin__field">
                        <span>Excerpt</span>
                        <textarea
                            value={draft.excerpt}
                            onChange={(e) => patch({ excerpt: e.target.value })}
                            placeholder="Short summary shown on the blog card…"
                        ></textarea>
                    </label>

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

                <div className="st-admin__modal-foot">
                    <button type="button" className="st-admin__btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="st-admin__btn-primary">
                        Save post
                    </button>
                </div>
            </form>
        </div>
    )
}
