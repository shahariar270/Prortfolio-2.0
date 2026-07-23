import React, { useState } from 'react'
import { featuredPosts } from '@Pages/Blog/helper'

export const Blog = ({ initialExpanded = null }) => {
    const [expandedPost, setExpandedPost] = useState(initialExpanded)

    return (
        <section id="sec-blog" className="st-editorial__section st-editorial__blog">
            <h2 className="st-editorial__heading">Notes</h2>
            <div className="st-editorial__blog-list">
                {featuredPosts.map((post, index) => {
                    const expanded = expandedPost === index
                    return (
                        <article className="st-editorial__blog-item" key={post.title}>
                            <div
                                className="st-editorial__blog-row"
                                role="button"
                                tabIndex={0}
                                aria-expanded={expanded}
                                onClick={() => setExpandedPost(expanded ? null : index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setExpandedPost(expanded ? null : index)
                                    }
                                }}
                            >
                                <img src={post.image} alt={post.title} loading="lazy" />
                                <div className="st-editorial__blog-meta">
                                    <div className="st-editorial__blog-tags">
                                        <span>{post.category}</span>
                                        <small>
                                            {post.date} · {post.readTime}
                                        </small>
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
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
                                    {post.content.map((paragraph) => (
                                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
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
