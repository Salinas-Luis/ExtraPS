const db = require('../config/db');

const Staff = {
    findBySkill: async (skill) => {
        const query = `
            SELECT id FROM personal 
            WHERE habilidad = ? AND esta_activo = 1
        `;
        const [rows] = await db.query(query, [skill]);
        return rows;
    },

    checkAbsence: async (trabajador_id, fecha) => {
        const query = 'SELECT id FROM ausencias WHERE trabajador_id = ? AND fecha = ?';
        const [rows] = await db.query(query, [trabajador_id, fecha]);
        return rows.length > 0;
    }
};

module.exports = Staff;