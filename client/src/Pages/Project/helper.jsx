import thumbCode from '../../assets/images/home.jpg'
import thumbUi from '../../assets/images/profile.jpg'

export const menuArray = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Web Design',
        value: 'design'
    },
    {
        label: 'Web Development',
        value: 'development'
    }
]

export const projectArray = [
    {
        label: 'VireoKit',
        category: 'design',
        type: 'Component Library',
        description: 'A themeable React + SCSS component library published on npm — 17 components across primitives, overlays, data, and layout, all driven by CSS-variable design tokens with built-in light/dark theming.',
        technologies: ['React', 'SCSS', 'Design Tokens'],
        liveDemo: 'https://vireo-kit.vercel.app/',
        link: 'https://github.com/shahariar270/VireoKit',
        image: thumbUi,
    },
    {
        label: 'E-Commerce',
        category: 'development',
        type: 'MERN Platform',
        description: 'A full-stack MERN e-commerce platform with a customer shopping flow and admin dashboard — product CRUD, cart, checkout, order lifecycle, JWT role-based auth, Cloudinary image uploads, and per-product SEO with JSON-LD structured data.',
        technologies: ['MERN', 'Redux Toolkit', 'MongoDB'],
        liveDemo: 'https://e-commerce-rho-three-41.vercel.app/',
        link: 'https://github.com/shahariar270/E-Commerce',
        image: thumbCode,
    },
    {
        label: 'WillTube',
        category: 'development',
        type: 'Media Tool',
        description: 'A YouTube video downloader app that allows users to fetch and download videos in multiple formats with a clean and intuitive interface.',
        technologies: ['React', 'API', 'Node'],
        liveDemo: '',
        link: '',
        image: thumbUi,
    },
    {
        label: 'Todo',
        category: 'development',
        type: 'Productivity App',
        description: 'A simple and efficient todo application with task creation, editing, filtering, and persistent local storage support.',
        technologies: ['React', 'Local Storage', 'UX'],
        liveDemo: '',
        link: '',
        image: thumbCode,
    },
];
