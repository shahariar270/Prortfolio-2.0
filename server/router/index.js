const express = require('express');
const router = express.Router();
const contact_router = require('./contact/index');
const auth_router = require('./auth/index');
const post_router = require('./post/index');

router.use('/', contact_router);
router.use('/auth', auth_router);
router.use('/api', post_router);

module.exports = router;
