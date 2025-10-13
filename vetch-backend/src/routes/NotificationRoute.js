const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/NotificationController');

const notificationController = new NotificationController();

router.post('/subscribe', notificationController.detectSubscription);
router.post('/test', notificationController.sendToAll);


module.exports = router;