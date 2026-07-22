const express = require('express');
const router = express.Router();
const contact_router = require('./contact/index');
const auth_router = require('./auth/index');

router.use('/', contact_router);
router.use('/auth', auth_router);

module.exports = router;
