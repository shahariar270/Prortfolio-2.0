
const { default: mongoose } = require("mongoose");

const page_view_schema = new mongoose.Schema(
    {
        path: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        visitor_id: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
            index: true,
        },
        referrer_host: {
            type: String,
            default: '',
            trim: true,
            maxlength: 200,
        },
        duration_ms: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

page_view_schema.index({ createdAt: 1 });

const PageView = mongoose.model("PageView", page_view_schema);

module.exports = PageView;
