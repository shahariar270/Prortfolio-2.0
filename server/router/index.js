const express = require('express');
const router = express.Router();
const contact_router = require('./contact/index');

router.use('/', contact_router);

module.exports = router;
