const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const BookingController = require('../controller/BookingController');

const bookingController = new BookingController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.get('/', bookingController.getBookingsByUserId);
router.get('/past-booking', bookingController.getPastBookingsByPetId);
router.get('/vet', bookingController.getBookingByVetId);
router.get('/byId/:bookingId', bookingController.getBookingById);
router.get('/concern-types', bookingController.getConcernTypes);
router.get('/by-user-date-time', bookingController.getBookingByUserIdDateTime);

router.post('/', bookingController.createBooking);
router.post('/rate', bookingController.createBookingRating);
router.put('/status', bookingController.putBookingStatus);
router.put('/conclusion', bookingController.putConclussionDates);

cron.schedule("* * * * *", async () => { bookingController.syncBookings() });

module.exports = router;