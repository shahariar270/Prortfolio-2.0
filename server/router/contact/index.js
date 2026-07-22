const express = require('express');
const router = express.Router();
const contact_controller = require('../../controls/contact');

// kept at the root path (no /api prefix) for backward compatibility with the
// client's existing fetch("…/contact")
router.post('/contact', contact_controller.send_message);

module.exports = router;
