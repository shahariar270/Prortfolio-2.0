import React from 'react'
import { heroStats } from '../helper'
import heroImg from '../../../assets/images/home.jpg'

export const Hero = ({ onSeeWork }) => {
    return (
        <section id="sec-home" className="st-editorial__hero">
            <div className="st-editorial__hero-top">
                <div className="st-editorial__hero-intro">
                    <p className="st-editorial__hero-status">Available for work · Jhenaidah, Bangladesh</p>
                    <h1>
                        Shahariar builds web products for the <em>AI&nbsp;era</em>.
                    </h1>
                    <div className="st-editorial__hero-row">
                        <p>
                            React &amp; MERN engineer shipping production apps with AI copilots — Claude, Cursor,
                            Codex — in the loop. Human judgment, machine speed.
                        </p>
                        <div className="st-editorial__hero-actions">
                            <button type="button" className="st-editorial__btn st-editorial__btn--primary" onClick={onSeeWork}>
                                See the work ↓
                            </button>
                            <a
                                href="/resume.pdf"
                                download="Shahariar-Resume.pdf"
                                className="st-editorial__btn st-editorial__btn--ghost"
                            >
                                ↓ Resume
                            </a>
                        </div>
                    </div>
                </div>
                <div className="st-editorial__hero-media">
                    <img src={heroImg} alt="Shahariar" loading="eager" />
                </div>
            </div>
            <div className="st-editorial__hero-stats">
                {heroStats.map((stat) => (
                    <div key={stat.label}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
