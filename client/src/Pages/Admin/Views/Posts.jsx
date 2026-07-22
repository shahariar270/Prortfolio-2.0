import React from 'react'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

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
                {posts.length === 0 && (
                    <p className="st-admin__empty">No posts yet — create your first one.</p>
                )}
                {posts.map((post, index) => (
                    <div className="st-admin__card st-admin__post" key={post._id ?? `${post.title}-${index}`}>
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
                                {formatDate(post.createdAt)} · {Number(post.views ?? 0).toLocaleString()} views
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
