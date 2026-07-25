
const { default: mongoose } = require("mongoose");

const post_schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        excerpt: {
            type: String,
            default: '',
            trim: true,
            maxlength: 500,
        },
        // rich-text HTML from the admin's editor, sanitized before render
        content: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
            trim: true,
        },
        read_time: {
            type: String,
            default: '',
            trim: true,
        },
        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        published: {
            type: Boolean,
            default: false,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", post_schema);

module.exports = Post;
