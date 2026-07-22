const express = require('express');
const router = express.Router();
const analytics_controller = require('../../controls/analytics');
const auth_middleware = require('../../middlewares/auth_middleware');

router.post('/track', analytics_controller.track);

router.get('/analytics/summary', auth_middleware.verify_token, auth_middleware.verify_role('admin'), analytics_controller.summary);

module.exports = router;
