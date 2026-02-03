const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/personal', adminController.registrarEmpleado);
router.post('/ausencias', adminController.registrarFalta);

router.get('/dashboard-general', adminController.obtenerTodasLasCitas);

module.exports = router;