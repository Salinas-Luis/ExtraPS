const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/personal', adminController.promoverAPersonal);
router.post('/ausencias', adminController.registrarFalta);
router.get('/tablero-citas', adminController.obtenerTableroCitas);
router.put('/cancelar-cita/:id', adminController.cancelarCitaAdmin);
router.post('/reasignar', adminController.reasignarPersonal);
router.post('/promover-personal', adminController.promoverAPersonal);
router.get('/lista-clientes', adminController.obtenerListaClientes);

module.exports = router;