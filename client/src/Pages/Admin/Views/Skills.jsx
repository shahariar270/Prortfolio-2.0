import React from 'react'

// BACKEND: level changes and new skills live only in memory. Needs a skills
// CRUD API; the public Skills section should read from it so admin edits
// show up on the live site.

export const Skills = ({ skills, onAdjustLevel, onAdd }) => {
    const groupsOrder = []
    const grouped = {}
    skills.forEach((skill) => {
        if (!grouped[skill.group]) {
            grouped[skill.group] = []
            groupsOrder.push(skill.group)
        }
        grouped[skill.group].push(skill)
    })

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>
                    {skills.length} skills across {groupsOrder.length} categories
                </span>
                <button type="button" className="st-admin__btn-primary" onClick={onAdd}>
                    ＋ Add skill
                </button>
            </div>
            <div className="st-admin__skill-groups">
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
                                    <div className="st-admin__skill-row" key={skill.name}>
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
                                                onClick={() => onAdjustLevel(index, -4)}
                                            >
                                                −
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Increase level"
                                                onClick={() => onAdjustLevel(index, 4)}
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
        </main>
    )
}
