import DOMPurify from 'dompurify'

// Admin-authored rich text (post content, project descriptions) is rendered
// with dangerouslySetInnerHTML — sanitize it so a compromised admin session
// can't plant stored XSS that runs in every visitor's browser.
export const sanitizeHtml = (html) =>
    DOMPurify.sanitize(html || '', {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'h2', 'h3'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
    })
