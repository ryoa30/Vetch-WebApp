const express = require('express');
const router = express.Router();
const BookingController = require('../controller/BookingController');

const bookingController = new BookingController();

router.get('/concern-types', bookingController.getConcernTypes);

module.exports = router;