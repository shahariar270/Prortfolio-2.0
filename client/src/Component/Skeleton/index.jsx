import React from 'react'

// Generic shimmer placeholder — pass width/height (any CSS length) and an
// optional variant ('text' | 'block' | 'circle') for the shape.
const Skeleton = ({ width, height, variant = 'block', className = '' }) => (
    <span
        className={`st-skeleton st-skeleton--${variant} ${className}`}
        style={{ width, height }}
    />
)

export default Skeleton
