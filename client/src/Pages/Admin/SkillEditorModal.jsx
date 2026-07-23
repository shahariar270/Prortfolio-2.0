import React, { useState } from 'react'

// BACKEND: saved skills exist only in memory; needs a skills POST endpoint.

export const SkillEditorModal = ({ groups, onSave, onClose }) => {
    const [draft, setDraft] = useState({
        name: '',
        group: groups[0] || 'Frontend',
        level: 70,
    })

    const patch = (changes) => setDraft((prev) => ({ ...prev, ...changes }))

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(draft)
    }

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
