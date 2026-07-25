import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchContent } from '../../../store/slices/contentSlice'
import defaultProfileImg from '../../../assets/images/profile.jpg'

export const About = () => {
    const dispatch = useDispatch()
    const content = useSelector((state) => state.content.data)

    useEffect(() => {
        dispatch(fetchContent())
    }, [dispatch])

    const about = content?.about
    const experience = about?.experience || []
    const education = about?.education || []

    return (
        <section id="sec-about" className="st-editorial__section st-editorial__about">
            <h2 className="st-editorial__heading">About</h2>
            <div className="st-editorial__about-grid">
                <img className="st-editorial__about-photo" src={about?.photo || defaultProfileImg} alt="Shahariar" />
                <div className="st-editorial__about-body">
                    {about?.bio && <p className="st-editorial__about-lede">{about.bio}</p>}
                    <div className="st-editorial__about-list">
                        {experience.map((exp) => (
                            <article className="st-editorial__about-row" key={exp.title}>
                                <span className="st-editorial__about-period">{exp.period}</span>
                                <div>
                                    <h3>
                                        {exp.title} <span>— {exp.company}</span>
                                    </h3>
                                    <ul>
                                        {(exp.points || []).map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                        {education.length > 0 && (
                            <article className="st-editorial__about-row">
                                <span className="st-editorial__about-period">Education</span>
                                <div className="st-editorial__about-education">
                                    {education.map((item) => (
                                        <p key={item.degree}>
                                            {item.degree} <span>— {item.status}</span>
                                        </p>
                                    ))}
                                </div>
                            </article>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
