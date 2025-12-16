const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/PaymentController');

const paymentController = new PaymentController();

const AuthController = require('../middleware/AuthController');
// router.use(AuthController.authorize);

router.post('/', paymentController.receivePaymentNotification);

router.post('/refund', AuthController.authorize, paymentController.refundTransaction);

router.post('/midtrans', AuthController.authorize, paymentController.getTransactionToken);

router.put('/', AuthController.authorize, paymentController.putPaymentDetails);

module.exports = router;