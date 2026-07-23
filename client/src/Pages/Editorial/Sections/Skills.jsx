import React from 'react'
import { skillCategories } from '@Pages/Skill/helper'

export const Skills = () => {
    return (
        <section id="sec-skill" className="st-editorial__section st-editorial__skills">
            <h2 className="st-editorial__heading">Skills &amp; AI stack</h2>
            <div className="st-editorial__skills-list">
                {skillCategories.map((cat) => (
                    <div className="st-editorial__skills-row" key={cat.id}>
                        <h3>
                            {cat.label} <span>({cat.cards.length})</span>
                        </h3>
                        <div className="st-editorial__skills-chips">
                            {cat.cards.map((card) => (
                                <span
                                    key={card.front}
                                    className="st-editorial__skill-chip"
                                    title={card.back.join(' · ')}
                                >
                                    <img src={card.logo} alt="" loading="lazy" />
                                    {card.front}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
