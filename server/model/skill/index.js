
const { default: mongoose } = require("mongoose");

const skill_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        group: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
            type: String,
            default: '',
            trim: true,
        },
        level: {
            type: Number,
            default: 70,
            min: 0,
            max: 100,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

skill_schema.index({ group: 1, name: 1 }, { unique: true });

const Skill = mongoose.model("Skill", skill_schema);

module.exports = Skill;
