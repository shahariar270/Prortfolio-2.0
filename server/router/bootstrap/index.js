const express = require('express');
const router = express.Router();
const bootstrap_controller = require('../../controls/bootstrap');

router.get('/bootstrap', bootstrap_controller.get_bootstrap);

module.exports = router;
