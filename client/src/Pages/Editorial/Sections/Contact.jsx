import React, { useEffect } from 'react'
import { Field, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from '../../../config/api'
import { fetchContactContent } from '../../../store/slices/contentSlice'

export const Contact = () => {
    const dispatch = useDispatch()
    const contact = useSelector((state) => state.content.contact)
    const footer = useSelector((state) => state.content.footer)

    useEffect(() => {
        dispatch(fetchContactContent())
    }, [dispatch])

    const social = contact?.social || []

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            const data = await response.json()

            if (data.success) {
                alert('Message sent successfully!')
            } else {
                alert('Failed to send message.')
            }
        } catch (error) {
            console.error(error)
            alert('Error sending message.')
        } finally {
            resetForm()
        }
    }

    return (
        <section id="sec-contact" className="st-editorial__section st-editorial__contact">
            <h2 className="st-editorial__heading">Let's talk</h2>
            <div className="st-editorial__contact-grid">
                <div className="st-editorial__contact-info">
                    {contact?.intro && <p>{contact.intro}</p>}
                    <div className="st-editorial__contact-lines">
                        {contact?.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                        {(contact?.phone || contact?.location) && (
                            <span>
                                {contact.phone}
                                {contact.phone && contact.location ? ' · ' : ''}
                                {contact.location}
                            </span>
                        )}
                    </div>
                    <div className="st-editorial__contact-social">
                        {social.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={item.label}
                            >
                                <i className={item.icon}></i> {item.label}
                            </a>
                        ))}
                    </div>
                </div>
                <Formik initialValues={{ name: '', email: '', content: '' }} onSubmit={handleSubmit}>
                    <Form className="st-editorial__contact-form">
                        <Field as="input" name="name" placeholder="Your name" required />
                        <Field as="input" type="email" name="email" placeholder="Your email" required />
                        <Field as="textarea" name="content" placeholder="Tell me about your project…" required />
                        <button type="submit">Send Message</button>
                    </Form>
                </Formik>
            </div>
            {footer && <p className="st-editorial__footer">{footer}</p>}
        </section>
    )
}
