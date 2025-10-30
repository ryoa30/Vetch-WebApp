const express = require('express');
const router = express.Router();
const AuthController = require('../middleware/AuthController');

// Do NOT protect this route with authorize
router.post('/refresh', AuthController.refreshAccessToken);

module.exports = router;