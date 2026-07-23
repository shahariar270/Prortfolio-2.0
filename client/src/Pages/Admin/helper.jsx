import profileImg from '../../assets/images/profile.jpg'

// Analytics KPIs/chart/sources/pages below are still mock data — the Site
// Analytics view isn't wired to /api/analytics/summary yet.

export const navItems = [
    { key: 'analytics', label: 'Site Analytics', icon: 'analytics' },
    { key: 'posts', label: 'Posts', icon: 'posts' },
    { key: 'skills', label: 'Skills', icon: 'skills' },
    { key: 'taxonomy', label: 'Taxonomy', icon: 'taxonomy' },
]

export const pageTitles = {
    analytics: ['Site Analytics', 'Overview of your portfolio traffic & engagement'],
    posts: ['Posts', 'Create, edit, and publish your blog notes'],
    skills: ['Skills', 'Update your skills and proficiency levels'],
    taxonomy: ['Taxonomy', 'Manage post categories and skill groups'],
}

export const adminProfile = {
    name: 'Shahariar',
    role: 'Admin panel',
    avatar: profileImg,
}

export const ranges = [
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
    { label: '90d', value: '90d' },
]

export const kpiData = {
    '7d': [
        { label: 'Visitors', value: '1,284', trend: '▲ 12.4%', pos: true, icon: 'visitors' },
        { label: 'Page views', value: '3,912', trend: '▲ 8.1%', pos: true, icon: 'views' },
        { label: 'Avg. session', value: '2m 41s', trend: '▲ 5.0%', pos: true, icon: 'time' },
        { label: 'Contacts', value: '17', trend: '▼ 3.2%', pos: false, icon: 'contacts' },
    ],
    '30d': [
        { label: 'Visitors', value: '5,730', trend: '▲ 18.9%', pos: true, icon: 'visitors' },
        { label: 'Page views', value: '16,204', trend: '▲ 14.2%', pos: true, icon: 'views' },
        { label: 'Avg. session', value: '2m 58s', trend: '▲ 6.6%', pos: true, icon: 'time' },
        { label: 'Contacts', value: '74', trend: '▲ 9.5%', pos: true, icon: 'contacts' },
    ],
    '90d': [
        { label: 'Visitors', value: '18,442', trend: '▲ 24.3%', pos: true, icon: 'visitors' },
        { label: 'Page views', value: '51,880', trend: '▲ 21.0%', pos: true, icon: 'views' },
        { label: 'Avg. session', value: '3m 06s', trend: '▲ 4.1%', pos: true, icon: 'time' },
        { label: 'Contacts', value: '206', trend: '▲ 12.8%', pos: true, icon: 'contacts' },
    ],
}

export const chartData = {
    '7d': [['Mon', 120], ['Tue', 168], ['Wed', 142], ['Thu', 205], ['Fri', 232], ['Sat', 176], ['Sun', 241]],
    '30d': [['W1', 980], ['W2', 1240], ['W3', 1160], ['W4', 1480], ['W5', 870]],
    '90d': [['May', 4200], ['Jun', 5730], ['Jul', 6120], ['Aug', 2392]],
}

export const trafficSources = [
    { label: 'Direct', pct: 38 },
    { label: 'LinkedIn', pct: 27 },
    { label: 'Google', pct: 21 },
    { label: 'GitHub', pct: 14 },
]

export const topPages = [
    { page: 'Home', views: '4,120', time: '1m 52s', bounce: '32%', good: true },
    { page: 'Projects', views: '2,880', time: '3m 14s', bounce: '24%', good: true },
    { page: 'Project · E-Commerce', views: '1,640', time: '3m 41s', bounce: '19%', good: true },
    { page: 'Notes · AI Layoffs', views: '1,205', time: '4m 05s', bounce: '48%', good: false },
    { page: 'Contact', views: '910', time: '1m 12s', bounce: '55%', good: false },
]

const skillIcon = (id) => `https://skillicons.dev/icons?i=${id}`

export const skillLogoFor = (name) =>
    skillIcon(name.toLowerCase().replace(/[^a-z0-9]/g, ''))

