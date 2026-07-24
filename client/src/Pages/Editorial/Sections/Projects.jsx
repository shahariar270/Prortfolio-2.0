import React, { useEffect, useState } from 'react'
import { api } from '@Pages/Admin/api'
import { projectTabs } from '../helper'

export const Projects = () => {
    const [tab, setTab] = useState('all')
    const [projects, setProjects] = useState([])
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        let cancelled = false
        api.projects()
            .then((data) => {
                if (cancelled) return
                setProjects(data)
                setStatus('ready')
            })
            .catch(() => {
                if (!cancelled) setStatus('error')
            })
        return () => {
            cancelled = true
        }
    }, [])

    const filteredProjects =
        tab === 'all' ? projects : projects.filter((project) => project.category === tab)

    return (
        <section id="sec-project" className="st-editorial__section st-editorial__projects">
            <div className="st-editorial__projects-head">
                <h2 className="st-editorial__heading">Projects</h2>
                <div className="st-editorial__projects-tabs">
                    {projectTabs.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={`st-editorial__tab ${tab === item.value ? 'is-active' : ''}`}
                            onClick={() => setTab(item.value)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {status === 'error' && <p className="st-editorial__projects-status">Couldn't load projects — try again shortly.</p>}
            {status === 'ready' && filteredProjects.length === 0 && (
                <p className="st-editorial__projects-status">No projects to show yet.</p>
            )}

            <div className="st-editorial__projects-list">
                {filteredProjects.map((project) => (
                    <div className="st-editorial__project-card" key={project._id}>
                        <div className="st-editorial__project-media">
                            <img src={project.image} alt={`${project.label} preview`} loading="lazy" />
                        </div>
                        <div className="st-editorial__project-body">
                            <span className="st-editorial__project-type">{project.type}</span>
                            <h3>{project.label}</h3>
                            <p>{project.description}</p>
                            <div className="st-editorial__project-tech">
                                {project.technologies.map((tech) => (
                                    <span key={tech}>{tech}</span>
                                ))}
                            </div>
                            <div className="st-editorial__project-links">
                                {project.liveDemo ? (
                                    <a
                                        href={project.liveDemo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="st-editorial__project-demo"
                                    >
                                        Live Demo →
                                    </a>
                                ) : (
                                    <span className="st-editorial__project-locked">Case Study</span>
                                )}
                                <span className="st-editorial__project-locked">Source 🔒</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
