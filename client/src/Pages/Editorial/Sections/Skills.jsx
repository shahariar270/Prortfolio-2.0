import React, { useEffect, useState } from 'react'
import { api } from '@Pages/Admin/api'

const groupSkills = (skills) => {
    const order = []
    const grouped = {}
    skills.forEach((skill) => {
        if (!grouped[skill.group]) {
            grouped[skill.group] = []
            order.push(skill.group)
        }
        grouped[skill.group].push(skill)
    })
    return order.map((group) => ({ group, items: grouped[group] }))
}

export const Skills = () => {
    const [skills, setSkills] = useState([])
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        let cancelled = false
        api.skills()
            .then((data) => {
                if (cancelled) return
                setSkills(data)
                setStatus('ready')
            })
            .catch(() => {
                if (!cancelled) setStatus('error')
            })
        return () => {
            cancelled = true
        }
    }, [])

    const categories = groupSkills(skills)

    return (
        <section id="sec-skill" className="st-editorial__section st-editorial__skills">
            <h2 className="st-editorial__heading">Skills &amp; AI stack</h2>

            {status === 'error' && <p className="st-editorial__skills-status">Couldn't load skills — try again shortly.</p>}
            {status === 'ready' && categories.length === 0 && (
                <p className="st-editorial__skills-status">No skills added yet.</p>
            )}

            <div className="st-editorial__skills-list">
                {categories.map((cat) => (
                    <div className="st-editorial__skills-row" key={cat.group}>
                        <h3>
                            {cat.group} <span>({cat.items.length})</span>
                        </h3>
                        <div className="st-editorial__skills-chips">
                            {cat.items.map((skill) => (
                                <span
                                    key={skill._id}
                                    className="st-editorial__skill-chip"
                                    title={`${skill.name} — ${skill.level}%`}
                                >
                                    <img src={skill.logo} alt="" loading="lazy" />
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
