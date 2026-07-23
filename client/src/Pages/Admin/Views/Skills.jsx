import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adjustSkillLevel as adjustSkillLevelThunk, createSkill, fetchSkills } from '../../../store/slices/skillsSlice'
import { fetchTaxonomies } from '../../../store/slices/taxonomiesSlice'
import { skillLogoFor } from '../helper'
import { SkillEditorModal } from '../SkillEditorModal'

// Reads from the Redux cache when available — fetchSkills/fetchTaxonomies
// are condition-gated and skip the network call entirely if already loaded.
export const Skills = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const skills = useSelector((state) => state.skills.items)
    const skillCats = useSelector((state) =>
        state.taxonomies.items.filter((tax) => tax.kind === 'skill_group').map((tax) => tax.label)
    )
    const [editorOpen, setEditorOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchSkills()).then((action) => {
            if (fetchSkills.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        dispatch(fetchTaxonomies()).then((action) => {
            if (fetchTaxonomies.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

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
            await dispatch(adjustSkillLevelThunk({ id: skills[index]._id, delta })).unwrap()
        } catch (err) {
            onError(err)
        }
    }

    const saveSkill = async (draft) => {
        const name = (draft.name || '').trim() || 'New skill'
        try {
            await dispatch(createSkill({
                name,
                group: draft.group,
                logo: skillLogoFor(name),
                level: draft.level,
            })).unwrap()
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
