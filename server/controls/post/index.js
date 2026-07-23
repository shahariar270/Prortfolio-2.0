const Post = require('../../model/post/index');
const { uploadImage } = require('../../utils/cloudniry');
const ApiResponse = require('../../utils/api_response');

// multipart form fields arrive as strings — treat 'true'/true as true
const to_bool = (value) => value === true || value === 'true';

const make_slug = (title) =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// slugs are unique — append -2, -3, … when the title collides
const unique_slug = async (title, ignoreId = null) => {
    const base = make_slug(title) || 'post';
    let slug = base;
    let n = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const query = ignoreId ? { slug, _id: { $ne: ignoreId } } : { slug };
        const exists = await Post.findOne(query).select('_id');
        if (!exists) return slug;
        slug = `${base}-${n++}`;
    }
};

class post_controller {
    // public: published posts for the live blog section
    async get_posts(req, res) {
        try {
            const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
            return ApiResponse.success(res, 'Posts retrieved successfully', posts);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving posts', 500, error.message);
        };
    }

    // admin: every post including drafts
    async get_all_posts(req, res) {
        try {
            const posts = await Post.find().sort({ createdAt: -1 });
            return ApiResponse.success(res, 'Posts retrieved successfully', posts);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving posts', 500, error.message);
        };
    }

    async get_post_by_slug(req, res) {
        try {
            const { slug } = req.params;
            const post = await Post.findOne({ slug, published: true });
            if (!post) {
                return ApiResponse.error(res, 'Post not found', 404);
            }
            return ApiResponse.success(res, 'Post retrieved successfully', post);
        } catch (error) {
            return ApiResponse.error(res, 'Error retrieving post', 500, error.message);
        };
    }

    async create_post(req, res) {
        try {
            const { title, category, excerpt, content, image, read_time, published } = req.body;
            const user_id = req.user.id;

            if (!title || !category) {
                return ApiResponse.error(res, "Title and category are required", 400);
            }

            let image_url = image;
            if (req.file) {
                image_url = await uploadImage(req.file.path);
            }

            const slug = await unique_slug(title);
            const new_post = await Post.create({
                title,
                slug,
                category,
                excerpt,
                content,
                image: image_url,
                read_time,
                published: to_bool(published),
                user_id,
            });

            return ApiResponse.success(res, 'Post created successfully', new_post, 201);
        } catch (error) {
            return ApiResponse.error(res, 'Error creating post', 500, error.message);
        };
    }

    async update_post(req, res) {
        try {
            const { id } = req.params;
            const { title, category, excerpt, content, image, read_time, published } = req.body;

            const post = await Post.findById(id);
            if (!post) {
                return ApiResponse.error(res, 'Post not found', 404);
            }

            if (title !== undefined && title !== post.title) {
                post.title = title;
                post.slug = await unique_slug(title, post._id);
            }
            if (category !== undefined) post.category = category;
            if (excerpt !== undefined) post.excerpt = excerpt;
            if (content !== undefined) post.content = content;
            if (req.file) {
                post.image = await uploadImage(req.file.path);
            } else if (image !== undefined) {
                post.image = image;
            }
            if (read_time !== undefined) post.read_time = read_time;
            if (published !== undefined) post.published = to_bool(published);

            await post.save();
            return ApiResponse.success(res, 'Post updated successfully', post);
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    async toggle_publish(req, res) {
        try {
            const { id } = req.params;
            const post = await Post.findById(id);
            if (!post) {
                return ApiResponse.error(res, 'Post not found', 404);
            }
            post.published = !post.published;
            await post.save();
            return ApiResponse.success(
                res,
                post.published ? 'Post published' : 'Post moved to drafts',
                post
            );
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }

    async delete_post(req, res) {
        try {
            const { id } = req.params;
            const deleted_post = await Post.findByIdAndDelete(id);
            if (!deleted_post) {
                return ApiResponse.error(res, 'Post not found', 404);
            }
            return ApiResponse.success(res, 'Post deleted successfully', deleted_post);
        }
        catch (error) {
            return ApiResponse.error(res, 'Error deleting post', 500, error.message);
        };
    }

    // public: count a read on the live site
    async add_view(req, res) {
        try {
            const { slug } = req.params;
            const post = await Post.findOneAndUpdate(
                { slug, published: true },
                { $inc: { views: 1 } },
                { new: true }
            );
            if (!post) {
                return ApiResponse.error(res, 'Post not found', 404);
            }
            return ApiResponse.success(res, 'View counted', { views: post.views });
        } catch (error) {
            return ApiResponse.error(res, error.message, 500);
        };
    }
}

module.exports = new post_controller;
