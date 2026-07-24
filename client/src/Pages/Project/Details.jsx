import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import { api } from '@Pages/Admin/api'
import { getInitialTheme, applyTheme } from '../../config/theme'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

export const ProjectDetails = () => {
    const { slug } = useParams()
    // keyed by slug so a param change is recognized as "loading" again
    // without setting state synchronously in the effect body
    const [result, setResult] = useState({ slug: null, status: 'loading', project: null })

    useEffect(() => {
        applyTheme(getInitialTheme())
    }, [])

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

    const status = result.slug === slug ? result.status : 'loading'
    const project = result.slug === slug ? result.project : null

    if (status === 'loading') {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Loading…" description="Loading this project." noIndex />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Project not found" description="This project is not available." noIndex />
                <Link className="st-editorial-read__back" to="/project">← Back to Projects</Link>
                <h1 className="st-editorial-read__title">This project isn't available</h1>
            </div>
        )
    }

    return (
        <article className="st-editorial-read">
            <SeoHead
                title={`${project.type}: ${project.label}`}
                description={project.type}
                image={project.image}
                type="article"
            />
            <Link className="st-editorial-read__back" to="/project">← Back to Projects</Link>

            {project.image && (
                <div className="st-editorial-read__hero">
                    <img src={project.image} alt={project.label} />
                </div>
            )}

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
    )
}
