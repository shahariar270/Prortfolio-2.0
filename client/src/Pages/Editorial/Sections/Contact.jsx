import React from 'react'
import { Field, Form, Formik } from 'formik'
import { API_URL } from '../../../config/api'
import { socialLinks } from '../helper'

export const Contact = () => {
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
                    <p>
                        Have a product to ship — or a codebase that needs AI-era velocity? Send a message; I
                        reply within 24 hours.
                    </p>
                    <div className="st-editorial__contact-lines">
                        <a href="mailto:dev.shahariar.official@gmail.com">dev.shahariar.official@gmail.com</a>
                        <span>+880 1410-270766 · Jhenaidah, Bangladesh</span>
                    </div>
                    <div className="st-editorial__contact-social">
                        {socialLinks.map((item) => (
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
            <p className="st-editorial__footer">
                © 2026 Shahariar — built with React, MERN &amp; AI copilots.
            </p>
        </section>
    )
}
