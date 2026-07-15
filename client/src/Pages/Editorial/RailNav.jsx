import React from 'react'
import profileImg from '../../assets/images/profile.jpg'
import { sections } from './helper'
import { RailIcon } from './RailIcon'

export const RailNav = ({ activeSection, onNavigate, isDark, onToggleTheme }) => {
    return (
        <nav className="st-editorial__rail" aria-label="Section navigation">
            <button
                type="button"
                className="st-editorial__rail-avatar"
                onClick={() => onNavigate('sec-home')}
                aria-label="Back to top"
            >
                <img src={profileImg} alt="Shahariar" />
            </button>

            <div className="st-editorial__rail-items">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        title={section.label}
                        className={`st-editorial__rail-item ${activeSection === section.id ? 'is-active' : ''}`}
                        onClick={() => onNavigate(section.id)}
                    >
                        <RailIcon name={section.icon} />
                        <span>{section.label}</span>
                    </button>
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
