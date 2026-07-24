import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SeoHead from '@Component/SeoHead'
import { api } from '@Pages/Admin/api'
import { RailNav } from '@Pages/Editorial/RailNav'
import { useTheme } from '../../config/theme'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

export const BlogDetails = () => {
    const { slug } = useParams()
    const [isDark, toggleTheme] = useTheme()
    // keyed by slug so a param change is recognized as "loading" again
    // without setting state synchronously in the effect body
    const [result, setResult] = useState({ slug: null, status: 'loading', post: null })

    useEffect(() => {
        let cancelled = false
        api.postBySlug(slug)
            .then((data) => {
                if (cancelled) return
                setResult({ slug, status: 'ready', post: data })
                api.addPostView(slug).catch(() => {})
            })
            .catch(() => {
                if (!cancelled) setResult({ slug, status: 'error', post: null })
            })
        return () => {
            cancelled = true
        }
    }, [slug])

    const status = result.slug === slug ? result.status : 'loading'
    const post = result.slug === slug ? result.post : null

    if (status === 'loading') {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Loading…" description="Loading this note." noIndex />
                <RailNav isDark={isDark} onToggleTheme={toggleTheme} />
                <main className="st-editorial-read__main" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="st-editorial-read">
                <SeoHead title="Post not found" description="This note is not available." noIndex />
                <RailNav isDark={isDark} onToggleTheme={toggleTheme} />
                <main className="st-editorial-read__main">
                    <Link className="st-editorial-read__back" to="/blog">← Back to Notes</Link>
                    <h1 className="st-editorial-read__title">This note isn't available</h1>
                </main>
            </div>
        )
    }

    return (
        <div className="st-editorial-read">
            <SeoHead
                title={`${post.category}: ${post.title}`}
                description={post.excerpt}
                image={post.image}
                type="article"
            />
            <RailNav activeSection="sec-blog" isDark={isDark} onToggleTheme={toggleTheme} />
            <article className="st-editorial-read__main">
                <Link className="st-editorial-read__back" to="/blog">← Back to Notes</Link>

                {post.image && (
                    <div className="st-editorial-read__hero">
                        <img src={post.image} alt={post.title} />
                    </div>
                )}

                <div className="st-editorial-read__meta">
                    <span>{post.category}</span>
                    <small>
                        {formatDate(post.createdAt)} · {post.read_time}
                    </small>
                </div>
                <h1 className="st-editorial-read__title">{post.title}</h1>

                <div
                    className="st-editorial-read__body"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                />
            </article>
        </div>
    )
}
