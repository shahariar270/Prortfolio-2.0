const express = require('express');
const router = express.Router();
const taxonomy_controller = require('../../controls/taxonomy');
const auth_middleware = require('../../middlewares/auth_middleware');

router.get('/taxonomies', taxonomy_controller.get_taxonomies);

router.post('/taxonomy', auth_middleware.verify_token, auth_middleware.verify_role('admin'), taxonomy_controller.create_taxonomy);
router.delete('/taxonomy/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), taxonomy_controller.delete_taxonomy);

module.exports = router;
