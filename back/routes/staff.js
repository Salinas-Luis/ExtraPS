const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.get('/mi-agenda', staffController.verMiAgenda);

router.patch('/actualizar-cita', staffController.actualizarEstatusCita);

module.exports = router;