import React, { useEffect, useState } from 'react'
import SeoHead from '@Component/SeoHead'
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
    <section className="st-portfolio--blog">
      <SeoHead
        title="Blog: React, Frontend, MERN Articles"
        description="Read practical React, frontend, and MERN engineering articles covering reusable components, responsive UI, API integration, and production-ready workflows."
      />
      <div className="blog-hero">
        <p>Engineering Notes</p>
        <h2>Practical React, Frontend, and MERN Guides</h2>
        <span>
          Actionable write-ups on component architecture, responsive design,
          and full-stack implementation patterns.
        </span>
      </div>

      {status === 'error' && <p className="blog-hero__status">Couldn't load posts — try again shortly.</p>}
      {status === 'ready' && posts.length === 0 && (
        <p className="blog-hero__status">No posts published yet.</p>
      )}

      <div className="blog-grid">
        {posts.map((post) => (
          <article className="blog-card" key={post._id}>
            <img src={post.image} alt={post.title} />
            <div className="blog-card__meta">
              <span>{post.category}</span>
              <small>{post.read_time}</small>
            </div>
            <h3>{post.title}</h3>
            {/* <p>{post.excerpt}</p> */}
            <div className="blog-card__footer">
              <time>{formatDate(post.createdAt)}</time>
              <Link to={`/blog/${post.slug}`}>Read Post</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
