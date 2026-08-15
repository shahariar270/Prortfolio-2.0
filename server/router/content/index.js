const express = require('express');
const router = express.Router();
const content_controller = require('../../controls/content');
const auth_middleware = require('../../middlewares/auth_middleware');
const { upload } = require('../../middlewares/file_handle');

const uploadContentImages = upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'aboutPhoto', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 },
]);

router.get('/content', content_controller.get_content);
router.get('/content/hero', content_controller.get_hero);
router.get('/content/about', content_controller.get_about);
router.get('/content/contact', content_controller.get_contact);
router.put('/content', auth_middleware.verify_token, auth_middleware.verify_role('admin'), uploadContentImages, content_controller.update_content);

module.exports = router;
