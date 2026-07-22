const express = require('express');
const router = express.Router();
const post_controller = require('../../controls/post');
const auth_middleware = require('../../middlewares/auth_middleware');

router.get('/posts', post_controller.get_posts);
router.get('/posts/all', auth_middleware.verify_token, auth_middleware.verify_role('admin'), post_controller.get_all_posts);
router.get('/posts/:slug', post_controller.get_post_by_slug);
router.post('/posts/:slug/view', post_controller.add_view);

router.post('/post', auth_middleware.verify_token, auth_middleware.verify_role('admin'), post_controller.create_post);
router.put('/post/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), post_controller.update_post);
router.patch('/post/:id/publish', auth_middleware.verify_token, auth_middleware.verify_role('admin'), post_controller.toggle_publish);
router.delete('/post/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), post_controller.delete_post);

module.exports = router;
