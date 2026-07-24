
const { default: mongoose } = require("mongoose");

const project_schema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 150,
        },
        category: {
            type: String,
            required: true,
            enum: ['design', 'development'],
        },
        type: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
            maxlength: 1000,
        },
        technologies: {
            type: [String],
            default: [],
        },
        liveDemo: {
            type: String,
            default: '',
            trim: true,
        },
        image: {
            type: String,
            default: '',
            trim: true,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", project_schema);

module.exports = Project;
