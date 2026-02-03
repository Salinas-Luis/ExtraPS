const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceControllers');

router.get('/', serviceController.listarServicios);

router.get('/:id', serviceController.detalleServicio);

module.exports = router;