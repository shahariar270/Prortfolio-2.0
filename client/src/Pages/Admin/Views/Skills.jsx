import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { skillLogoFor } from '../helper'
import { SkillEditorModal } from '../SkillEditorModal'

// Self-contained page: fetches its own skills + skill groups on mount
// rather than relying on data preloaded by a parent route.
export const Skills = ({ onError, onNotify }) => {
    const [skills, setSkills] = useState([])
    const [skillCats, setSkillCats] = useState([])
    const [editorOpen, setEditorOpen] = useState(false)

    useEffect(() => {
        api.skills().then(setSkills).catch(onError)
        api.taxonomies('skill_group').then((cats) => setSkillCats(cats.map((c) => c.label))).catch(onError)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const groupsOrder = []
    const grouped = {}
    skills.forEach((skill) => {
        if (!grouped[skill.group]) {
            grouped[skill.group] = []
            groupsOrder.push(skill.group)
        }
        grouped[skill.group].push(skill)
    })

    const adjustLevel = async (index, delta) => {
        try {
            const updated = await api.adjustSkillLevel(skills[index]._id, delta)
            setSkills((prev) => prev.map((skill, i) => (i === index ? updated : skill)))
        } catch (err) {
            onError(err)
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
            setEditorOpen(false)
            onNotify('Skill added')
        } catch (err) {
            onError(err)
        }
    }

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>
                    {skills.length} skills across {groupsOrder.length} categories
                </span>
                <button type="button" className="st-admin__btn-primary" onClick={() => setEditorOpen(true)}>
                    ＋ Add skill
                </button>
            </div>
            <div className="st-admin__skill-groups">
                {skills.length === 0 && (
                    <p className="st-admin__empty">No skills yet — add your first one.</p>
                )}
                {groupsOrder.map((group) => (
                    <div className="st-admin__card" key={group}>
                        <div className="st-admin__card-head">
                            <h3>{group}</h3>
                            <span>{grouped[group].length}</span>
                        </div>
                        <div className="st-admin__skill-rows">
                            {grouped[group].map((skill) => {
                                const index = skills.indexOf(skill)
                                return (
                                    <div className="st-admin__skill-row" key={skill._id ?? skill.name}>
                                        <img src={skill.logo} alt="" loading="lazy" />
                                        <span className="st-admin__skill-name">{skill.name}</span>
                                        <div className="st-admin__skill-level">
                                            <div className="st-admin__meter">
                                                <div style={{ width: `${skill.level}%` }}></div>
                                            </div>
                                            <span>{skill.level}%</span>
                                        </div>
                                        <div className="st-admin__skill-steppers">
                                            <button
                                                type="button"
                                                aria-label="Decrease level"
                                                onClick={() => adjustLevel(index, -4)}
                                            >
                                                −
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Increase level"
                                                onClick={() => adjustLevel(index, 4)}
                                            >
                                                ＋
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {editorOpen && (
                <SkillEditorModal
                    groups={skillCats}
                    onSave={saveSkill}
                    onClose={() => setEditorOpen(false)}
                />
            )}
        </main>
    )
}
