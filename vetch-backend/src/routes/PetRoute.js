const express = require('express');
const router = express.Router();
const PetController = require('../controller/PetController');

const petController = new PetController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.get('/:userId', petController.getPetsByUserId);
router.get('/vet/:userId', petController.getPetsByVetId);
router.put('/', petController.updatePetDetails);
router.post('/', petController.createPet);
router.delete('/:petId', petController.softDeletePet);

module.exports = router;