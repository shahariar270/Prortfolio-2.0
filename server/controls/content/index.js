const SiteContent = require('../../model/content/index');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');

// the admin form always submits multipart (it may or may not include new
// image files alongside the text), so hero/about/contact arrive JSON-encoded
const parse_field = (value) => {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

// mirrors the copy that was hardcoded in Hero/About/Contact before this was
// admin-editable — used to seed the very first document on a fresh DB so the
// public site never renders blank
const DEFAULTS = {
    hero: {
        status: 'Available for work · Jhenaidah, Bangladesh',
        headline: 'Shahariar builds web products for the AI era.',
        highlight: 'AI era',
        bio: 'React & MERN engineer shipping production apps with AI copilots — Claude, Cursor, Codex — in the loop. Human judgment, machine speed.',
        stats: [
            { value: '10+', label: 'Core skills' },
            { value: '4', label: 'Shipped projects' },
            { value: '4', label: 'AI copilots' },
            { value: '24h', label: 'Response' },
        ],
    },
    about: {
        bio: "I build scalable, high-performance web solutions with clean architecture. As a MERN specialist and WordPress expert, I lead a development team — and I've rebuilt my whole workflow around AI: Claude for planning and review, Cursor for pair-coding, Codex for agentic edits.",
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
        intro: "Have a product to ship — or a codebase that needs AI-era velocity? Send a message; I reply within 24 hours.",
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

// shared by get_content and the bootstrap controller so the
// create-default-on-first-read logic only lives in one place — a plain
// function rather than a class method, since routes call get_content as a
// bare reference (router.get('/content', content_controller.get_content)),
// which strips `this` when Express invokes it
const get_content_doc = async () => {
    let content = await SiteContent.findOne();
    if (!content) {
        content = await SiteContent.create({ ...DEFAULTS, user_id: 'system' });
    }
    return content;
};

class content_controller {
    // public: powers Hero/About/Contact on the live site
    async get_content(req, res) {
        try {
            const content = await get_content_doc();
            return ApiResponse.success(res, 'Content retrieved successfully', content);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving content', 500, error.message);
        };
    }

    async update_content(req, res) {
        try {
            const hero = parse_field(req.body.hero) || {};
            const about = parse_field(req.body.about) || {};
            const contact = parse_field(req.body.contact) || {};
            const { footer } = req.body;
            const user_id = req.user.id;

            if (req.files?.heroImage?.[0]) {
                hero.image = await uploadImage(req.files.heroImage[0].path, 'portfolio_content');
            }
            if (req.files?.aboutPhoto?.[0]) {
                about.photo = await uploadImage(req.files.aboutPhoto[0].path, 'portfolio_content');
            }

            const content = await SiteContent.findOneAndUpdate(
                {},
                { hero, about, contact, footer, user_id },
                { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
            );

            return ApiResponse.success(res, 'Content updated successfully', content);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }
}

const instance = new content_controller;
instance.get_content_doc = get_content_doc;
module.exports = instance;
