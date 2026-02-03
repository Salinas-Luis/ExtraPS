const Admin = require('../model/adminModel');
const db = require('../config/db'); 

const sanitizeHTML = (str) => str && typeof str === 'string' ? str.replace(/<[^>]*>?/gm, '').trim() : str;

exports.registrarEmpleado = async (req, res) => {
    let { usuario_id, habilidad } = req.body;

    if (!usuario_id || !habilidad) {
        return res.status(400).json({ error: "El ID de usuario y la habilidad son obligatorios." });
    }

    habilidad = sanitizeHTML(habilidad);

    try {
        await Admin.createStaff(usuario_id, habilidad);
        res.status(201).json({ success: true, message: "Personal dado de alta correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar personal: " + error.message });
    }
};

exports.registrarFalta = async (req, res) => {
    let { trabajador_id, fecha, motivo } = req.body;

    if (!trabajador_id || !fecha) {
        return res.status(400).json({ error: "Se requiere el ID del trabajador y la fecha de la falta." });
    }

    const motivoLimpio = sanitizeHTML(motivo) || "Sin motivo especificado";
    const fechaLimpia = sanitizeHTML(fecha);

    try {
        await Admin.createAbsence(trabajador_id, fechaLimpia, motivoLimpio);
        res.status(201).json({ success: true, message: "Ausencia programada exitosamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la ausencia." });
    }
};

exports.obtenerTodasLasCitas = async (req, res) => {
    let { fecha } = req.query; 

    if (!fecha) {
        return res.status(400).json({ error: "Debes proporcionar una fecha para generar el reporte." });
    }

    fecha = sanitizeHTML(fecha);

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
        res.status(500).json({ error: "Error al obtener el reporte global: " + error.message });
    }
};