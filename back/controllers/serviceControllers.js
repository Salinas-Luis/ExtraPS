const Service = require('../model/serviceModel');

exports.listarServicios = async (req, res) => {
    try {
        const servicios = await Service.getAll();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener servicios" });
    }
};

exports.detalleServicio = async (req, res) => {
    try {
        const servicio = await Service.getById(req.params.id);
        if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });
        
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el detalle" });
    }
};