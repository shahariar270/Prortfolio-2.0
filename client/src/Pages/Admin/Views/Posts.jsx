import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchPosts, savePost as savePostThunk, togglePostPublish } from '../../../store/slices/postsSlice'
import { fetchTaxonomies, selectPostCategoryLabels } from '../../../store/slices/taxonomiesSlice'
import { PostEditor } from './PostEditor'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

// Reads from the Redux cache when available — fetchPosts/fetchTaxonomies are
// condition-gated and skip the network call entirely if already loaded.
// The create/edit form lives at this same route as ?action=new or
// ?action=edit&id=<postId> instead of a modal, so it's a real, shareable,
// back-button-friendly URL.
export const Posts = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.items)
    const postsLoaded = useSelector((state) => state.posts.loaded)
    const postCats = useSelector(selectPostCategoryLabels)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        dispatch(fetchPosts()).then((action) => {
            if (fetchPosts.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        dispatch(fetchTaxonomies()).then((action) => {
            if (fetchTaxonomies.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const action = searchParams.get('action')
    const editId = searchParams.get('id')

    const publishedCount = posts.filter((post) => post.published).length

    const togglePublish = async (id) => {
        try {
            const updated = await dispatch(togglePostPublish(id)).unwrap()
            onNotify(updated.published ? 'Post published' : 'Post moved to drafts')
        } catch (err) {
            onError(err)
        }
    }

    const openNewPostEditor = () => setSearchParams({ action: 'new' })
    const openEditPostEditor = (id) => setSearchParams({ action: 'edit', id })
    const closeEditor = () => setSearchParams({})

    const savePost = async (draft, id) => {
        const title = (draft.title || '').trim() || 'Untitled post'
        try {
            let body
            if (draft.imageFile) {
                body = new FormData()
                body.append('title', title)
                body.append('category', draft.category)
                body.append('excerpt', draft.excerpt)
                body.append('content', draft.content || '')
                body.append('published', String(draft.published))
                body.append('image', draft.imageFile)
            } else {
                body = {
                    title,
                    category: draft.category,
                    excerpt: draft.excerpt,
                    content: draft.content || '',
                    published: draft.published,
                }
                // send the image only when it's a real URL or an explicit
                // clear — never a stale FileReader data: preview
                if (!draft.image || !draft.image.startsWith('data:')) {
                    body.image = draft.image
                }
            }

            await dispatch(savePostThunk({ id, body })).unwrap()
            onNotify(id ? 'Post saved' : 'Post created')
            closeEditor()
        } catch (err) {
            onError(err)
        }
    }

    if (action === 'new') {
        return (
            <PostEditor
                key="new"
                mode="new"
                categories={postCats}
                onSave={savePost}
                onCancel={closeEditor}
            />
        )
    }

    if (action === 'edit') {
        if (!postsLoaded) {
            return (
                <main className="st-admin__view">
                    <p className="st-admin__empty">Loading…</p>
                </main>
            )
        }

        const editingPost = posts.find((post) => post._id === editId)
        if (!editingPost) {
            return (
                <main className="st-admin__view">
                    <p className="st-admin__empty">Post not found.</p>
                    <button type="button" className="st-admin__editor-back" onClick={closeEditor}>
                        ← Back to posts
                    </button>
                </main>
            )
        }

        return (
            <PostEditor
                key={editingPost._id}
                mode="edit"
                post={editingPost}
                categories={postCats}
                onSave={savePost}
                onCancel={closeEditor}
            />
        )
    }

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>{publishedCount} published posts</span>
                <button type="button" className="st-admin__btn-primary" onClick={openNewPostEditor}>
                    ＋ New post
                </button>
            </div>
            <div className="st-admin__post-list">
                {posts.length === 0 && (
                    <p className="st-admin__empty">No posts yet — create your first one.</p>
                )}
                {posts.map((post) => (
                    <div className="st-admin__card st-admin__post" key={post._id}>
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
                                onClick={() => togglePublish(post._id)}
                            >
                                {post.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                type="button"
                                className="st-admin__btn-primary"
                                onClick={() => openEditPostEditor(post._id)}
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
