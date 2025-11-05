const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');
const upload = require("../utils/multer");

const chatController = new ChatController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.post('/send-image', upload.single("file"), chatController.uploadImage);

router.post("/messages", chatController.getMessages);

router.post("/send", chatController.postMessage);

module.exports = router;