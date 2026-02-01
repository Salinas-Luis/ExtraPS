const db = require('../config/db');

const Appointment = {
    checkClientOverlap: async (cliente_id, fecha, hora_inicio, hora_fin) => {
        const query = `
            SELECT id FROM citas 
            WHERE cliente_id = ? AND fecha = ? 
            AND (
                (hora_inicio < ? AND hora_fin > ?) 
                OR (hora_inicio < ? AND hora_fin > ?) 
            )
        `;
        const [rows] = await db.query(query, [cliente_id, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin]);
        return rows.length > 0;
    }
};

module.exports = Appointment;