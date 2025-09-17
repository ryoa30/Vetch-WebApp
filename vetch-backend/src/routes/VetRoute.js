const express = require('express');
const router = express.Router();
const VetController = require('../controller/VetController');

const vetController = new VetController();

router.get('/', vetController.getVetListConsultation);

router.post('/schedule', vetController.createSchedule);

module.exports = router;