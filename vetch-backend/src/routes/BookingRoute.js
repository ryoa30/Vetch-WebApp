const express = require('express');
const router = express.Router();
const BookingController = require('../controller/BookingController');

const bookingController = new BookingController();

router.get('/concern-types', bookingController.getConcernTypes);
router.get('/by-user-date-time', bookingController.getBookingByUserIdDateTime);

router.post('/', bookingController.createBooking);
router.put('/status', bookingController.updateBookingStatus);

module.exports = router;