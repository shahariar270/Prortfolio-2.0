import React from 'react'

const paths = {
    analytics: (
        <>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <rect x="7" y="11" width="3" height="5" rx="0.6" />
            <rect x="12" y="8" width="3" height="8" rx="0.6" />
            <rect x="17" y="13" width="3" height="3" rx="0.6" />
        </>
    ),
    posts: (
        <>
            <path d="M6 3.5h9l3.5 3.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
            <path d="M9 12h6M9 15.5h6M9 8.5h3" />
        </>
    ),
    skills: (
        <>
            <rect x="4" y="4" width="7" height="7" rx="1.4" />
            <rect x="13" y="4" width="7" height="7" rx="1.4" />
            <rect x="4" y="13" width="7" height="7" rx="1.4" />
            <rect x="13" y="13" width="7" height="7" rx="1.4" />
        </>
    ),
    taxonomy: (
        <>
            <path d="M4 6.5h9M4 12h13M4 17.5h7" />
            <circle cx="18" cy="6.5" r="2" />
            <circle cx="13" cy="17.5" r="2" />
        </>
    ),
    visitors: (
        <>
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" />
        </>
    ),
    views: (
        <>
            <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
            <circle cx="12" cy="12" r="2.6" />
        </>
    ),
    time: (
        <>
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 7.5V12l3 2" />
        </>
    ),
    contacts: (
        <>
            <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
            <path d="m4 6.5 8 6.2 8-6.2" />
        </>
    ),
}

export const AdminIcon = ({ name }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {paths[name]}
    </svg>
)
