import React from 'react'

// BACKEND: category/group add & remove are in-memory only. Needs taxonomy
// endpoints (and referential handling for posts/skills using a removed one).

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
                {items.map((item) => (
                    <div className="st-admin__tax-row" key={item.label}>
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
                                onClick={() => onRemove(item.label)}
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
    postCats,
    skillCats,
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
                items={postCats.map((cat) => ({
                    label: cat,
                    count: posts.filter((post) => post.category === cat).length,
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
                items={skillCats.map((group) => ({
                    label: group,
                    count: skills.filter((skill) => skill.group === group).length,
                }))}
                onAdd={onAddSkillCat}
                onRemove={onRemoveSkillCat}
            />
        </main>
    )
}
