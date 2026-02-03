const Admin = require('../model/adminModel');

exports.registrarEmpleado = async (req, res) => {
    const { usuario_id, habilidad } = req.body;
    try {
        await Admin.createStaff(usuario_id, habilidad);
        res.status(201).json({ success: true, message: "Personal dado de alta correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar personal." });
    }
};

exports.registrarFalta = async (req, res) => {
    const { trabajador_id, fecha, motivo } = req.body;
    try {
        await Admin.createAbsence(trabajador_id, fecha, motivo);
        res.status(201).json({ success: true, message: "Ausencia programada exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la ausencia." });
    }
};
exports.obtenerTodasLasCitas = async (req, res) => {
    const { fecha } = req.query; 

    try {
        const query = `
            SELECT c.id, u.nombre_completo AS cliente, p.habilidad AS tipo_personal,
                   per_u.nombre_completo AS trabajador, s.nombre AS servicio,
                   c.hora_inicio, c.hora_fin, c.estado
            FROM citas c
            JOIN usuarios u ON c.cliente_id = u.id
            JOIN personal p ON c.trabajador_id = p.id
            JOIN usuarios per_u ON p.usuario_id = per_u.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.fecha = ?
            ORDER BY c.hora_inicio ASC
        `;
        const [reporte] = await db.query(query, [fecha]);

        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el reporte global." });
    }
};