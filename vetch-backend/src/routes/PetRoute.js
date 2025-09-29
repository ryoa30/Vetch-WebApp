const express = require('express');
const router = express.Router();
const PetController = require('../controller/PetController');

const petController = new PetController();

router.get('/:userId', petController.getPetsByUserId);

module.exports = router;