import React, { useState } from 'react'
import { skillLogoFor } from './helper'

// The preview stays a FileReader data URL, but the picked File itself is kept
// on the draft (imageFile) so saving can upload it as multipart form data.
// Leaving the logo untouched falls back to an auto-generated icon from the
// skill name (skillLogoFor) — uploading one here overrides that.

export const SkillEditorModal = ({ groups, onSave, onClose }) => {
    const [draft, setDraft] = useState({
        name: '',
        group: groups[0] || 'Frontend',
        level: 70,
        image: '',
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
        onSave(draft)
    }

    const autoLogo = draft.name.trim() ? skillLogoFor(draft.name.trim()) : ''

    return (
        <div className="st-admin__overlay" onClick={onClose}>
            <form
                className="st-admin__modal st-admin__modal--narrow"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="st-admin__modal-head">
                    <div>
                        <h2>Add skill</h2>
                        <p>New skills appear on your live Skills section</p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="st-admin__modal-body">
                    <label className="st-admin__field">
                        <span>Skill name</span>
                        <input
                            value={draft.name}
                            onChange={(e) => patch({ name: e.target.value })}
                            placeholder="e.g. GraphQL"
                        />
                    </label>

                    <div className="st-admin__field">
                        <span>Logo</span>
                        {draft.image ? (
                            <div className="st-admin__image-preview">
                                <img src={draft.image} alt="Logo preview" />
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
                                {autoLogo ? (
                                    <>
                                        <img className="st-admin__dropzone-auto-preview" src={autoLogo} alt="" />
                                        <strong>Using an auto-generated icon</strong>
                                        <span>Click to upload a custom logo instead</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="st-admin__dropzone-icon">↑</span>
                                        <strong>Upload a logo</strong>
                                        <span>PNG or JPG · optional, auto-generates from the name otherwise</span>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={pickImage} />
                            </label>
                        )}
                    </div>

                    <div className="st-admin__field">
                        <span>Group</span>
                        <div className="st-admin__chip-options">
                            {groups.map((group) => (
                                <button
                                    key={group}
                                    type="button"
                                    className={draft.group === group ? 'is-active' : ''}
                                    onClick={() => patch({ group })}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className="st-admin__field st-admin__field--range">
                        <span>
                            Proficiency <em>{draft.level}%</em>
                        </span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={draft.level}
                            onChange={(e) => patch({ level: +e.target.value })}
                        />
                    </label>
                </div>

                <div className="st-admin__modal-foot">
                    <button type="button" className="st-admin__btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="st-admin__btn-primary">
                        Save skill
                    </button>
                </div>
            </form>
        </div>
    )
}
