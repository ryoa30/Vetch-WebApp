const express = require('express');
const router = express.Router();
const VetController = require('../controller/VetController');

const vetController = new VetController();

const AuthController = require('../middleware/AuthController');
const upload = require("../utils/multer");

router.post('/', vetController.getVetListConsultation);
router.post('/emergency', vetController.getVetListEmergency);
router.get('/stats/:userId', vetController.getVetStats);

router.get('/schedule',AuthController.authorize, vetController.getVetSchedulesByDayAndId);
router.get('/daily-schedule',AuthController.authorize, vetController.getVetSchedulesUserIdDay);
router.get('/species-types',AuthController.authorize, vetController.getAllSpeciesTypes);
router.get('/ratings/:id',AuthController.authorize, vetController.getVetRatings);
router.get('/user/:userId',AuthController.authorize, vetController.getVetByUserId);

router.get('/:id',AuthController.authorize, vetController.getVetDetailsById);

router.post('/schedule',AuthController.authorize, vetController.createSchedule);
router.post('/add-species',AuthController.authorize, vetController.addVetSpeciesType);
router.put('/',AuthController.authorize, vetController.putVetDetails);
router.put('/availability',AuthController.authorize, vetController.putVetHomecareEmergency);
router.put('/schedule',AuthController.authorize, vetController.putSchedule);
router.put('/reupload-certificate',AuthController.authorize, upload.single("file"), vetController.putCertificateReupload);

router.delete('/delete-species',AuthController.authorize, vetController.deleteSpecies);
router.delete('/schedule/:id',AuthController.authorize, vetController.deleteSchedule);

module.exports = router;