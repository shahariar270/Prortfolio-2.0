export const sections = [
    { label: 'Home', id: 'sec-home', icon: 'home' },
    { label: 'About', id: 'sec-about', icon: 'about' },
    { label: 'Skills', id: 'sec-skill', icon: 'skills' },
    { label: 'Work', id: 'sec-project', icon: 'work' },
    { label: 'Notes', id: 'sec-blog', icon: 'notes' },
    { label: 'Contact', id: 'sec-contact', icon: 'contact' },
]

export const heroStats = [
    { value: '10+', label: 'Core skills' },
    { value: '4', label: 'Shipped projects' },
    { value: '4', label: 'AI copilots' },
    { value: '24h', label: 'Response' },
]

export const experienceItems = [
    {
        title: 'React Developer',
        company: 'Kodezen',
        period: 'Dec 2024 — Present',
        points: [
            'Led development on a CRM plugin, coordinating implementation decisions and keeping the team focused on practical, maintainable delivery.',
            'Architected React-driven interfaces and optimized frontend workflows for cleaner state and better long-term scalability.',
            'Managed task breakdowns, reviewed code quality, and supported developers through technical blockers.',
        ],
    },
    {
        title: 'MERN Expense Tracker',
        company: 'Full-Stack Project',
        period: 'Project',
        points: [
            'Built a MERN application for tracking expenses with structured data handling, reusable UI components, and practical dashboard flows.',
        ],
    },
    {
        title: 'E-commerce system',
        company: 'Full-Stack Project',
        period: 'Project',
        points: [
            'Developed a full-featured MERN e-commerce platform with secure JWT auth, cart, order processing, and an admin dashboard.',
        ],
    },
    {
        title: 'YouTube Video Downloader',
        company: 'Utility Project',
        period: 'Project',
        points: [
            'Developed a focused download utility with attention to usability, real-time API handling, and efficient frontend feedback states.',
        ],
    },
]

export const educationItems = [
    {
        degree: 'B.Sc. in Computer Science & Engineering',
        status: 'currently pursuing',
    },
    {
        degree: 'Diploma in Computer Engineering',
        status: 'completed',
    },
]

export const projectTabs = [
    { label: 'All', value: 'all' },
    { label: 'Web Design', value: 'design' },
    { label: 'Web Development', value: 'development' },
]

export const socialLinks = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/shahariar270/',
        icon: 'st-icon--linkedin',
    },
    {
        label: 'GitHub',
        href: 'https://github.com/shahariar270',
        icon: 'st-icon--github',
    },
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/shahariar270/',
        icon: 'st-icon--facebook',
    },
]

export const sectionSeo = {
    'sec-home': {
        title: null,
        description:
            'Portfolio of Shahariar — React and MERN developer building dynamic web applications, responsive interfaces, and interactive experiences.',
    },
    'sec-about': {
        title: 'About',
        description:
            'Full-stack developer specializing in MERN stack, WordPress, clean code, leadership, and solution-oriented web development.',
    },
    'sec-skill': {
        title: 'Skills',
        description:
            'Skills and AI stack — React, MERN, WordPress, and AI copilots like Claude, Cursor, and Codex.',
    },
    'sec-project': {
        title: 'Projects',
        description:
            'Shipped projects — component libraries, MERN platforms, desktop apps, and media tools.',
    },
    'sec-blog': {
        title: 'Blog',
        description:
            'Notes on React, MERN development, and building in the AI era.',
    },
    'sec-contact': {
        title: 'Contact',
        description:
            'Get in touch for freelance, remote, or collaboration opportunities. Based in Jhenaidah, Bangladesh.',
    },
}
