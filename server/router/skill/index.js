const express = require('express');
const router = express.Router();
const skill_controller = require('../../controls/skill');
const auth_middleware = require('../../middlewares/auth_middleware');

router.get('/skills', skill_controller.get_skills);

router.post('/skill', auth_middleware.verify_token, auth_middleware.verify_role('admin'), skill_controller.create_skill);
router.put('/skill/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), skill_controller.update_skill);
router.patch('/skill/:id/level', auth_middleware.verify_token, auth_middleware.verify_role('admin'), skill_controller.adjust_level);
router.delete('/skill/:id', auth_middleware.verify_token, auth_middleware.verify_role('admin'), skill_controller.delete_skill);

module.exports = router;
