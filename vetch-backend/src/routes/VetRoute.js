const express = require('express');
const router = express.Router();
const VetController = require('../controller/VetController');

const vetController = new VetController();

router.get('/', vetController.getVetListConsultation);

router.get('/schedule', vetController.getVetSchedulesByDayAndId);
router.get('/:id', vetController.getVetDetailsById);
router.get('/ratings/:id', vetController.getVetRatings);

router.post('/schedule', vetController.createSchedule);

module.exports = router;