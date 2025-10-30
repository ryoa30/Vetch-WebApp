const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/PaymentController');

const paymentController = new PaymentController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.post('/midtrans', paymentController.getTransactionToken);

router.put('/', paymentController.putPaymentDetails);

module.exports = router;