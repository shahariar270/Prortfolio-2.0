import React from 'react'

// BACKEND: publish/unpublish and edit only mutate local state. Needs
// POST/PATCH endpoints for posts and persistence to MongoDB; the public
// blog section must then read from the same API instead of its static helper.

export const Posts = ({ posts, onTogglePublish, onEdit, onAdd }) => {
    const publishedCount = posts.filter((post) => post.published).length

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>{publishedCount} published posts</span>
                <button type="button" className="st-admin__btn-primary" onClick={onAdd}>
                    ＋ New post
                </button>
            </div>
            <div className="st-admin__post-list">
                {posts.map((post, index) => (
                    <div className="st-admin__card st-admin__post" key={`${post.title}-${index}`}>
                        <img src={post.image} alt={post.title} />
                        <div className="st-admin__post-body">
                            <div className="st-admin__post-tags">
                                <span className="st-admin__chip">{post.category}</span>
                                <span
                                    className={`st-admin__status ${post.published ? 'is-published' : ''}`}
                                >
                                    <span></span>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <strong>{post.title}</strong>
                            <span className="st-admin__post-meta">
                                {post.date} · {post.views} views
                            </span>
                        </div>
                        <div className="st-admin__post-actions">
                            <button
                                type="button"
                                className="st-admin__btn-ghost"
                                onClick={() => onTogglePublish(index)}
                            >
                                {post.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                type="button"
                                className="st-admin__btn-primary"
                                onClick={() => onEdit(index)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
