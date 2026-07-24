import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@Pages/Admin/api'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

export const Blog = () => {
    const [posts, setPosts] = useState([])
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        let cancelled = false
        api.posts()
            .then((data) => {
                if (cancelled) return
                setPosts(data)
                setStatus('ready')
            })
            .catch(() => {
                if (!cancelled) setStatus('error')
            })
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <section id="sec-blog" className="st-editorial__section st-editorial__blog">
            <h2 className="st-editorial__heading">Notes</h2>

            {status === 'error' && <p className="st-editorial__blog-status">Couldn't load posts — try again shortly.</p>}
            {status === 'ready' && posts.length === 0 && (
                <p className="st-editorial__blog-status">No notes published yet.</p>
            )}

            <div className="st-editorial__blog-list">
                {posts.map((post) => (
                    <article className="st-editorial__blog-item" key={post._id}>
                        <Link className="st-editorial__blog-row" to={`/blog/${post.slug}`}>
                            <img src={post.image} alt={post.title} loading="lazy" />
                            <div className="st-editorial__blog-meta">
                                <div className="st-editorial__blog-tags">
                                    <span>{post.category}</span>
                                    <small>
                                        {formatDate(post.createdAt)} · {post.read_time}
                                    </small>
                                </div>
                                <h3>{post.title}</h3>
                                {post.excerpt && <p>{post.excerpt}</p>}
                            </div>
                            <span className="st-editorial__see-more">Read post →</span>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    )
}
