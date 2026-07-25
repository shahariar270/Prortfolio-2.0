const express = require('express');
const router = express.Router();
const project_controller = require('../../controls/project');
const auth_middleware = require('../../middlewares/auth_middleware');
const { upload } = require('../../middlewares/file_handle');

router.get('/projects', project_controller.get_projects);
router.get('/projects/:slug', project_controller.get_project_by_slug);

router.post('/project', auth_middleware.verify_token, auth_middleware.verify_role('admin'), upload.single('image'), project_controller.create_project);
router.put('/project/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), upload.single('image'), project_controller.update_project);
router.delete('/project/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), project_controller.delete_project);

module.exports = router;
