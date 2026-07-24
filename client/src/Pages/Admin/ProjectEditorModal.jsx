import React, { useState } from 'react'

const CATEGORIES = [
    { value: 'design', label: 'Web Design' },
    { value: 'development', label: 'Web Development' },
]

// The preview stays a FileReader data URL, but the picked File itself is kept
// on the draft (imageFile) so saving can upload it as multipart form data.

export const ProjectEditorModal = ({ editor, onSave, onClose }) => {
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
                        <h2>{isNew ? 'New project' : 'Edit project'}</h2>
                        <p>Fill in the details and save</p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="st-admin__modal-body">
                    <label className="st-admin__field">
                        <span>Label</span>
                        <input
                            value={draft.label}
                            onChange={(e) => patch({ label: e.target.value })}
                            placeholder="Project name"
                        />
                    </label>

                    <div className="st-admin__field">
                        <span>Category</span>
                        <div className="st-admin__chip-options">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={draft.category === cat.value ? 'is-active' : ''}
                                    onClick={() => patch({ category: cat.value })}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

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

                    <label className="st-admin__field">
                        <span>Type</span>
                        <input
                            value={draft.type}
                            onChange={(e) => patch({ type: e.target.value })}
                            placeholder="e.g. MERN Platform, Component Library…"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Description</span>
                        <textarea
                            value={draft.description}
                            onChange={(e) => patch({ description: e.target.value })}
                            placeholder="What the project does and how it was built…"
                        ></textarea>
                    </label>

                    <label className="st-admin__field">
                        <span>Technologies</span>
                        <input
                            value={draft.technologies}
                            onChange={(e) => patch({ technologies: e.target.value })}
                            placeholder="Comma-separated, e.g. React, MongoDB, Redux Toolkit"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Live demo URL</span>
                        <input
                            value={draft.liveDemo}
                            onChange={(e) => patch({ liveDemo: e.target.value })}
                            placeholder="https://…  (leave blank if there isn't one)"
                        />
                    </label>
                </div>

                <div className="st-admin__modal-foot">
                    <button type="button" className="st-admin__btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="st-admin__btn-primary">
                        Save project
                    </button>
                </div>
            </form>
        </div>
    )
}
