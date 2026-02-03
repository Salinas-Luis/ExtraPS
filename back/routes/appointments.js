const express = require('express');
const router = express.Router();
const validationController = require('../controllers/v_controlador');
const appointmentController = require('../controllers/appointmentController');

router.post('/agendar', 
    validationController.validarCita, 
    appointmentController.asignarYCrearCita
);
router.get('/cliente/:id', appointmentController.obtenerCitasPorCliente);
module.exports = router;