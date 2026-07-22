
const { default: mongoose } = require("mongoose");

const taxonomy_schema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        kind: {
            type: String,
            required: true,
            enum: ['post_category', 'skill_group'],
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

taxonomy_schema.index({ kind: 1, label: 1 }, { unique: true });

const Taxonomy = mongoose.model("Taxonomy", taxonomy_schema);

module.exports = Taxonomy;
