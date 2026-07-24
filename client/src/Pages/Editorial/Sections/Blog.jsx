import React, { useEffect, useState } from 'react'
import { api } from '@Pages/Admin/api'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

export const Blog = ({ initialExpandedSlug = null }) => {
    const [posts, setPosts] = useState([])
    const [expandedSlug, setExpandedSlug] = useState(initialExpandedSlug)

    useEffect(() => {
        let cancelled = false
        api.posts()
            .then((data) => {
                if (!cancelled) setPosts(data)
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        setExpandedSlug(initialExpandedSlug)
    }, [initialExpandedSlug])

    return (
        <section id="sec-blog" className="st-editorial__section st-editorial__blog">
            <h2 className="st-editorial__heading">Notes</h2>
            <div className="st-editorial__blog-list">
                {posts.map((post) => {
                    const expanded = expandedSlug === post.slug
                    return (
                        <article className="st-editorial__blog-item" key={post._id}>
                            <div
                                className="st-editorial__blog-row"
                                role="button"
                                tabIndex={0}
                                aria-expanded={expanded}
                                onClick={() => setExpandedSlug(expanded ? null : post.slug)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setExpandedSlug(expanded ? null : post.slug)
                                    }
                                }}
                            >
                                <img src={post.image} alt={post.title} loading="lazy" />
                                <div className="st-editorial__blog-meta">
                                    <div className="st-editorial__blog-tags">
                                        <span>{post.category}</span>
                                        <small>
                                            {formatDate(post.createdAt)} · {post.read_time}
                                        </small>
                                    </div>
                                    <h3>{post.title}</h3>
                                    {/* <p>{post.excerpt}</p> */}
                                </div>
                                <span
                                    className={`st-editorial__blog-chevron ${expanded ? 'is-open' : ''}`}
                                    aria-hidden="true"
                                >
                                    ↓
                                </span>
                            </div>
                            {expanded && (
                                <div className="st-editorial__blog-content">
                                    {post.content.map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            )}
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
