import thumbCode from '../../assets/images/home.jpg'
import thumbUi from '../../assets/images/profile.jpg'
import vireoKit from '../../assets/images/Project/vireo-kit.jpg'
import ecom from '../../assets/images/Project/ecom.jpg'
import expenseTracker from '../../assets/images/Project/expense.jpg'
import WillTube from '../../assets/images/Project/willtube.png'

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
        image: vireoKit,
    },
    {
        label: 'E-Commerce',
        category: 'development',
        type: 'MERN Platform',
        description: 'A full-stack MERN e-commerce platform with a customer shopping flow and admin dashboard — product CRUD, cart, checkout, order lifecycle, JWT role-based auth, Cloudinary image uploads, and per-product SEO with JSON-LD structured data.',
        technologies: ['MERN', 'Redux Toolkit', 'MongoDB'],
        liveDemo: 'https://e-commerce-rho-three-41.vercel.app/',
        link: 'https://github.com/shahariar270/E-Commerce',
        image: ecom,
    },
    {
        label: 'Expense Tracker',
        category: 'development',
        type: 'MERN Desktop App',
        description: 'A streamlined MERN expense tracker, packaged as an Electron desktop app, for monitoring financial health by tracking earnings and expenses with precise balance calculations and graceful async state handling to keep the UI snappy while syncing data.',
        technologies: ['MERN', 'Electron', 'REST API'],
        liveDemo: 'https://expense-tracker-le1b.vercel.app/',
        link: 'https://github.com/shahariar270/expense-tracker',
        image: expenseTracker,
    },
    {
        label: 'WillTube',
        category: 'development',
        type: 'Media Tool',
        description: 'A YouTube video downloader app that allows users to fetch and download videos in multiple formats with a clean and intuitive interface.',
        technologies: ['React', 'API', 'Node'],
        liveDemo: '',
        link: '',
        image: WillTube,
    },
    // {
    //     label: 'Todo',
    //     category: 'development',
    //     type: 'Productivity App',
    //     description: 'A simple and efficient todo application with task creation, editing, filtering, and persistent local storage support.',
    //     technologies: ['React', 'Local Storage', 'UX'],
    //     liveDemo: '',
    //     link: '',
    //     image: thumbCode,
    // },
];
