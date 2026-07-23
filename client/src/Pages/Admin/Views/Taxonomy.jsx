import React, { useEffect, useState } from 'react'
import { api } from '../api'

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

// Self-contained page: fetches its own taxonomies, posts, and skills on
// mount (posts/skills are needed only to compute per-category counts).
export const Taxonomy = ({ onError, onNotify }) => {
    const [taxonomies, setTaxonomies] = useState([])
    const [posts, setPosts] = useState([])
    const [skills, setSkills] = useState([])

    useEffect(() => {
        api.taxonomies().then(setTaxonomies).catch(onError)
        api.allPosts().then(setPosts).catch(onError)
        api.skills().then(setSkills).catch(onError)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addTaxonomy = async (label, kind, kindName) => {
        if (taxonomies.some((tax) => tax.kind === kind && tax.label === label)) {
            onNotify(`${kindName} already exists`)
            return
        }
        try {
            const created = await api.createTaxonomy(label, kind)
            setTaxonomies((prev) => [...prev, created])
            onNotify(`${kindName} "${label}" added`)
        } catch (err) {
            onError(err)
        }
    }

    const removeTaxonomy = async (tax, kindName) => {
        try {
            await api.deleteTaxonomy(tax._id)
            setTaxonomies((prev) => prev.filter((item) => item._id !== tax._id))
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
