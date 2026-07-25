import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContent } from '../../../store/slices/contentSlice'
import defaultHeroImg from '../../../assets/images/home.jpg'

// wraps the `highlight` substring of `headline` in <em>, preserving it as a
// single non-wrapping phrase like the original hardcoded markup did
const renderHeadline = (headline, highlight) => {
    if (!headline) return null
    if (!highlight || !headline.includes(highlight)) return headline

    const idx = headline.indexOf(highlight)
    const before = headline.slice(0, idx)
    const after = headline.slice(idx + highlight.length)
    return (
        <>
            {before}
            <em>{highlight.replace(/ /g, ' ')}</em>
            {after}
        </>
    )
}

export const Hero = ({ onSeeWork }) => {
    const dispatch = useDispatch()
    const content = useSelector((state) => state.content.data)

    useEffect(() => {
        dispatch(fetchContent())
    }, [dispatch])

    const hero = content?.hero
    const stats = hero?.stats || []

    return (
        <section id="sec-home" className="st-editorial__hero">
            <div className="st-editorial__hero-top">
                <div className="st-editorial__hero-intro">
                    {hero?.status && <p className="st-editorial__hero-status">{hero.status}</p>}
                    {hero?.headline && <h1>{renderHeadline(hero.headline, hero.highlight)}</h1>}
                    <div className="st-editorial__hero-row">
                        {hero?.bio && <p>{hero.bio}</p>}
                        <div className="st-editorial__hero-actions">
                            <button type="button" className="st-editorial__btn st-editorial__btn--primary" onClick={onSeeWork}>
                                See the work ↓
                            </button>
                            <a
                                href="/resume.pdf"
                                download="Shahariar-Resume.pdf"
                                className="st-editorial__btn st-editorial__btn--ghost"
                            >
                                ↓ Resume
                            </a>
                        </div>
                    </div>
                </div>
                <div className="st-editorial__hero-media">
                    <img src={hero?.image || defaultHeroImg} alt="Shahariar" loading="eager" />
                </div>
            </div>
            {stats.length > 0 && (
                <div className="st-editorial__hero-stats">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
