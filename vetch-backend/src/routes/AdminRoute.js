const express = require('express');
const router = express.Router();
const AdminController = require('../controller/AdminController');

const adminController = new AdminController();

router.get('/vet-certificates', adminController.getUncomfirmedVetCertificates);
router.get('/vet-confirmed-certificates', adminController.getComfirmedVetCertificates);

router.put('/vet-certificates/status', adminController.putVetCertificateStatus);

module.exports = router;