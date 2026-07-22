const express = require('express');
const router = express.Router();

const {
    login_controller,
    profile_controller
} = require('../../controls/auth');
const auth_middleware = require('../../middlewares/auth_middleware');

router.post('/login', login_controller);

router.get('/profile', auth_middleware.verify_token, profile_controller);

module.exports = router;
