const express = require('express');
const router = express.Router();
const validationController = require('../controllers/v_controlador');
const appointmentController = require('../controllers/appointmentController');

router.post('/agendar', validationController.validarCita, (req, res) => {
    router.post('/agendar', validationController.validarCita, appointmentController.asignarYCrearCita);
    res.json({ message: "Validaciones pasadas. Listo para buscar personal." });
});

module.exports = router;