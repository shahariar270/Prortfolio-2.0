const Taxonomy = require('../../model/taxonomy/index');
const Post = require('../../model/post/index');
const Skill = require('../../model/skill/index');
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
            if (!['post_category', 'skill_group'].includes(kind)) {
                return ApiResponse.error(res, "kind must be post_category or skill_group", 400);
            }

            const existing = await Taxonomy.findOne({ label, kind });
            if (existing) {
                return ApiResponse.error(res, "Already exists", 400);
            }

            const new_taxonomy = await Taxonomy.create({ label, kind, user_id });
            return ApiResponse.success(res, 'Created successfully', new_taxonomy, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating taxonomy', 500, error.message);
        };
    }

    async delete_taxonomy(req, res) {
        try {
            const { id } = req.params;

            const taxonomy = await Taxonomy.findById(id);
            if (!taxonomy) {
                return ApiResponse.error(res, 'Not found', 404);
            }

            // referential guard: block removing a category/group still in use
            const in_use = taxonomy.kind === 'post_category'
                ? await Post.countDocuments({ category: taxonomy.label })
                : await Skill.countDocuments({ group: taxonomy.label });

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
