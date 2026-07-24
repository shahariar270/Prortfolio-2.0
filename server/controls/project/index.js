const Project = require('../../model/project/index');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');

// multer collapses a single-value field to a string — normalize to an array
const to_array = (value) => {
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value : [value];
};

const make_slug = (label) =>
    label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// slugs are unique — append -2, -3, … when the label collides
const unique_slug = async (label, ignoreId = null) => {
    const base = make_slug(label) || 'project';
    let slug = base;
    let n = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const query = ignoreId ? { slug, _id: { $ne: ignoreId } } : { slug };
        const exists = await Project.findOne(query).select('_id');
        if (!exists) return slug;
        slug = `${base}-${n++}`;
    }
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

    // public: the "case study" detail page
    async get_project_by_slug(req, res) {
        try {
            const { slug } = req.params;
            const project = await Project.findOne({ slug });
            if (!project) {
                return ApiResponse.error(res, 'Project not found', 404);
            }
            return ApiResponse.success(res, 'Project retrieved successfully', project);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving project', 500, error.message);
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

            const slug = await unique_slug(label);
            const new_project = await Project.create({
                label,
                slug,
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

            if (label !== undefined && label !== project.label) {
                project.label = label;
                project.slug = await unique_slug(label, project._id);
            }
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
