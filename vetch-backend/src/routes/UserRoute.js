const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const verifyToken = require('../middleware/AuthController'); // Import the middleware
const OtpController = require('../utils/OtpController');
const EmailController = require('../utils/EmailController');

const otpController = new OtpController(new EmailController());
const userController = new UserController(otpController);

otpController.connect().catch(err => {
    console.error("Failed to connect to Redis on startup", err);
    process.exit(1); // Exit if critical services fail
});

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/login', userController.validateLogin)

router.post('/validate-otp', userController.validateOTP);

router.post('/register', userController.register);

module.exports = router;