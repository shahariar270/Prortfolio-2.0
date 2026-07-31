const Skill = require('../../model/skill');
const Project = require('../../model/project');
const Post = require('../../model/post');
const content_controller = require('../../controls/content');
const ApiResponse = require('../../utils/api_response');

class bootstrap_controller {
    // public: combines the four requests the public site fires on every page
    // load (content, skills, projects, posts) into one round trip — the
    // Editorial page mounts all of its sections at once, so without this
    // each one fired its own fetch independently
    async get_bootstrap(req, res) {
        try {
            const [content, skills, projects, posts] = await Promise.all([
                content_controller.get_content_doc(),
                Skill.find().sort({ group: 1, createdAt: 1 }),
                Project.find().sort({ createdAt: 1 }),
                Post.find({ published: true }).sort({ createdAt: -1 }),
            ]);

            return ApiResponse.success(res, 'Bootstrap data retrieved successfully', {
                content,
                skills,
                projects,
                posts,
            });
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving bootstrap data', 500, error.message);
        };
    }
}

module.exports = new bootstrap_controller;
