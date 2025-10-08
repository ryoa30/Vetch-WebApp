const express = require('express');
const router = express.Router();
const PetController = require('../controller/PetController');

const petController = new PetController();

router.get('/:userId', petController.getPetsByUserId);
router.put('/', petController.updatePetDetails);
router.post('/', petController.createPet);
router.delete('/:petId', petController.softDeletePet);

module.exports = router;