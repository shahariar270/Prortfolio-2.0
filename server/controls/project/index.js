const Project = require('../../model/project/index');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');

// multer collapses a single-value field to a string — normalize to an array
const to_array = (value) => {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value : [value];
};

class project_controller {
    // public: powers both the live Projects section and the admin list
    async get_projects(req, res) {
        try {
            const projects = await Project.find().sort({ createdAt: 1 });
            return ApiResponse.success(res, 'Projects retrieved successfully', projects);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving projects', 500, error.message);
        };
    }

    async create_project(req, res) {
        try {
            const { label, category, type, description, technologies, liveDemo, image } = req.body;
            const user_id = req.user.id;

            if (!label || !category) {
                return ApiResponse.error(res, "Label and category are required", 400);
            }

            let image_url = image;
            if (req.file) {
                image_url = await uploadImage(req.file.path, 'portfolio_projects');
            }

            const new_project = await Project.create({
                label,
                category,
                type,
                description,
                technologies: to_array(technologies) || [],
                liveDemo,
                image: image_url,
                user_id,
            });

            return ApiResponse.success(res, 'Project created successfully', new_project, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating project', 500, error.message);
        };
    }

    async update_project(req, res) {
        try {
            const { id } = req.params;
            const { label, category, type, description, technologies, liveDemo, image } = req.body;

            const project = await Project.findById(id);
            if (!project) {
                return ApiResponse.error(res, 'Project not found', 404);
            }

            if (label !== undefined) project.label = label;
            if (category !== undefined) project.category = category;
            if (type !== undefined) project.type = type;
            if (description !== undefined) project.description = description;
            if (technologies !== undefined) project.technologies = to_array(technologies);
            if (liveDemo !== undefined) project.liveDemo = liveDemo;
            if (req.file) {
                project.image = await uploadImage(req.file.path, 'portfolio_projects');
            } else if (image !== undefined) {
                project.image = image;
            }

            await project.save();
            return ApiResponse.success(res, 'Project updated successfully', project);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    async delete_project(req, res) {
        try {
            const { id } = req.params;
            const deleted_project = await Project.findByIdAndDelete(id);
            if (!deleted_project) {
                return ApiResponse.error(res, 'Project not found', 404);
            }
            return ApiResponse.success(res, 'Project deleted successfully', deleted_project);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error deleting project', 500, error.message);
        };
    }
}

module.exports = new project_controller;
