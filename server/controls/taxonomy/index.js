const Taxonomy = require('../../model/taxonomy/index');
const Post = require('../../model/post/index');
const Skill = require('../../model/skill/index');
const Project = require('../../model/project/index');
const ApiResponse = require('../../utils/api_response');

class taxonomy_controller {
    async get_taxonomies(req, res) {
        try {
            const { kind } = req.query;
            const filter = kind ? { kind } : {};
            const taxonomies = await Taxonomy.find(filter).sort({ createdAt: 1 });
            return ApiResponse.success(res, 'Taxonomies retrieved successfully', taxonomies);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving taxonomies', 500, error.message);
        };
    }

    async create_taxonomy(req, res) {
        try {
            const { label, kind } = req.body;
            const user_id = req.user.id;

            if (!label || !kind) {
                return ApiResponse.error(res, "Label and kind are required", 400);
            }
            if (!['post_category', 'skill_group', 'project_category'].includes(kind)) {
                return ApiResponse.error(res, "kind must be post_category, skill_group, or project_category", 400);
            }

            const existing = await Taxonomy.findOne({ label: label.trim(), kind });
            if (existing) {
                return ApiResponse.error(res, "Already exists", 400);
            }

            const new_taxonomy = await Taxonomy.create({ label: label.trim(), kind, user_id });
            return ApiResponse.success(res, 'Created successfully', new_taxonomy, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating taxonomy', 500, error.message);
        };
    }

    async update_taxonomy(req, res) {
        try {
            const { id } = req.params;
            const { label } = req.body;

            if (!label || !label.trim()) {
                return ApiResponse.error(res, "Label is required", 400);
            }

            const trimmedLabel = label.trim();
            const taxonomy = await Taxonomy.findById(id);
            if (!taxonomy) {
                return ApiResponse.error(res, 'Not found', 404);
            }

            const oldLabel = taxonomy.label;
            if (oldLabel === trimmedLabel) {
                return ApiResponse.success(res, 'No changes', taxonomy);
            }

            const duplicate = await Taxonomy.findOne({ label: trimmedLabel, kind: taxonomy.kind, _id: { $ne: id } });
            if (duplicate) {
                return ApiResponse.error(res, `"${trimmedLabel}" already exists in this section`, 400);
            }

            taxonomy.label = trimmedLabel;
            await taxonomy.save();

            // Cascade rename to in-use collections
            if (taxonomy.kind === 'post_category') {
                await Post.updateMany({ category: oldLabel }, { category: trimmedLabel });
            } else if (taxonomy.kind === 'skill_group') {
                await Skill.updateMany({ group: oldLabel }, { group: trimmedLabel });
            } else if (taxonomy.kind === 'project_category') {
                await Project.updateMany({ category: oldLabel }, { category: trimmedLabel });
                if (oldLabel.toLowerCase() === 'web design') {
                    await Project.updateMany({ category: 'design' }, { category: trimmedLabel });
                } else if (oldLabel.toLowerCase() === 'web development') {
                    await Project.updateMany({ category: 'development' }, { category: trimmedLabel });
                }
            }

            return ApiResponse.success(res, 'Updated successfully', taxonomy);
        } catch (error) {
            return ApiResponse.error(res, 'Error updating taxonomy', 500, error.message);
        }
    }

    async delete_taxonomy(req, res) {
        try {
            const { id } = req.params;

            const taxonomy = await Taxonomy.findById(id);
            if (!taxonomy) {
                return ApiResponse.error(res, 'Not found', 404);
            }

            // referential guard: block removing a category/group still in use
            let in_use = 0;
            if (taxonomy.kind === 'post_category') {
                in_use = await Post.countDocuments({ category: taxonomy.label });
            } else if (taxonomy.kind === 'skill_group') {
                in_use = await Skill.countDocuments({ group: taxonomy.label });
            } else if (taxonomy.kind === 'project_category') {
                const query = [{ category: taxonomy.label }];
                if (taxonomy.label.toLowerCase() === 'web design') query.push({ category: 'design' });
                if (taxonomy.label.toLowerCase() === 'web development') query.push({ category: 'development' });
                in_use = await Project.countDocuments({ $or: query });
            }

            if (in_use > 0) {
                return ApiResponse.error(
                    res,
                    `Cannot delete "${taxonomy.label}" — ${in_use} item(s) still use it`,
                    409
                );
            }

            await taxonomy.deleteOne();
            return ApiResponse.success(res, 'Deleted successfully', taxonomy);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error deleting taxonomy', 500, error.message);
        };
    }
}

module.exports = new taxonomy_controller;
