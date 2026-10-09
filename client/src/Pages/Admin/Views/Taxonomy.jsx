import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../../store/slices/postsSlice'
import { fetchSkills } from '../../../store/slices/skillsSlice'
import { fetchProjects } from '../../../store/slices/projectsSlice'
import { createTaxonomy, deleteTaxonomy, updateTaxonomy, fetchTaxonomies } from '../../../store/slices/taxonomiesSlice'

const TaxonomyCard = ({ title, subtitle, dotClass, items, unit, placeholder, onAdd, onEdit, onRemove }) => {
    const [editingId, setEditingId] = useState(null)
    const [editVal, setEditVal] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const input = e.target.elements.cat
        const value = (input.value || '').trim()
        input.value = ''
        if (value) onAdd(value)
    }

    const startEdit = (item) => {
        setEditingId(item._id)
        setEditVal(item.label)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditVal('')
    }

    const handleSaveEdit = (item) => {
        const trimmed = editVal.trim()
        if (trimmed && trimmed !== item.label) {
            onEdit(item, trimmed)
        }
        cancelEdit()
    }

    return (
        <div className="st-admin__card">
            <h3 className="st-admin__card-title st-admin__card-title--tight">{title}</h3>
            <p className="st-admin__card-subtitle">{subtitle}</p>
            <div className="st-admin__tax-list">
                {items.length === 0 && (
                    <p className="st-admin__empty">Nothing here yet.</p>
                )}
                {items.map((item) => (
                    <div className="st-admin__tax-row" key={item._id ?? item.label}>
                        {editingId === item._id ? (
                            <form
                                className="st-admin__tax-edit-form"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSaveEdit(item)
                                }}
                            >
                                <span className={`st-admin__tax-dot ${dotClass}`}></span>
                                <input
                                    value={editVal}
                                    onChange={(e) => setEditVal(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') cancelEdit()
                                    }}
                                />
                                <button type="submit" className="st-admin__tax-btn-save" aria-label="Save">
                                    ✓
                                </button>
                                <button type="button" onClick={cancelEdit} aria-label="Cancel">
                                    ✕
                                </button>
                            </form>
                        ) : (
                            <>
                                <div>
                                    <span className={`st-admin__tax-dot ${dotClass}`}></span>
                                    <span className="st-admin__tax-label">{item.label}</span>
                                </div>
                                <div>
                                    <span className="st-admin__tax-count">
                                        {item.count} {unit}
                                    </span>
                                    <button
                                        type="button"
                                        className="st-admin__tax-btn-edit"
                                        aria-label={`Edit ${item.label}`}
                                        onClick={() => startEdit(item)}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        type="button"
                                        className="st-admin__tax-btn-delete"
                                        aria-label={`Remove ${item.label}`}
                                        onClick={() => onRemove(item)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <form className="st-admin__tax-form" onSubmit={handleSubmit}>
                <input name="cat" placeholder={placeholder} />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

// Reads from the Redux cache when available — fetchTaxonomies/fetchPosts/
// fetchSkills/fetchProjects are condition-gated and skip the network call entirely if
// already loaded (used here to compute real-time counts).
export const Taxonomy = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const taxonomies = useSelector((state) => state.taxonomies.items)
    const posts = useSelector((state) => state.posts.items)
    const skills = useSelector((state) => state.skills.items)
    const projects = useSelector((state) => state.projects.items)

    useEffect(() => {
        const guard = (thunk) => (action) => {
            if (thunk.rejected.match(action) && !action.meta.condition) onError(action.payload)
        }
        dispatch(fetchTaxonomies()).then(guard(fetchTaxonomies))
        dispatch(fetchPosts()).then(guard(fetchPosts))
        dispatch(fetchSkills()).then(guard(fetchSkills))
        dispatch(fetchProjects()).then(guard(fetchProjects))
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const addTaxonomy = async (label, kind, kindName) => {
        if (taxonomies.some((tax) => tax.kind === kind && tax.label.toLowerCase() === label.toLowerCase())) {
            onNotify(`${kindName} already exists`)
            return
        }
        try {
            await dispatch(createTaxonomy({ label, kind })).unwrap()
            onNotify(`${kindName} "${label}" added`)
        } catch (err) {
            onError(err)
        }
    }

    const editTaxonomy = async (tax, newLabel, kindName) => {
        if (!newLabel || !newLabel.trim()) return
        const trimmed = newLabel.trim()
        if (trimmed === tax.label) return
        try {
            await dispatch(updateTaxonomy({ id: tax._id, label: trimmed })).unwrap()
            // also refresh collections to sync any renamed category associations
            dispatch(fetchProjects())
            dispatch(fetchPosts())
            dispatch(fetchSkills())
            onNotify(`${kindName} renamed to "${trimmed}"`)
        } catch (err) {
            onError(err)
        }
    }

    const removeTaxonomy = async (tax, kindName) => {
        try {
            await dispatch(deleteTaxonomy(tax._id)).unwrap()
            onNotify(`${kindName} "${tax.label}" removed`)
        } catch (err) {
            // an in-use label comes back as 409 with a descriptive message
            onError(err)
        }
    }

    return (
        <main className="st-admin__view st-admin__view--taxonomy">
            <TaxonomyCard
                title="Project categories"
                subtitle="Used to group and filter portfolio projects"
                dotClass="is-accent"
                unit="projects"
                placeholder="New project category…"
                items={taxonomies
                    .filter((tax) => tax.kind === 'project_category')
                    .map((tax) => ({
                        ...tax,
                        count: projects.filter(
                            (project) =>
                                project.category === tax.label ||
                                (tax.label.toLowerCase() === 'web design' && project.category === 'design') ||
                                (tax.label.toLowerCase() === 'web development' && project.category === 'development')
                        ).length,
                    }))}
                onAdd={(v) => addTaxonomy(v, 'project_category', 'Category')}
                onEdit={(tax, newLabel) => editTaxonomy(tax, newLabel, 'Category')}
                onRemove={(tax) => removeTaxonomy(tax, 'Category')}
            />
            <TaxonomyCard
                title="Post categories"
                subtitle="Used to tag and filter blog notes"
                dotClass="is-primary"
                unit="posts"
                placeholder="New category…"
                items={taxonomies
                    .filter((tax) => tax.kind === 'post_category')
                    .map((tax) => ({
                        ...tax,
                        count: posts.filter((post) => post.category === tax.label).length,
                    }))}
                onAdd={(v) => addTaxonomy(v, 'post_category', 'Category')}
                onEdit={(tax, newLabel) => editTaxonomy(tax, newLabel, 'Category')}
                onRemove={(tax) => removeTaxonomy(tax, 'Category')}
            />
            <TaxonomyCard
                title="Skill groups"
                subtitle="Categories your skills are organized under"
                dotClass="is-secondary"
                unit="skills"
                placeholder="New group…"
                items={taxonomies
                    .filter((tax) => tax.kind === 'skill_group')
                    .map((tax) => ({
                        ...tax,
                        count: skills.filter((skill) => skill.group === tax.label).length,
                    }))}
                onAdd={(v) => addTaxonomy(v, 'skill_group', 'Group')}
                onEdit={(tax, newLabel) => editTaxonomy(tax, newLabel, 'Group')}
                onRemove={(tax) => removeTaxonomy(tax, 'Group')}
            />
        </main>
    )
}
