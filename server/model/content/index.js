
const { default: mongoose } = require("mongoose");

// Singleton — one document holds all the editable site copy that isn't a
// Post/Skill/Project (hero, about, contact, footer). There is only ever one
// of these; the controller upserts against an empty filter.
const site_content_schema = new mongoose.Schema(
    {
        hero: {
            status: { type: String, default: '', trim: true },
            headline: { type: String, default: '', trim: true },
            // substring within headline to render emphasized, e.g. "AI era"
            highlight: { type: String, default: '', trim: true },
            bio: { type: String, default: '', trim: true },
            // falls back to the bundled default image on the frontend when empty
            image: { type: String, default: '', trim: true },
            stats: {
                type: [{ value: String, label: String, _id: false }],
                default: [],
            },
        },
        about: {
            bio: { type: String, default: '', trim: true },
            // falls back to the bundled default photo on the frontend when empty
            photo: { type: String, default: '', trim: true },
            experience: {
                type: [{
                    title: String,
                    company: String,
                    period: String,
                    points: { type: [String], default: [] },
                    _id: false,
                }],
                default: [],
            },
            education: {
                type: [{ degree: String, status: String, _id: false }],
                default: [],
            },
        },
        contact: {
            intro: { type: String, default: '', trim: true },
            email: { type: String, default: '', trim: true },
            phone: { type: String, default: '', trim: true },
            location: { type: String, default: '', trim: true },
            social: {
                type: [{ label: String, href: String, icon: String, _id: false }],
                default: [],
            },
        },
        footer: { type: String, default: '', trim: true },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const SiteContent = mongoose.model("SiteContent", site_content_schema);

module.exports = SiteContent;
