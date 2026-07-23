import React from 'react'

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

export const Taxonomy = ({
    taxonomies,
    posts,
    skills,
    onAddPostCat,
    onRemovePostCat,
    onAddSkillCat,
    onRemoveSkillCat,
}) => {
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
                onAdd={onAddPostCat}
                onRemove={onRemovePostCat}
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
                onAdd={onAddSkillCat}
                onRemove={onRemoveSkillCat}
            />
        </main>
    )
}
