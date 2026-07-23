import React from 'react'

const paths = {
    home: (
        <>
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9" />
        </>
    ),
    about: (
        <>
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" />
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
    work: (
        <>
            <rect x="3.5" y="7.5" width="17" height="12" rx="1.6" />
            <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
            <path d="M3.5 12.5h17" />
        </>
    ),
    notes: (
        <>
            <path d="M6 3.5h9l3.5 3.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
            <path d="M9 12h6M9 15.5h6M9 8.5h3" />
        </>
    ),
    contact: (
        <>
            <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
            <path d="m4 6.5 8 6.2 8-6.2" />
        </>
    ),
}

export const RailIcon = ({ name }) => (
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
