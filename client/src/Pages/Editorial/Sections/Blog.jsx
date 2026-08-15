import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPublicPosts } from '../../../store/slices/postsSlice'
import Skeleton from '@Component/Skeleton'
import ImageFallback from '@Component/ImageFallback'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

export const Blog = () => {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.publicItems)
    const status = useSelector((state) => state.posts.publicStatus)
    const loaded = useSelector((state) => state.posts.publicLoaded)

    useEffect(() => {
        dispatch(fetchPublicPosts())
    }, [dispatch])

    if (!loaded && status !== 'failed') {
        return (
            <section id="sec-blog" className="st-editorial__section st-editorial__blog">
                <h2 className="st-editorial__heading">Notes</h2>
                <div className="st-editorial__blog-list">
                    {[1, 2, 3].map((item) => (
                        <div className="st-editorial__blog-item st-editorial__skeleton-group" key={item}>
                            <Skeleton width="100%" height="160px" />
                            <Skeleton width="40%" height="1em" />
                            <Skeleton width="80%" height="1.2em" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section id="sec-blog" className="st-editorial__section st-editorial__blog">
            <h2 className="st-editorial__heading">Notes</h2>

            {status === 'failed' && <p className="st-editorial__blog-status">Couldn't load posts — try again shortly.</p>}
            {status !== 'failed' && posts.length === 0 && (
                <p className="st-editorial__blog-status">No notes published yet.</p>
            )}

            <div className="st-editorial__blog-list">
                {posts.map((post) => (
                    <article className="st-editorial__blog-item" key={post._id}>
                        <Link className="st-editorial__blog-row" to={`/blog/${post.slug}`}>
                            {post.image ? (
                                <img src={post.image} alt={post.title} loading="lazy" />
                            ) : (
                                <ImageFallback />
                            )}
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
