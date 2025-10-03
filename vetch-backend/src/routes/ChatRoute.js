const express = require('express');
const router = express.Router();
const ChatController = require('../controller/ChatController');

const chatController = new ChatController();

router.post("/messages", chatController.getMessages);

router.post("/send", chatController.postMessage);

module.exports = router;