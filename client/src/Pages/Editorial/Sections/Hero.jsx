import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHeroContent } from '../../../store/slices/contentSlice'
import Skeleton from '@Component/Skeleton'
import defaultHeroImg from '../../../assets/images/home.jpg'

// cycles through `roles` one at a time, admin-editable via the Content form
const RotatingRoles = ({ roles }) => {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (roles.length < 2) return
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % roles.length)
        }, 1000)
        return () => clearInterval(timer)
    }, [roles])

    if (roles.length === 0) return null

    return (
        <p className="st-editorial__hero-roles">
            <span key={index} className="st-editorial__hero-role">
                {roles[index]}
            </span>
        </p>
    )
}

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
    const hero = useSelector((state) => state.content.hero)
    const loaded = useSelector((state) => state.content.heroLoaded)
    const status = useSelector((state) => state.content.heroStatus)

    useEffect(() => {
        dispatch(fetchHeroContent())
    }, [dispatch])

    const stats = hero?.stats || []
    const roles = hero?.roles || []

    if (!loaded && status !== 'failed') {
        return (
            <section id="sec-home" className="st-editorial__hero">
                <div className="st-editorial__hero-top">
                    <div className="st-editorial__hero-intro st-editorial__skeleton-group">
                        <Skeleton width="55%" height="1em" />
                        <Skeleton width="90%" height="2.4em" />
                        <Skeleton width="70%" height="2.4em" />
                        <Skeleton width="40%" height="1.2em" />
                        <Skeleton width="80%" height="1em" />
                    </div>
                    <div className="st-editorial__hero-media">
                        <Skeleton className="st-editorial__skeleton-card" width="100%" height="100%" />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="sec-home" className="st-editorial__hero">
            <div className="st-editorial__hero-top">
                <div className="st-editorial__hero-intro">
                    {status === 'failed' && !hero && (
                        <p className="st-editorial__hero-status">Couldn't load — please refresh.</p>
                    )}
                    {hero?.status && <p className="st-editorial__hero-status">{hero.status}</p>}
                    {hero?.headline && <h1>{renderHeadline(hero.headline, hero.highlight)}</h1>}
                    <RotatingRoles roles={roles} />
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
