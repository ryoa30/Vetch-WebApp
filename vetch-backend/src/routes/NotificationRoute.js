const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/NotificationController');

const notificationController = new NotificationController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.get('/unconfirmed/:userId', notificationController.getUnconfirmedNotifications);
router.put('/confirm', notificationController.putConfirmNotification);
router.put('/confirm-all', notificationController.putConfirmAllNotifications);
router.post('/subscribe', notificationController.detectSubscription);
router.post('/test', notificationController.sendToAll);


module.exports = router;