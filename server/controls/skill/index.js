const Skill = require('../../model/skill/index');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');

const clamp_level = (level) => Math.max(0, Math.min(100, level));

class skill_controller {
    // public: powers both the live Skills section and the admin list
    async get_skills(req, res) {
        try {
            const skills = await Skill.find().sort({ group: 1, createdAt: 1 });
            return ApiResponse.success(res, 'Skills retrieved successfully', skills);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving skills', 500, error.message);
        };
    }

    async create_skill(req, res) {
        try {
            const { name, group, logo, level } = req.body;
            const user_id = req.user.id;

            if (!name || !group) {
                return ApiResponse.error(res, "Name and group are required", 400);
            }

            const existing = await Skill.findOne({ name, group });
            if (existing) {
                return ApiResponse.error(res, "Skill already exists in this group", 400);
            }

            let logo_url = logo;
            if (req.file) {
                logo_url = await uploadImage(req.file.path, 'portfolio_skills');
            }

            const new_skill = await Skill.create({
                name,
                group,
                logo: logo_url,
                level: level === undefined ? 70 : clamp_level(level),
                user_id,
            });

            return ApiResponse.success(res, 'Skill created successfully', new_skill, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating skill', 500, error.message);
        };
    }

    async update_skill(req, res) {
        try {
            const { id } = req.params;
            const { name, group, logo, level } = req.body;

            const updates = {};
            if (name !== undefined) updates.name = name;
            if (group !== undefined) updates.group = group;
            if (req.file) {
                updates.logo = await uploadImage(req.file.path, 'portfolio_skills');
            } else if (logo !== undefined) {
                updates.logo = logo;
            }
            if (level !== undefined) updates.level = clamp_level(level);

            const updated_skill = await Skill
                .findByIdAndUpdate(id, updates, { new: true, runValidators: true });

            if (!updated_skill) {
                return ApiResponse.error(res, 'Skill not found', 404);
            }
            return ApiResponse.success(res, 'Skill updated successfully', updated_skill);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    // matches the admin +/- steppers: { delta: 4 } or { delta: -4 }
    async adjust_level(req, res) {
        try {
            const { id } = req.params;
            const delta = Number(req.body.delta);

            if (!Number.isFinite(delta)) {
                return ApiResponse.error(res, "delta must be a number", 400);
            }

            const skill = await Skill.findById(id);
            if (!skill) {
                return ApiResponse.error(res, 'Skill not found', 404);
            }

            skill.level = clamp_level(skill.level + delta);
            await skill.save();
            return ApiResponse.success(res, 'Skill level updated', skill);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    async delete_skill(req, res) {
        try {
            const { id } = req.params;
            const deleted_skill = await Skill.findByIdAndDelete(id);
            if (!deleted_skill) {
                return ApiResponse.error(res, 'Skill not found', 404);
            }
            return ApiResponse.success(res, 'Skill deleted successfully', deleted_skill);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error deleting skill', 500, error.message);
        };
    }
}

module.exports = new skill_controller;
