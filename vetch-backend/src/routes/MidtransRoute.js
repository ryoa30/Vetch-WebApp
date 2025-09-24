const express = require('express');
const router = express.Router();
const MidtransController = require('../controller/MidtransController');

const midtransController = new MidtransController();

router.post('/midtrans', midtransController.getTransactionToken);

module.exports = router;