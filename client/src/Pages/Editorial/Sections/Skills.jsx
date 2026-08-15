import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSkills } from '../../../store/slices/skillsSlice'
import Skeleton from '@Component/Skeleton'

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
    const dispatch = useDispatch()
    const skills = useSelector((state) => state.skills.items)
    const status = useSelector((state) => state.skills.status)
    const loaded = useSelector((state) => state.skills.loaded)

    useEffect(() => {
        dispatch(fetchSkills())
    }, [dispatch])

    const categories = groupSkills(skills)

    if (!loaded && status !== 'failed') {
        return (
            <section id="sec-skill" className="st-editorial__section st-editorial__skills">
                <h2 className="st-editorial__heading">Skills &amp; AI stack</h2>
                <div className="st-editorial__skills-list">
                    {[1, 2, 3].map((row) => (
                        <div className="st-editorial__skills-row st-editorial__skeleton-group" key={row}>
                            <Skeleton width="140px" height="1.1em" />
                            <div className="st-editorial__skeleton-row">
                                {[1, 2, 3, 4].map((chip) => (
                                    <Skeleton key={chip} className="st-editorial__skeleton-chip" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section id="sec-skill" className="st-editorial__section st-editorial__skills">
            <h2 className="st-editorial__heading">Skills &amp; AI stack</h2>

            {status === 'failed' && <p className="st-editorial__skills-status">Couldn't load skills — try again shortly.</p>}
            {status !== 'failed' && categories.length === 0 && (
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
