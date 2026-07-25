import React from 'react'
import { HashLink } from 'react-router-hash-link'
import profileImg from '../../assets/images/profile.jpg'
import { sections } from './helper'
import { RailIcon } from './RailIcon'

export const RailNav = ({ activeSection, isDark, onToggleTheme }) => {
    return (
        <nav className="st-editorial__rail" aria-label="Section navigation">
            <HashLink
                smooth
                to="/#sec-home"
                className="st-editorial__rail-avatar"
                aria-label="Back to top"
            >
                <img src={profileImg} alt="Shahariar" />
            </HashLink>

            <div className="st-editorial__rail-items">
                {sections.map((section) => (
                    <HashLink
                        key={section.id}
                        smooth
                        title={section.label}
                        to={`/#${section.id}`}
                        className={`st-editorial__rail-item ${activeSection === section.id ? 'is-active' : ''}`}
                    >
                        <RailIcon name={section.icon} />
                        <span>{section.label}</span>
                    </HashLink>
                ))}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                className="st-editorial__rail-theme"
                onClick={onToggleTheme}
            >
                {isDark ? '☀️' : '🌙'}
            </button>
        </nav>
    )
}
