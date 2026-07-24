import React, { useEffect, useState } from 'react'
import SeoHead from '@Component/SeoHead'
import { Link, useParams } from 'react-router-dom'
import { api } from '@Pages/Admin/api'

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : ''

export const BlogDetails = () => {
  const { title: slug } = useParams()
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
      <section className="st-portfolio--blog-detail">
        <SeoHead title="Loading…" description="Loading this blog article." noIndex />
      </section>
    )
  }

  if (!post) {
    return (
      <section className="st-portfolio--blog-detail">
        <SeoHead
          title="Post not found"
          description="This blog article is not available."
          noIndex
        />
        <div className="blog-detail__not-found">
          <p>Post not found</p>
          <h2>This blog article is not available.</h2>
          <Link to="/blog">Back to Blog</Link>
        </div>
      </section>
    )
  }

  return (
    <article className="st-portfolio--blog-detail">
      <SeoHead
        title={`${post.category}: ${post.title}`}
        description={post.excerpt}
        image={post.image}
        type="article"
      />
      <Link className="blog-detail__back" to="/blog">Back to Blog</Link>

      <div className="blog-detail__hero">
        <img src={post.image} alt={post.title} />
        <div className="blog-detail__intro">
          <div className="blog-detail__meta">
            <span>{post.category}</span>
            <small>{formatDate(post.createdAt)} | {post.read_time}</small>
          </div>
          <h1>{post.title}</h1>
          {/* <p>{post.excerpt}</p> */}
        </div>
        <div className="blog-detail__content">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

    </article>
  )
}
