const express = require('express');
const router = express.Router();
const contact_router = require('./contact/index');
const auth_router = require('./auth/index');
const post_router = require('./post/index');
const skill_router = require('./skill/index');
const taxonomy_router = require('./taxonomy/index');
const analytics_router = require('./analytics/index');

router.use('/', contact_router);
router.use('/auth', auth_router);
router.use('/api', post_router);
router.use('/api', skill_router);
router.use('/api', taxonomy_router);
router.use('/api', analytics_router);

module.exports = router;
