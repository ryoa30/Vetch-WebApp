const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const OtpController = require('../utils/OtpController');
const EmailController = require('../utils/EmailController');

const otpController = new OtpController(new EmailController());
const userController = new UserController(otpController);
const upload = require("../utils/multer");

otpController.connect().catch(err => {
    console.error("Failed to connect to Redis on startup", err);
    process.exit(1); // Exit if critical services fail
});

const AuthController = require('../middleware/AuthController');

router.get('/',AuthController.authorize, userController.getAllUsers);

router.put('/',AuthController.authorize, upload.single("file"), userController.updateUserDetails);
router.put('/location',AuthController.authorize, userController.updateUserLocation);

router.get('/:id',AuthController.authorize, userController.getUserById);

router.get('/location/:userId',AuthController.authorize, userController.getUserLocation);

router.get('/email/:email', userController.getUserByEmail);

router.post('/login', userController.validateLogin)

router.post('/validate-otp', userController.validateOTP);

router.post('/send-otp', userController.resendOTP);

router.post('/forgot-password', userController.forgotPassword);

router.post('/register', upload.single("file"), userController.register);

module.exports = router;