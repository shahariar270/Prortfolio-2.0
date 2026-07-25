import React from 'react'

// Shown in place of <img> wherever a post/project has no image set — keeps
// the layout's image slot intact (same size/rounding as a real photo) instead
// of rendering a broken empty-src <img> or collapsing the grid alignment.
const ImageFallback = ({ className = '' }) => (
    <div className={`st-editorial__img-fallback ${className}`.trim()} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
        </svg>
    </div>
)

export default ImageFallback
