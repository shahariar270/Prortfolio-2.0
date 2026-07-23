import profileImg from '../../assets/images/profile.jpg'

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

const skillIcon = (id) => `https://skillicons.dev/icons?i=${id}`

export const skillLogoFor = (name) =>
    skillIcon(name.toLowerCase().replace(/[^a-z0-9]/g, ''))

