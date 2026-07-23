
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        user_role: {
            type: String,
            default: 'admin',
            enum: ['admin'],
            trim: true,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
