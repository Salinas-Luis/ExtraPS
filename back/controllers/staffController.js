const db = require('../config/db');

exports.verMiAgenda = async (req, res) => {
    const { trabajador_id, fecha } = req.query; 

    try {
        const query = `
            SELECT c.id, u.nombre_completo AS cliente, s.nombre AS servicio, 
                   c.hora_inicio, c.hora_fin, c.estado, s.duracion_minutos
            FROM citas c
            JOIN usuarios u ON c.cliente_id = u.id
            JOIN servicios s ON c.servicio_id = s.id
            WHERE c.trabajador_id = ? AND c.fecha = ?
            ORDER BY c.hora_inicio ASC
        `;
        const [agenda] = await db.query(query, [trabajador_id, fecha]);

        res.json(agenda);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la agenda del personal." });
    }
};
exports.actualizarEstatusCita = async (req, res) => {
    const { cita_id, nuevo_estado } = req.body;

    const estadosValidos = ['Confirmada', 'En Curso', 'Completada', 'No Show'];

    if (!estadosValidos.includes(nuevo_estado)) {
        return res.status(400).json({ error: "Estado no válido." });
    }

    try {
        const query = 'UPDATE citas SET estado = ? WHERE id = ?';
        const [result] = await db.query(query, [nuevo_estado, cita_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada." });
        }

        res.json({ 
            success: true, 
            message: `La cita ahora está: ${nuevo_estado}` 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el estado de la cita." });
    }
};