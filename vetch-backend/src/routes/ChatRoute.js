const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');

const chatController = new ChatController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.post("/messages", chatController.getMessages);

router.post("/send", chatController.postMessage);

module.exports = router;