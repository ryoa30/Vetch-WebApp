const express = require('express');
const router = express.Router();
const VetController = require('../controller/VetController');

const vetController = new VetController();

router.post('/', vetController.getVetListConsultation);
router.post('/emergency', vetController.getVetListEmergency);

router.get('/schedule', vetController.getVetSchedulesByDayAndId);
router.get('/daily-schedule', vetController.getVetSchedulesUserIdDay);
router.get('/species-types', vetController.getAllSpeciesTypes);
router.get('/ratings/:id', vetController.getVetRatings);
router.get('/user/:userId', vetController.getVetByUserId);

router.get('/:id', vetController.getVetDetailsById);

router.post('/schedule', vetController.createSchedule);
router.post('/add-species', vetController.addVetSpeciesType);
router.put('/', vetController.putVetDetails);
router.put('/availability', vetController.putVetHomecareEmergency);
router.put('/schedule', vetController.putSchedule);

router.delete('/delete-species', vetController.deleteSpecies);
router.delete('/schedule/:id', vetController.deleteSchedule);

module.exports = router;