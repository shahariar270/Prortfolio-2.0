import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../../store/slices/postsSlice'
import { fetchSkills } from '../../../store/slices/skillsSlice'
import { createTaxonomy, deleteTaxonomy, fetchTaxonomies } from '../../../store/slices/taxonomiesSlice'

const TaxonomyCard = ({ title, subtitle, dotClass, items, unit, placeholder, onAdd, onRemove }) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        const input = e.target.elements.cat
        const value = (input.value || '').trim()
        input.value = ''
        if (value) onAdd(value)
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
                                aria-label={`Remove ${item.label}`}
                                onClick={() => onRemove(item)}
                            >
                                ✕
                            </button>
                        </div>
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
// fetchSkills are condition-gated and skip the network call entirely if
// already loaded (posts/skills are only needed here to compute counts).
export const Taxonomy = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const taxonomies = useSelector((state) => state.taxonomies.items)
    const posts = useSelector((state) => state.posts.items)
    const skills = useSelector((state) => state.skills.items)

    useEffect(() => {
        const guard = (thunk) => (action) => {
            if (thunk.rejected.match(action) && !action.meta.condition) onError(action.payload)
        }
        dispatch(fetchTaxonomies()).then(guard(fetchTaxonomies))
        dispatch(fetchPosts()).then(guard(fetchPosts))
        dispatch(fetchSkills()).then(guard(fetchSkills))
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const addTaxonomy = async (label, kind, kindName) => {
        if (taxonomies.some((tax) => tax.kind === kind && tax.label === label)) {
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
                onRemove={(tax) => removeTaxonomy(tax, 'Group')}
            />
        </main>
    )
}
