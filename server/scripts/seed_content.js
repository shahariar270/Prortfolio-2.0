require('../config/env');
const { default: mongoose } = require('mongoose');
const User = require('../model/auth');
const Post = require('../model/post');
const Skill = require('../model/skill');
const Project = require('../model/project');
const Taxonomy = require('../model/taxonomy');

// Seeds the portfolio's current static content into MongoDB so the admin
// panel and the live site have real data to start from: npm run seed:content
// Idempotent per collection — only seeds a collection that is empty.

const POST_CATEGORIES = ['Career', 'Projects', 'React', 'Frontend', 'MERN'];
const SKILL_GROUPS = ['Frontend', 'Backend & Database', 'Tools & AI'];

const skillIcon = (id) => `https://skillicons.dev/icons?i=${id}`;
const brandIcon = (id) => `https://cdn.simpleicons.org/${id}`;

const SKILLS = [
    { group: 'Frontend', name: 'React', logo: skillIcon('react'), level: 92 },
    { group: 'Frontend', name: 'Next.js', logo: skillIcon('nextjs'), level: 84 },
    { group: 'Frontend', name: 'Tailwind', logo: skillIcon('tailwind'), level: 88 },
    { group: 'Backend & Database', name: 'Node.js', logo: skillIcon('nodejs'), level: 85 },
    { group: 'Backend & Database', name: 'MongoDB', logo: skillIcon('mongodb'), level: 80 },
    { group: 'Tools & AI', name: 'Claude', logo: brandIcon('claude'), level: 90 },
    { group: 'Tools & AI', name: 'Cursor AI', logo: brandIcon('cursor'), level: 86 },
];

const PROJECTS = [
    {
        label: 'VireoKit',
        category: 'design',
        type: 'Component Library',
        description:
            'A themeable React + SCSS component library published on npm — 17 components across primitives, overlays, data, and layout, all driven by CSS-variable design tokens with built-in light/dark theming.',
        technologies: ['React', 'SCSS', 'Design Tokens'],
        liveDemo: 'https://vireo-kit.vercel.app/',
        image: '/projects/vireo-kit.jpg',
    },
    {
        label: 'E-Commerce',
        category: 'development',
        type: 'MERN Platform',
        description:
            'A full-stack MERN e-commerce platform with a customer shopping flow and admin dashboard — product CRUD, cart, checkout, order lifecycle, JWT role-based auth, Cloudinary image uploads, and per-product SEO with JSON-LD structured data.',
        technologies: ['MERN', 'Redux Toolkit', 'MongoDB'],
        liveDemo: 'https://e-commerce-rho-three-41.vercel.app/',
        image: '/projects/ecom.jpg',
    },
    {
        label: 'Expense Tracker',
        category: 'development',
        type: 'MERN Desktop App',
        description:
            'A streamlined MERN expense tracker, packaged as an Electron desktop app, for monitoring financial health with precise balance calculations and graceful async state handling.',
        technologies: ['MERN', 'Electron', 'REST API'],
        liveDemo: 'https://expense-tracker-le1b.vercel.app/',
        image: '/projects/expense.jpg',
    },
    {
        label: 'WillTube',
        category: 'development',
        type: 'Media Tool',
        description:
            'A YouTube video downloader app that allows users to fetch and download videos in multiple formats with a clean and intuitive interface.',
        technologies: ['React', 'API', 'Node'],
        liveDemo: '',
        image: '/projects/willtube.png',
    },
];

const POSTS = [
    {
        title: 'Navigating Tech Layoffs and the AI Revolution',
        slug: 'navigating-tech-layoffs-and-the-ai-revolution',
        category: 'Career',
        excerpt: 'An analysis of why mass layoffs are happening and how developers can stay relevant by embracing AI rather than fearing it.',
        content: [
            "সাম্প্রতিক সময়ে টেক ইন্ডাস্ট্রিতে যে গণ-ছাঁটাই (mass layoffs) চলছে, সেটা আমাদের অনেককেই নিজের ক্যারিয়ার নিয়ে নতুন করে ভাবতে বাধ্য করছে। গত কয়েকদিন আমি এই বিষয়টা নিয়ে একটু পড়াশোনা করেছি, কিছুটা বোঝার চেষ্টা করেছি—আর সেখান থেকে কয়েকটা জিনিস পরিষ্কার হয়ে উঠেছে। প্রথমত, বর্তমানে প্রোডাক্ট-বেসড কোম্পানিগুলো কিছুটা কঠিন সময় পার করলেও, সার্ভিস-বেসড কোম্পানিগুলোর চিত্র ভিন্ন। তবে এখানেও একটা বড় পরিবর্তন লক্ষ্য করা যাচ্ছে। আগে যে প্রজেক্টটি শেষ করতে ১০ জন ডেভেলপারের প্রয়োজন হতো, এখন AI + ২-৩ জন দক্ষ ডেভেলপার দিয়েই সেই কাজ সম্পন্ন করা সম্ভব হচ্ছে। ফলে কোম্পানিগুলো তাদের অপারেশনাল খরচ কমাতে 'অতিরিক্ত' জনবল ছাঁটাই করছে। দ্বিতীয়ত,বিগত বছর গুলাতে ডেভেলপারের সংখ্যা বাড়লেও, মানসম্মত ডেভেলপারের অভাব রয়েই গেছে। অনেকেই সময়ের সাথে নিজেকে আপডেট না করে শুধু 'Copy-Paste' নির্ভর কোডিংয়ে অভ্যস্ত হয়ে পড়েছিলেন। কিন্তু বর্তমান যুগে সাধারণ কোড লেখার কাজটুকু AI অনায়াসেই করে দিচ্ছে। যারা নিজেদের AI-এর সাথে মানিয়ে নিতে পারেননি বা লজিক্যাল ইমপ্লিমেন্টেশনে দক্ষ নন, তারাই এখন সবচেয়ে বেশি ঝুঁকির মুখে পড়ছেন। সবকিছু মিলিয়ে আমার কাছে যেটা সবচেয়ে গুরুত্বপূর্ণ মনে হয়েছে— AI আমাদের জায়গা নেবে কি না, সেটা বড় প্রশ্ন না। বরং প্রশ্নটা হওয়া উচিত—আমি কি AI-কে ব্যবহার করে নিজের কাজকে আরও ভালো, দ্রুত আর স্মার্ট করতে পারছি?"
        ],
        image: '/leyoff.png',
        read_time: '6 min read',
        views: 0,
        published: true,
        createdAt: new Date('2026-01-12'),
    },
    {
        title: 'Building a Minimalist Expense Tracker with MERN Stack',
        slug: 'building-a-minimalist-expense-tracker-with-mern-stack',
        category: 'Projects',
        excerpt: 'How I applied MongoDB, Express, React, and Node.js to solve personal finance tracking with a user-friendly experience.',
        content: [
            "ব্যক্তিগত আর্থিক হিসাব রাখা অনেকের কাছেই বেশ জটিল মনে হয়। এই জটিলতাকে সহজ করতে এবং একটি Minimalist & User-friendly অভিজ্ঞতার লক্ষ্যে আমি তৈরি করেছি Expense Tracker। এটি মূলত আমার MERN Stack (MongoDB, Express.js, React, Node.js) নলেজকে বাস্তব প্রয়োগে রূপান্তর করার একটি প্রচেষ্টা।"
        ],
        image: '/expense.png',
        read_time: '5 min read',
        views: 0,
        published: true,
        createdAt: new Date('2026-01-20'),
    },
    {
        title: 'Understanding React Reconciliation: The Performance Boss',
        slug: 'understanding-react-reconciliation-the-performance-boss',
        category: 'React',
        excerpt: 'A deep dive into the Virtual DOM and how React intelligently updates the UI using the Diffing Algorithm.',
        content: [
            "Reconciliation Algorithm — React এর আসল ম্যাজিক। যখন আপনি React এ কোনো state বা props আপডেট করো, React আসলে পুরো DOM আপডেট করে না! বরং এটি করে — নিচের প্রক্রিয়া ফলো করে। ১. React প্রথমে মেমোরিতে একটা Virtual DOM রাখে। যা real DOM এর একটা হালকা কপি। ২. এরপর যখন state বা props পরিবর্তন হয়, React নতুন একটা Virtual DOM Tree তৈরি করে। ৩. তারপর পুরোনো ও নতুন Virtual DOM এর মধ্যে diff করে দেখে কোন অংশে পরিবর্তন এসেছে। ৪. যেই অংশে পরিবর্তন পাওয়া যায়, শুধু সেই specific অংশটাই Real DOM এ আপডেট করে। এভাবেই React অপ্রয়োজনীয় DOM পরিবর্তন এড়ায় এবং পারফর্মেন্স বাড়ায় বহুগুনে।"
        ],
        image: '/react.png',
        read_time: '7 min read',
        views: 0,
        published: true,
        createdAt: new Date('2026-02-02'),
    },
];

const seed = async () => {
    const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/portfolio';
    await mongoose.connect(db_url);

    const admin = await User.findOne({ user_role: 'admin' });
    if (!admin) {
        console.error('No admin account found — run npm run seed:admin first');
        process.exit(1);
    }
    const user_id = String(admin._id);

    if (await Taxonomy.countDocuments() === 0) {
        await Taxonomy.insertMany([
            ...POST_CATEGORIES.map((label) => ({ label, kind: 'post_category', user_id })),
            ...SKILL_GROUPS.map((label) => ({ label, kind: 'skill_group', user_id })),
        ]);
        console.log(`Seeded ${POST_CATEGORIES.length + SKILL_GROUPS.length} taxonomies`);
    } else {
        console.log('Taxonomies already present — skipped');
    }

    if (await Skill.countDocuments() === 0) {
        await Skill.insertMany(SKILLS.map((skill) => ({ ...skill, user_id })));
        console.log(`Seeded ${SKILLS.length} skills`);
    } else {
        console.log('Skills already present — skipped');
    }

    if (await Post.countDocuments() === 0) {
        await Post.insertMany(POSTS.map((post) => ({ ...post, user_id })));
        console.log(`Seeded ${POSTS.length} posts`);
    } else {
        console.log('Posts already present — skipped');
    }

    if (await Project.countDocuments() === 0) {
        await Project.insertMany(PROJECTS.map((project) => ({ ...project, user_id })));
        console.log(`Seeded ${PROJECTS.length} projects`);
    } else {
        console.log('Projects already present — skipped');
    }

    await mongoose.disconnect();
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
