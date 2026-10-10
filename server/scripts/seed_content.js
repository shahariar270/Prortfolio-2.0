require('../config/env');
const { default: mongoose } = require('mongoose');
const User = require('../model/auth');
const Post = require('../model/post');
const Skill = require('../model/skill');
const Project = require('../model/project');
const Taxonomy = require('../model/taxonomy');
const SiteContent = require('../model/content');

// Seeds the portfolio's current static content into MongoDB so the admin
// panel and the live site have real data to start from: npm run seed:content
// Idempotent per collection — only seeds a collection that is empty.

const POST_CATEGORIES = ['Career', 'Projects', 'React', 'Frontend', 'MERN'];
const SKILL_GROUPS = ['Frontend', 'Backend & Database', 'Tools & AI'];
const PROJECT_CATEGORIES = ['Web Design', 'Web Development'];

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
        slug: 'vireokit',
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
        slug: 'e-commerce',
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
        slug: 'expense-tracker',
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
        slug: 'willtube',
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
        content:
            "<p>সাম্প্রতিক সময়ে টেক ইন্ডাস্ট্রিতে যে গণ-ছাঁটাই (mass layoffs) চলছে, সেটা আমাদের অনেককেই নিজের ক্যারিয়ার নিয়ে নতুন করে ভাবতে বাধ্য করছে। গত কয়েকদিন আমি এই বিষয়টা নিয়ে একটু পড়াশোনা করেছি, কিছুটা বোঝার চেষ্টা করেছি—আর সেখান থেকে কয়েকটা জিনিস পরিষ্কার হয়ে উঠেছে। প্রথমত, বর্তমানে প্রোডাক্ট-বেসড কোম্পানিগুলো কিছুটা কঠিন সময় পার করলেও, সার্ভিস-বেসড কোম্পানিগুলোর চিত্র ভিন্ন। তবে এখানেও একটা বড় পরিবর্তন লক্ষ্য করা যাচ্ছে। আগে যে প্রজেক্টটি শেষ করতে ১০ জন ডেভেলপারের প্রয়োজন হতো, এখন AI + ২-৩ জন দক্ষ ডেভেলপার দিয়েই সেই কাজ সম্পন্ন করা সম্ভব হচ্ছে। ফলে কোম্পানিগুলো তাদের অপারেশনাল খরচ কমাতে 'অতিরিক্ত' জনবল ছাঁটাই করছে। দ্বিতীয়ত,বিগত বছর গুলাতে ডেভেলপারের সংখ্যা বাড়লেও, মানসম্মত ডেভেলপারের অভাব রয়েই গেছে। অনেকেই সময়ের সাথে নিজেকে আপডেট না করে শুধু 'Copy-Paste' নির্ভর কোডিংয়ে অভ্যস্ত হয়ে পড়েছিলেন। কিন্তু বর্তমান যুগে সাধারণ কোড লেখার কাজটুকু AI অনায়াসেই করে দিচ্ছে। যারা নিজেদের AI-এর সাথে মানিয়ে নিতে পারেননি বা লজিক্যাল ইমপ্লিমেন্টেশনে দক্ষ নন, তারাই এখন সবচেয়ে বেশি ঝুঁকির মুখে পড়ছেন। সবকিছু মিলিয়ে আমার কাছে যেটা সবচেয়ে গুরুত্বপূর্ণ মনে হয়েছে— AI আমাদের জায়গা নেবে কি না, সেটা বড় প্রশ্ন না। বরং প্রশ্নটা হওয়া উচিত—আমি কি AI-কে ব্যবহার করে নিজের কাজকে আরও ভালো, দ্রুত আর স্মার্ট করতে পারছি?</p>",
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
        content:
            "<p>ব্যক্তিগত আর্থিক হিসাব রাখা অনেকের কাছেই বেশ জটিল মনে হয়। এই জটিলতাকে সহজ করতে এবং একটি Minimalist & User-friendly অভিজ্ঞতার লক্ষ্যে আমি তৈরি করেছি Expense Tracker। এটি মূলত আমার MERN Stack (MongoDB, Express.js, React, Node.js) নলেজকে বাস্তব প্রয়োগে রূপান্তর করার একটি প্রচেষ্টা।</p>",
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
        content:
            "<p>Reconciliation Algorithm — React এর আসল ম্যাজিক। যখন আপনি React এ কোনো state বা props আপডেট করো, React আসলে পুরো DOM আপডেট করে না! বরং এটি করে — নিচের প্রক্রিয়া ফলো করে। ১. React প্রথমে মেমোরিতে একটা Virtual DOM রাখে। যা real DOM এর একটা হালকা কপি। ২. এরপর যখন state বা props পরিবর্তন হয়, React নতুন একটা Virtual DOM Tree তৈরি করে। ৩. তারপর পুরোনো ও নতুন Virtual DOM এর মধ্যে diff করে দেখে কোন অংশে পরিবর্তন এসেছে। ৪. যেই অংশে পরিবর্তন পাওয়া যায়, শুধু সেই specific অংশটাই Real DOM এ আপডেট করে। এভাবেই React অপ্রয়োজনীয় DOM পরিবর্তন এড়ায় এবং পারফর্মেন্স বাড়ায় বহুগুনে।</p>",
        image: '/react.png',
        read_time: '7 min read',
        views: 0,
        published: true,
        createdAt: new Date('2026-02-02'),
    },
];

const SITE_CONTENT = {
    hero: {
        status: 'Available for work · Jhenaidah, Bangladesh',
        headline: 'I build web applications with a focus on Engineering Fundamentals.',
        highlight: 'Engineering Fundamentals.',
        bio: 'WordPress developer transitioning into full stack software development. I build modern web applications using React, Node.js, Express, and MongoDB. My focus is on creating fast, scalable, and user-friendly web applications using clean architecture and software engineering principles.',
        roles: ['Founder @ Novakrift', 'Creator of Hisabox', 'MERN Stack Engineer', 'AI-Driven Developer'],
        stats: [
            { value: '10+', label: 'Core skills' },
            { value: '4', label: 'Shipped projects' },
            { value: '4', label: 'AI copilots' },
            { value: '24h', label: 'Response' },
        ],
    },
    about: {
        bio: "I'm a software developer whose professional journey began in 2018 with digital work, office productivity tools, content writing, and marketing. Around 2021–2022, I transitioned into software development and began expanding my skills across different programming languages, frameworks, and platforms. I worked as a web application developer specializing in WordPress customization and plugin development, and modern JavaScript-based technologies. I work with technologies including PHP, Laravel, C#, JavaScript, TypeScript, React, Next.js, and Node.js, depending on the project and its requirements. I'm interested in building practical web solutions, extending existing platforms through custom development, and creating digital products that solve real problems. I also continue to explore platforms like Shopify and AI-assisted development tools to expand my engineering skill set. My approach is grounded in understanding requirements, choosing appropriate technologies, writing maintainable code, and strengthening my engineering fundamentals behind the applications I build.",
        experience: [
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
        ],
        education: [
            { degree: 'B.Sc. in Computer Science & Engineering', status: 'currently pursuing' },
            { degree: 'Diploma in Computer Engineering', status: 'completed' },
        ],
    },
    contact: {
        intro: 'Have a product to ship — or a codebase that needs AI-era velocity? Send a message; I reply within 24 hours.',
        email: 'dev.shahariar.official@gmail.com',
        phone: '+880 1410-270766',
        location: 'Jhenaidah, Bangladesh',
        social: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shahariar270/', icon: 'st-icon--linkedin' },
            { label: 'GitHub', href: 'https://github.com/shahariar270', icon: 'st-icon--github' },
            { label: 'Facebook', href: 'https://www.facebook.com/shahariar270/', icon: 'st-icon--facebook' },
        ],
    },
    footer: '© 2026 Shahariar — built with React, MERN & AI copilots.',
};

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
            ...PROJECT_CATEGORIES.map((label) => ({ label, kind: 'project_category', user_id })),
        ]);
        console.log(`Seeded ${POST_CATEGORIES.length + SKILL_GROUPS.length + PROJECT_CATEGORIES.length} taxonomies`);
    } else {
        if (await Taxonomy.countDocuments({ kind: 'project_category' }) === 0) {
            await Taxonomy.insertMany(
                PROJECT_CATEGORIES.map((label) => ({ label, kind: 'project_category', user_id }))
            );
            console.log(`Seeded ${PROJECT_CATEGORIES.length} missing project categories`);
        }
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

    let siteContent = await SiteContent.findOne();
    if (!siteContent) {
        await SiteContent.create({ ...SITE_CONTENT, user_id });
        console.log('Seeded site content');
    } else {
        let updated = false;

        siteContent.hero = siteContent.hero || {};
        if (siteContent.hero.headline !== SITE_CONTENT.hero.headline) { siteContent.hero.headline = SITE_CONTENT.hero.headline; updated = true; }
        if (siteContent.hero.highlight !== SITE_CONTENT.hero.highlight) { siteContent.hero.highlight = SITE_CONTENT.hero.highlight; updated = true; }
        if (siteContent.hero.bio !== SITE_CONTENT.hero.bio) { siteContent.hero.bio = SITE_CONTENT.hero.bio; updated = true; }
        if (!siteContent.hero.status) { siteContent.hero.status = SITE_CONTENT.hero.status; updated = true; }
        if (!siteContent.hero.roles || siteContent.hero.roles.length === 0) {
            siteContent.hero.roles = SITE_CONTENT.hero.roles;
            updated = true;
        }
        if (!siteContent.hero.stats || siteContent.hero.stats.length === 0) {
            siteContent.hero.stats = SITE_CONTENT.hero.stats;
            updated = true;
        }

        siteContent.about = siteContent.about || {};
        if (siteContent.about.bio !== SITE_CONTENT.about.bio) { siteContent.about.bio = SITE_CONTENT.about.bio; updated = true; }

        const currentExpTitles = new Set((siteContent.about.experience || []).map(e => e.title ? e.title.trim().toLowerCase() : ''));
        const defaultExps = SITE_CONTENT.about.experience || [];
        for (const exp of defaultExps) {
            if (!currentExpTitles.has(exp.title.trim().toLowerCase())) {
                siteContent.about.experience.push(exp);
                updated = true;
            }
        }

        const currentEduDegrees = new Set((siteContent.about.education || []).map(e => e.degree ? e.degree.toLowerCase().replace(/[^a-z]/g, '') : ''));
        const defaultEdus = SITE_CONTENT.about.education || [];
        for (const edu of defaultEdus) {
            const normKey = edu.degree.toLowerCase().replace(/[^a-z]/g, '');
            const isBscDuplicate = (normKey.includes('bsc') || normKey.includes('computerscience')) && Array.from(currentEduDegrees).some(k => k.includes('bsc') || k.includes('computerscience'));
            if (!currentEduDegrees.has(normKey) && !isBscDuplicate) {
                siteContent.about.education.push(edu);
                updated = true;
            }
        }

        siteContent.contact = siteContent.contact || {};
        if (!siteContent.contact.intro) { siteContent.contact.intro = SITE_CONTENT.contact.intro; updated = true; }
        if (!siteContent.contact.email) { siteContent.contact.email = SITE_CONTENT.contact.email; updated = true; }
        if (!siteContent.contact.phone) { siteContent.contact.phone = SITE_CONTENT.contact.phone; updated = true; }
        if (!siteContent.contact.location) { siteContent.contact.location = SITE_CONTENT.contact.location; updated = true; }

        const validSocials = (siteContent.contact.social || []).filter(s => s.label && s.label.trim() !== '' && s.href && s.href.trim() !== '');
        if (validSocials.length === 0) {
            siteContent.contact.social = SITE_CONTENT.contact.social;
            updated = true;
        } else {
            siteContent.contact.social = validSocials;
        }

        if (!siteContent.footer) { siteContent.footer = SITE_CONTENT.footer; updated = true; }
        if (!siteContent.resumeUrl) { siteContent.resumeUrl = '/resume.pdf'; updated = true; }

        if (updated) {
            siteContent.user_id = siteContent.user_id || user_id;
            await siteContent.save();
            console.log('Updated site content with missing default fields (preserved existing custom data)');
        } else {
            console.log('Site content already fully populated');
        }
    }

    await mongoose.disconnect();
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
