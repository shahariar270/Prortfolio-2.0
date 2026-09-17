import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SeoHead from '@Component/SeoHead'
import { api } from '@Pages/Admin/api'
import { fetchPublicPosts } from '../../store/slices/postsSlice'
import { RailNav } from '@Pages/Editorial/RailNav'
import ImageFallback from '@Component/ImageFallback'
import { useTheme } from '../../config/theme'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

export const BlogDetails = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const [isDark, toggleTheme] = useTheme()
    // keyed by slug so a param change is recognized as "loading" again
    // without setting state synchronously in the effect body
    const [result, setResult] = useState({ slug: null, status: 'loading', post: null })
    // sidebar list of other notes — shares the public posts cache with the
    // Blog section
    const otherPosts = useSelector((state) => state.posts.publicItems)
    // the posts list already carries full post content, so a post
    // reached via the sidebar can render instantly from cache instead of
    // waiting on a fresh fetch
    const cachedPost = otherPosts.find((p) => p.slug === slug) || null

    useEffect(() => {
        dispatch(fetchPublicPosts())
    }, [dispatch])

    useEffect(() => {
        let cancelled = false
        api.postBySlug(slug)
            .then((data) => {
                if (cancelled) return
                setResult({ slug, status: 'ready', post: data })
                api.addPostView(slug).catch(() => {})
            })
            .catch(() => {
                if (!cancelled) setResult({ slug, status: 'error', project: null })
            })
        return () => {
            cancelled = true
        }
    }, [slug])

    // switching notes should feel instant, not reset scroll wherever the
    // previous article happened to leave it
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [slug])

    const fetched = result.slug === slug ? result : null
    const post = fetched?.post || cachedPost
    const status = fetched?.status === 'ready' || cachedPost ? 'ready' : (fetched?.status || 'loading')

    const sidebar = otherPosts.length > 0 && (
        <aside className="st-editorial-read__sidebar">
            <h2>Other notes</h2>
            <nav>
                {otherPosts.map((p) => (
                    <Link
                        key={p._id}
                        to={`/blog/${p.slug}`}
                        className={`st-editorial-read__sidebar-link ${p.slug === slug ? 'is-active' : ''}`}
                    >
                        {p.title}
                    </Link>
                ))}
            </nav>
        </aside>
    )

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
                keywords={[
                    post.category,
                    post.title,
                    'Shahariar',
                    'shahariar270',
                    'Novakrift',
                    'Web Development',
                    'React',
                    'MERN',
                ]}
            />
            <RailNav activeSection="sec-blog" isDark={isDark} onToggleTheme={toggleTheme} />
            <main className="st-editorial-read__main">
                <div className="st-editorial-read__layout">
                    {sidebar}
                    <article className="st-editorial-read__content">
                        <Link className="st-editorial-read__back" to="/blog">← Back to Notes</Link>

                        <div className="st-editorial-read__hero">
                            {post.image ? (
                                <img src={post.image} alt={post.title} />
                            ) : (
                                <ImageFallback />
                            )}
                        </div>

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
            </main>
        </div>
    )
}
