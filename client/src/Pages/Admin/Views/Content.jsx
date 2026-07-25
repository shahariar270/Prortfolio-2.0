import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContent, updateContent } from '../../../store/slices/contentSlice'

// Site copy is a singleton, not a list — this view fetches it once and edits
// it in place, unlike Posts/Skills/Projects which manage many records.
export const Content = ({ onError, onNotify }) => {
    const dispatch = useDispatch()
    const content = useSelector((state) => state.content.data)
    const loaded = useSelector((state) => state.content.loaded)

    useEffect(() => {
        dispatch(fetchContent()).then((action) => {
            if (fetchContent.rejected.match(action) && !action.meta.condition) onError(action.payload)
        })
        // onError intentionally omitted — it's a fresh function every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    if (!loaded) {
        return (
            <main className="st-admin__view">
                <p className="st-admin__empty">Loading…</p>
            </main>
        )
    }

    // keyed so if the record is ever replaced wholesale the form resets
    // cleanly instead of merging stale local state with new server state
    return <ContentForm key={content?._id || 'new'} content={content} onError={onError} onNotify={onNotify} />
}

const ContentForm = ({ content, onError, onNotify }) => {
    const dispatch = useDispatch()
    const [draft, setDraft] = useState(() => ({
        hero: {
            status: content?.hero?.status || '',
            headline: content?.hero?.headline || '',
            highlight: content?.hero?.highlight || '',
            bio: content?.hero?.bio || '',
            stats: (content?.hero?.stats || []).map((s) => ({ value: s.value || '', label: s.label || '' })),
        },
        about: {
            bio: content?.about?.bio || '',
            experience: (content?.about?.experience || []).map((e) => ({
                title: e.title || '',
                company: e.company || '',
                period: e.period || '',
                pointsText: (e.points || []).join('\n'),
            })),
            education: (content?.about?.education || []).map((e) => ({ degree: e.degree || '', status: e.status || '' })),
        },
        contact: {
            intro: content?.contact?.intro || '',
            email: content?.contact?.email || '',
            phone: content?.contact?.phone || '',
            location: content?.contact?.location || '',
            social: (content?.contact?.social || []).map((s) => ({ label: s.label || '', href: s.href || '', icon: s.icon || '' })),
        },
        footer: content?.footer || '',
        // kept separate from hero/about — these are plain "current URL or
        // FileReader preview" fields, same shape PostEditor/ProjectEditor use
        heroImage: content?.hero?.image || '',
        heroImageFile: null,
        aboutPhoto: content?.about?.photo || '',
        aboutPhotoFile: null,
    }))

    const pickImage = (urlKey, fileKey) => (e) => {
        const file = e.target.files && e.target.files[0]
        e.target.value = ''
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => setDraft((prev) => ({ ...prev, [urlKey]: reader.result, [fileKey]: file }))
        reader.readAsDataURL(file)
    }

    const clearImage = (urlKey, fileKey) =>
        setDraft((prev) => ({ ...prev, [urlKey]: '', [fileKey]: null }))

    const patchSection = (section, changes) =>
        setDraft((prev) => ({ ...prev, [section]: { ...prev[section], ...changes } }))

    const patchListItem = (section, key, index, changes) =>
        setDraft((prev) => {
            const list = prev[section][key].map((item, i) => (i === index ? { ...item, ...changes } : item))
            return { ...prev, [section]: { ...prev[section], [key]: list } }
        })

    const addListItem = (section, key, empty) =>
        setDraft((prev) => ({
            ...prev,
            [section]: { ...prev[section], [key]: [...prev[section][key], empty] },
        }))

    const removeListItem = (section, key, index) =>
        setDraft((prev) => ({
            ...prev,
            [section]: { ...prev[section], [key]: prev[section][key].filter((_, i) => i !== index) },
        }))

    const handleSubmit = async (e) => {
        e.preventDefault()

        // always multipart: the two images may or may not be attached, but
        // the rest of the payload rides along as JSON-encoded form fields
        // either way — backend overwrites hero.image/about.photo from the
        // uploaded file when present, so a stale data: preview here never
        // actually gets persisted
        const body = new FormData()
        body.append('hero', JSON.stringify({ ...draft.hero, image: draft.heroImage }))
        body.append('about', JSON.stringify({
            bio: draft.about.bio,
            experience: draft.about.experience.map((exp) => ({
                title: exp.title,
                company: exp.company,
                period: exp.period,
                points: exp.pointsText
                    .split('\n')
                    .map((p) => p.trim())
                    .filter(Boolean),
            })),
            education: draft.about.education,
            photo: draft.aboutPhoto,
        }))
        body.append('contact', JSON.stringify(draft.contact))
        body.append('footer', draft.footer)
        if (draft.heroImageFile) body.append('heroImage', draft.heroImageFile)
        if (draft.aboutPhotoFile) body.append('aboutPhoto', draft.aboutPhotoFile)

        try {
            await dispatch(updateContent(body)).unwrap()
            onNotify('Content updated')
        } catch (err) {
            onError(err)
        }
    }

    return (
        <main className="st-admin__view">
            <div className="st-admin__view-bar">
                <span>Site content</span>
                <button type="submit" form="content-form" className="st-admin__btn-primary">
                    Save changes
                </button>
            </div>

            <form id="content-form" onSubmit={handleSubmit} className="st-admin__content-form">
                <div className="st-admin__card">
                    <div className="st-admin__card-head">
                        <h3>Hero</h3>
                    </div>

                    <div className="st-admin__field">
                        <span>Hero image</span>
                        {draft.heroImage ? (
                            <div className="st-admin__image-preview">
                                <img src={draft.heroImage} alt="Hero preview" />
                                <div className="st-admin__image-actions">
                                    <label>
                                        Replace
                                        <input type="file" accept="image/*" onChange={pickImage('heroImage', 'heroImageFile')} />
                                    </label>
                                    <button type="button" onClick={() => clearImage('heroImage', 'heroImageFile')}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="st-admin__dropzone">
                                <span className="st-admin__dropzone-icon">↑</span>
                                <strong>Upload hero image</strong>
                                <span>PNG or JPG · leave blank to use the default</span>
                                <input type="file" accept="image/*" onChange={pickImage('heroImage', 'heroImageFile')} />
                            </label>
                        )}
                    </div>

                    <label className="st-admin__field">
                        <span>Status line</span>
                        <input
                            value={draft.hero.status}
                            onChange={(e) => patchSection('hero', { status: e.target.value })}
                            placeholder="Available for work · City, Country"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Headline</span>
                        <input
                            value={draft.hero.headline}
                            onChange={(e) => patchSection('hero', { headline: e.target.value })}
                            placeholder="Your name builds web products for the AI era."
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Headline highlight</span>
                        <input
                            value={draft.hero.highlight}
                            onChange={(e) => patchSection('hero', { highlight: e.target.value })}
                            placeholder="The exact phrase within the headline to emphasize, e.g. AI era"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Bio</span>
                        <textarea
                            value={draft.hero.bio}
                            onChange={(e) => patchSection('hero', { bio: e.target.value })}
                        ></textarea>
                    </label>

                    <div className="st-admin__field">
                        <span>Stats</span>
                        <div className="st-admin__repeat-list">
                            {draft.hero.stats.map((stat, index) => (
                                <div className="st-admin__repeat-row" key={index}>
                                    <input
                                        value={stat.value}
                                        onChange={(e) => patchListItem('hero', 'stats', index, { value: e.target.value })}
                                        placeholder="10+"
                                    />
                                    <input
                                        value={stat.label}
                                        onChange={(e) => patchListItem('hero', 'stats', index, { label: e.target.value })}
                                        placeholder="Core skills"
                                    />
                                    <button type="button" onClick={() => removeListItem('hero', 'stats', index)}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="st-admin__btn-ghost"
                            onClick={() => addListItem('hero', 'stats', { value: '', label: '' })}
                        >
                            ＋ Add stat
                        </button>
                    </div>
                </div>

                <div className="st-admin__card">
                    <div className="st-admin__card-head">
                        <h3>About</h3>
                    </div>

                    <div className="st-admin__field">
                        <span>Profile photo</span>
                        {draft.aboutPhoto ? (
                            <div className="st-admin__image-preview">
                                <img src={draft.aboutPhoto} alt="Profile preview" />
                                <div className="st-admin__image-actions">
                                    <label>
                                        Replace
                                        <input type="file" accept="image/*" onChange={pickImage('aboutPhoto', 'aboutPhotoFile')} />
                                    </label>
                                    <button type="button" onClick={() => clearImage('aboutPhoto', 'aboutPhotoFile')}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="st-admin__dropzone">
                                <span className="st-admin__dropzone-icon">↑</span>
                                <strong>Upload profile photo</strong>
                                <span>PNG or JPG · leave blank to use the default</span>
                                <input type="file" accept="image/*" onChange={pickImage('aboutPhoto', 'aboutPhotoFile')} />
                            </label>
                        )}
                    </div>

                    <label className="st-admin__field">
                        <span>Bio</span>
                        <textarea
                            value={draft.about.bio}
                            onChange={(e) => patchSection('about', { bio: e.target.value })}
                        ></textarea>
                    </label>

                    <div className="st-admin__field">
                        <span>Experience</span>
                        <div className="st-admin__repeat-list">
                            {draft.about.experience.map((exp, index) => (
                                <div className="st-admin__repeat-block" key={index}>
                                    <div className="st-admin__repeat-block-head">
                                        <strong>Entry {index + 1}</strong>
                                        <button type="button" onClick={() => removeListItem('about', 'experience', index)}>
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        value={exp.title}
                                        onChange={(e) => patchListItem('about', 'experience', index, { title: e.target.value })}
                                        placeholder="Title, e.g. React Developer"
                                    />
                                    <input
                                        value={exp.company}
                                        onChange={(e) => patchListItem('about', 'experience', index, { company: e.target.value })}
                                        placeholder="Company"
                                    />
                                    <input
                                        value={exp.period}
                                        onChange={(e) => patchListItem('about', 'experience', index, { period: e.target.value })}
                                        placeholder="Dec 2024 — Present"
                                    />
                                    <textarea
                                        value={exp.pointsText}
                                        onChange={(e) => patchListItem('about', 'experience', index, { pointsText: e.target.value })}
                                        placeholder="One point per line"
                                    ></textarea>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="st-admin__btn-ghost"
                            onClick={() => addListItem('about', 'experience', { title: '', company: '', period: '', pointsText: '' })}
                        >
                            ＋ Add experience
                        </button>
                    </div>

                    <div className="st-admin__field">
                        <span>Education</span>
                        <div className="st-admin__repeat-list">
                            {draft.about.education.map((item, index) => (
                                <div className="st-admin__repeat-row" key={index}>
                                    <input
                                        value={item.degree}
                                        onChange={(e) => patchListItem('about', 'education', index, { degree: e.target.value })}
                                        placeholder="Degree"
                                    />
                                    <input
                                        value={item.status}
                                        onChange={(e) => patchListItem('about', 'education', index, { status: e.target.value })}
                                        placeholder="completed / currently pursuing"
                                    />
                                    <button type="button" onClick={() => removeListItem('about', 'education', index)}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="st-admin__btn-ghost"
                            onClick={() => addListItem('about', 'education', { degree: '', status: '' })}
                        >
                            ＋ Add education
                        </button>
                    </div>
                </div>

                <div className="st-admin__card">
                    <div className="st-admin__card-head">
                        <h3>Contact</h3>
                    </div>

                    <label className="st-admin__field">
                        <span>Intro</span>
                        <textarea
                            value={draft.contact.intro}
                            onChange={(e) => patchSection('contact', { intro: e.target.value })}
                        ></textarea>
                    </label>

                    <label className="st-admin__field">
                        <span>Email</span>
                        <input
                            value={draft.contact.email}
                            onChange={(e) => patchSection('contact', { email: e.target.value })}
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Phone</span>
                        <input
                            value={draft.contact.phone}
                            onChange={(e) => patchSection('contact', { phone: e.target.value })}
                            placeholder="+880 …"
                        />
                    </label>

                    <label className="st-admin__field">
                        <span>Location</span>
                        <input
                            value={draft.contact.location}
                            onChange={(e) => patchSection('contact', { location: e.target.value })}
                            placeholder="City, Country"
                        />
                    </label>

                    <div className="st-admin__field">
                        <span>Social links</span>
                        <div className="st-admin__repeat-list">
                            {draft.contact.social.map((item, index) => (
                                <div className="st-admin__repeat-row st-admin__repeat-row--social" key={index}>
                                    <input
                                        value={item.label}
                                        onChange={(e) => patchListItem('contact', 'social', index, { label: e.target.value })}
                                        placeholder="LinkedIn"
                                    />
                                    <input
                                        value={item.href}
                                        onChange={(e) => patchListItem('contact', 'social', index, { href: e.target.value })}
                                        placeholder="https://…"
                                    />
                                    <input
                                        value={item.icon}
                                        onChange={(e) => patchListItem('contact', 'social', index, { icon: e.target.value })}
                                        placeholder="st-icon--linkedin"
                                    />
                                    <button type="button" onClick={() => removeListItem('contact', 'social', index)}>✕</button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="st-admin__btn-ghost"
                            onClick={() => addListItem('contact', 'social', { label: '', href: '', icon: '' })}
                        >
                            ＋ Add social link
                        </button>
                    </div>
                </div>

                <div className="st-admin__card">
                    <div className="st-admin__card-head">
                        <h3>Footer</h3>
                    </div>
                    <label className="st-admin__field">
                        <span>Footer line</span>
                        <input
                            value={draft.footer}
                            onChange={(e) => setDraft((prev) => ({ ...prev, footer: e.target.value }))}
                            placeholder="© 2026 Your name — built with …"
                        />
                    </label>
                </div>
            </form>
        </main>
    )
}
