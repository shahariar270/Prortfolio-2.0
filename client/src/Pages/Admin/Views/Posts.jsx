import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, savePost as savePostThunk, togglePostPublish } from '../../../store/slices/postsSlice'
import { fetchTaxonomies, selectPostCategoryLabels } from '../../../store/slices/taxonomiesSlice'
import { PostEditorModal } from '../PostEditorModal'

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : ''

// Reads from the Redux cache when available — fetchPosts/fetchTaxonomies are
// condition-gated and skip the network call entirely if already loaded.
export const Posts = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.posts.items)
    const postCats = useSelector(selectPostCategoryLabels)
    const [editor, setEditor] = useState(null)

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

    const publishedCount = posts.filter((post) => post.published).length

    const togglePublish = async (index) => {
        try {
            const updated = await dispatch(togglePostPublish(posts[index]._id)).unwrap()
            onNotify(updated.published ? 'Post published' : 'Post moved to drafts')
        } catch (err) {
            onError(err)
        }
    }

    const openNewPostEditor = () => {
        setEditor({
            index: null,
            category: postCats[0] || 'React',
            title: '',
            excerpt: '',
            published: false,
            image: '',
        })
    }

    const openEditPostEditor = (index) => {
        const post = posts[index]
        setEditor({
            index,
            category: post.category,
            title: post.title,
            excerpt: post.excerpt || '',
            published: post.published,
            image: post.image || '',
        })
    }

    const savePost = async (draft) => {
        const title = (draft.title || '').trim() || 'Untitled post'
        try {
            let body
            if (draft.imageFile) {
                body = new FormData()
                body.append('title', title)
                body.append('category', draft.category)
                body.append('excerpt', draft.excerpt)
                body.append('published', String(draft.published))
                body.append('image', draft.imageFile)
            } else {
                body = {
                    title,
                    category: draft.category,
                    excerpt: draft.excerpt,
                    published: draft.published,
                }
                // send the image only when it's a real URL or an explicit
                // clear — never a stale FileReader data: preview
                if (!draft.image || !draft.image.startsWith('data:')) {
                    body.image = draft.image
                }
            }

            const id = draft.index === null ? undefined : posts[draft.index]._id
            await dispatch(savePostThunk({ id, body })).unwrap()
            onNotify(draft.index === null ? 'Post created' : 'Post saved')
            setEditor(null)
        } catch (err) {
            onError(err)
        }
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
                                onClick={() => togglePublish(index)}
                            >
                                {post.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                                type="button"
                                className="st-admin__btn-primary"
                                onClick={() => openEditPostEditor(index)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editor && (
                <PostEditorModal
                    editor={editor}
                    categories={postCats}
                    onSave={savePost}
                    onClose={() => setEditor(null)}
                />
            )}
        </main>
    )
}
