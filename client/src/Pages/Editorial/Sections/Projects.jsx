import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '../../../store/slices/projectsSlice'
import Skeleton from '@Component/Skeleton'
import { projectTabs } from '../helper'
import { sanitizeHtml } from '../../../utils/sanitizeHtml'
import ImageFallback from '@Component/ImageFallback'

export const Projects = () => {
    const dispatch = useDispatch()
    const [tab, setTab] = useState('all')
    const projects = useSelector((state) => state.projects.items)
    const status = useSelector((state) => state.projects.status)
    const loaded = useSelector((state) => state.projects.loaded)

    useEffect(() => {
        dispatch(fetchProjects())
    }, [dispatch])

    const filteredProjects =
        tab === 'all' ? projects : projects.filter((project) => project.category === tab)

    if (!loaded && status !== 'failed') {
        return (
            <section id="sec-project" className="st-editorial__section st-editorial__projects">
                <div className="st-editorial__projects-head">
                    <h2 className="st-editorial__heading">Projects</h2>
                </div>
                <div className="st-editorial__projects-list st-editorial__skeleton-row">
                    {[1, 2, 3, 4].map((card) => (
                        <Skeleton key={card} className="st-editorial__skeleton-card" />
                    ))}
                </div>
            </section>
        )
    }

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

            {status === 'failed' && <p className="st-editorial__projects-status">Couldn't load projects — try again shortly.</p>}
            {status !== 'failed' && filteredProjects.length === 0 && (
                <p className="st-editorial__projects-status">No projects to show yet.</p>
            )}

            <div className="st-editorial__projects-list">
                {filteredProjects.map((project) => (
                    <div className="st-editorial__project-card" key={project._id}>
                        <div className="st-editorial__project-media">
                            {project.image ? (
                                <img src={project.image} alt={`${project.label} preview`} loading="lazy" />
                            ) : (
                                <ImageFallback />
                            )}
                        </div>
                        <div className="st-editorial__project-body">
                            <span className="st-editorial__project-type">{project.type}</span>
                            <h3>{project.label}</h3>
                            <div
                                className="st-editorial__project-desc"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                            />
                            <Link to={`/project/${project.slug}`} className="st-editorial__see-more">
                                See more →
                            </Link>
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
                                    <Link to={`/project/${project.slug}`} className="st-editorial__project-locked">
                                        Case Study
                                    </Link>
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
