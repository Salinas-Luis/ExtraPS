const db = require('../config/db');

const Appointment = {
    checkClientOverlap: async (cliente_id, fecha, hora_inicio, hora_fin) => {
        try {
            const query = `
                SELECT id FROM citas 
                WHERE cliente_id = ? AND fecha = ? 
                AND (
                    (hora_inicio < ? AND hora_fin > ?) 
                )
            `;
            const [rows] = await db.query(query, [cliente_id, fecha, hora_fin, hora_inicio]);
            return rows.length > 0;
        } catch (error) {
            console.error("ERROR EN checkClientOverlap:", error.message);
            throw error;
        }
    },

    findAvailableStaff: async (habilidad, fecha, hora_inicio, hora_fin) => {
        try {
            const query = `
                SELECT p.id 
                FROM personal p
                WHERE p.habilidad = ? 
                AND p.esta_activo = 1
                -- Regla: Que el trabajador NO tenga una ausencia registrada ese día
                AND p.id NOT IN (
                    SELECT trabajador_id FROM ausencias WHERE fecha = ?
                )
                -- Regla: Que el trabajador NO tenga otra cita que se cruce
                AND p.id NOT IN (
                    SELECT trabajador_id FROM citas 
                    WHERE fecha = ? 
                    AND (hora_inicio < ? AND hora_fin > ?)
                )
                LIMIT 1
            `;
            const [rows] = await db.query(query, [habilidad, fecha, fecha, hora_fin, hora_inicio]);
            return rows.length > 0 ? rows[0].id : null;
        } catch (error) {
            console.error("ERROR EN findAvailableStaff:", error.message);
            throw error;
        }
    }
};

module.exports = Appointment;