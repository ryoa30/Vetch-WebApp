const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/PaymentController');

const paymentController = new PaymentController();

router.post('/midtrans', paymentController.getTransactionToken);

router.put('/', paymentController.putPaymentDetails);

module.exports = router;