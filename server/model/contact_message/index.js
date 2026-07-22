
const { default: mongoose } = require("mongoose");

const contact_message_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
    },
    { timestamps: true }
);

contact_message_schema.index({ createdAt: 1 });

const ContactMessage = mongoose.model("ContactMessage", contact_message_schema);

module.exports = ContactMessage;
