import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects } from '../../../store/slices/projectsSlice'
import Skeleton from '@Component/Skeleton'
import { projectTabs } from '../helper'
import ImageFallback from '@Component/ImageFallback'

const getProjectExcerpt = (project) => {
    if (project.seoDescription?.trim()) {
        return project.seoDescription.trim()
    }
    if (!project.description) return ''

    // Strip heading tags (h1-h6) and their inner text so section titles like "Executive Summary" don't pollute the card preview
    let withoutHeadings = project.description.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, ' ')
    let text = withoutHeadings.replace(/<[^>]+>/g, ' ').trim()

    // Fallback if the entire description was inside a heading
    if (!text) {
        text = project.description.replace(/<[^>]+>/g, ' ').trim()
    }

    return text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

export const Projects = () => {
    const dispatch = useDispatch()
    const [tab, setTab] = useState('all')
    const projects = useSelector((state) => state.projects.items)
    const status = useSelector((state) => state.projects.status)
    const loaded = useSelector((state) => state.projects.loaded)

    useEffect(() => {
        dispatch(fetchProjects())
    }, [dispatch])

    const dynamicTabs = React.useMemo(() => {
        const unique = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))
        if (unique.length === 0) return projectTabs

        const tabs = [{ label: 'All', value: 'all' }]
        unique.forEach((cat) => {
            const label = cat === 'design' ? 'Web Design' : cat === 'development' ? 'Web Development' : cat
            if (!tabs.some((t) => t.label === label)) {
                tabs.push({ label, value: cat })
            }
        })
        return tabs
    }, [projects])

    const filteredProjects =
        tab === 'all'
            ? projects
            : projects.filter((project) => {
                  if (project.category === tab) return true
                  if (tab === 'design' && project.category === 'Web Design') return true
                  if (tab === 'Web Design' && project.category === 'design') return true
                  if (tab === 'development' && project.category === 'Web Development') return true
                  if (tab === 'Web Development' && project.category === 'development') return true
                  return false
              })

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
                    {dynamicTabs.map((item) => (
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
                {filteredProjects.map((project) => {
                    const excerpt = getProjectExcerpt(project)
                    return (
                        <article className="st-editorial__project-card" key={project._id}>
                            <Link
                                to={`/project/${project.slug}`}
                                className="st-editorial__project-media"
                                tabIndex={-1}
                                aria-label={`View ${project.label} details`}
                            >
                                {project.image ? (
                                    <img src={project.image} alt={`${project.label} preview`} loading="lazy" />
                                ) : (
                                    <ImageFallback />
                                )}
                            </Link>
                            <div className="st-editorial__project-body">
                                {project.type && (
                                    <span className="st-editorial__project-type">{project.type}</span>
                                )}
                                <h3 className="st-editorial__project-title">
                                    <Link to={`/project/${project.slug}`}>{project.label}</Link>
                                </h3>
                                {excerpt && <p className="st-editorial__project-desc">{excerpt}</p>}
                                {project.technologies?.length > 0 && (
                                    <div className="st-editorial__project-tech">
                                        {project.technologies.map((tech) => (
                                            <span key={tech}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="st-editorial__project-links">
                                    {project.liveDemo ? (
                                        <>
                                            <a
                                                href={project.liveDemo}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="st-editorial__project-btn st-editorial__project-btn--primary"
                                            >
                                                Live Demo ↗
                                            </a>
                                            <Link
                                                to={`/project/${project.slug}`}
                                                className="st-editorial__project-btn st-editorial__project-btn--ghost"
                                            >
                                                Case Study →
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to={`/project/${project.slug}`}
                                            className="st-editorial__project-btn st-editorial__project-btn--primary"
                                        >
                                            Case Study →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
