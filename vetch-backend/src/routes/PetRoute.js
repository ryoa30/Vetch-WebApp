const express = require('express');
const router = express.Router();
const PetController = require('../controller/PetController');
const { CronJob } = require('cron');

const petController = new PetController();

const AuthController = require('../middleware/AuthController');
router.use(AuthController.authorize);

router.get('/:userId', petController.getPetsByUserId);
router.get('/vet/:userId', petController.getPetsByVetId);
router.put('/', petController.updatePetDetails);
router.post('/', petController.createPet);
router.delete('/:petId', petController.softDeletePet);

const job = new CronJob(
  '0 0 6 * * *',           
//   '*/10 * * * * *',           
  async () => {
    console.log('Daily job @ 06:00 Asia/Jakarta running');
    await petController.dailyPetReminder();
  },
  null,
  true,                      
  'Asia/Jakarta'
);

job.start(); 

module.exports = router;