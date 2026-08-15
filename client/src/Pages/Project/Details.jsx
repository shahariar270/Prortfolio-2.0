import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SeoHead from '@Component/SeoHead'
import { api } from '@Pages/Admin/api'
import { fetchProjects } from '../../store/slices/projectsSlice'
import { RailNav } from '@Pages/Editorial/RailNav'
import ImageFallback from '@Component/ImageFallback'
import { useTheme } from '../../config/theme'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

export const ProjectDetails = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const [isDark, toggleTheme] = useTheme()
    // keyed by slug so a param change is recognized as "loading" again
    // without setting state synchronously in the effect body
    const [result, setResult] = useState({ slug: null, status: 'loading', project: null })
    // sidebar list of other projects — shares the projects cache with the
    // Projects section
    const otherProjects = useSelector((state) => state.projects.items)
    // the project list already carries full project content, so a project
    // reached via the sidebar can render instantly from cache instead of
    // waiting on a fresh fetch
    const cachedProject = otherProjects.find((p) => p.slug === slug) || null

    useEffect(() => {
        dispatch(fetchProjects())
    }, [dispatch])

    useEffect(() => {
        let cancelled = false
        api.projectBySlug(slug)
            .then((data) => {
                if (cancelled) return
                setResult({ slug, status: 'ready', project: data })
            })
            .catch(() => {
                if (!cancelled) setResult({ slug, status: 'error', project: null })
            })
        return () => {
            cancelled = true
        }
    }, [slug])

    // switching projects should feel instant, not reset scroll wherever the
    // previous project happened to leave it
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [slug])

    const fetched = result.slug === slug ? result : null
    const project = fetched?.project || cachedProject
    const status = fetched?.status === 'ready' || cachedProject ? 'ready' : (fetched?.status || 'loading')

    const sidebar = otherProjects.length > 0 && (
        <aside className="st-editorial-read__sidebar">
            <h2>Other projects</h2>
            <nav>
                {otherProjects.map((p) => (
                    <Link
                        key={p._id}
                        to={`/project/${p.slug}`}
                        className={`st-editorial-read__sidebar-link ${p.slug === slug ? 'is-active' : ''}`}
                    >
                        {p.label}
                    </Link>
                ))}
            </nav>
        </aside>
    )

    if (status === 'loading') {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Loading…" description="Loading this project." noIndex />
                <RailNav isDark={isDark} onToggleTheme={toggleTheme} />
                <main className="st-editorial-read__main" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Project not found" description="This project is not available." noIndex />
                <RailNav isDark={isDark} onToggleTheme={toggleTheme} />
                <main className="st-editorial-read__main">
                    <Link className="st-editorial-read__back" to="/project">← Back to Projects</Link>
                    <h1 className="st-editorial-read__title">This project isn't available</h1>
                </main>
            </div>
        )
    }

    return (
        <div className="st-editorial-read">
            <SeoHead
                title={`${project.type}: ${project.label}`}
                description={project.type}
                image={project.image}
                type="article"
            />
            <RailNav activeSection="sec-project" isDark={isDark} onToggleTheme={toggleTheme} />
            <main className="st-editorial-read__main">
                <div className="st-editorial-read__layout">
                    {sidebar}
                    <article className="st-editorial-read__content">
                        <Link className="st-editorial-read__back" to="/project">← Back to Projects</Link>

                        <div className="st-editorial-read__hero">
                            {project.image ? (
                                <img src={project.image} alt={project.label} />
                            ) : (
                                <ImageFallback />
                            )}
                        </div>

                        <div className="st-editorial-read__meta">
                            <span>{project.type}</span>
                        </div>
                        <h1 className="st-editorial-read__title">{project.label}</h1>

                        <div
                            className="st-editorial-read__body"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                        />

                        {project.technologies?.length > 0 && (
                            <div className="st-editorial-read__tech">
                                {project.technologies.map((tech) => (
                                    <span key={tech}>{tech}</span>
                                ))}
                            </div>
                        )}

                        <div className="st-editorial-read__links">
                            {project.liveDemo && (
                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="st-editorial__project-demo"
                                >
                                    Live Demo →
                                </a>
                            )}
                            <span className="st-editorial__project-locked">Source 🔒</span>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    )
}
