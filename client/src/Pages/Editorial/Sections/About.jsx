import React from 'react'
import profileImg from '../../../assets/images/profile.jpg'
import { experienceItems, educationItems } from '../helper'

export const About = () => {
    return (
        <section id="sec-about" className="st-editorial__section st-editorial__about">
            <h2 className="st-editorial__heading">About</h2>
            <div className="st-editorial__about-grid">
                <img className="st-editorial__about-photo" src={profileImg} alt="Shahariar" />
                <div className="st-editorial__about-body">
                    <p className="st-editorial__about-lede">
                        I build scalable, high-performance web solutions with clean architecture. As a MERN
                        specialist and WordPress expert, I lead a development team — and I've rebuilt my whole
                        workflow around AI: Claude for planning and review, Cursor for pair-coding, Codex for
                        agentic edits.
                    </p>
                    <div className="st-editorial__about-list">
                        {experienceItems.map((exp) => (
                            <article className="st-editorial__about-row" key={exp.title}>
                                <span className="st-editorial__about-period">{exp.period}</span>
                                <div>
                                    <h3>
                                        {exp.title} <span>— {exp.company}</span>
                                    </h3>
                                    <ul>
                                        {exp.points.map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                        <article className="st-editorial__about-row">
                            <span className="st-editorial__about-period">Education</span>
                            <div className="st-editorial__about-education">
                                {educationItems.map((item) => (
                                    <p key={item.degree}>
                                        {item.degree} <span>— {item.status}</span>
                                    </p>
                                ))}
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}
