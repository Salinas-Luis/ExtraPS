const db = require('../config/db');

const Admin = {
    createStaff: async (usuario_id, habilidad) => {
        const query = 'INSERT INTO personal (usuario_id, habilidad, esta_activo) VALUES (?, ?, 1)';
        const [result] = await db.query(query, [usuario_id, habilidad]);
        return result;
    },

    createAbsence: async (trabajador_id, fecha, motivo) => {
        const query = 'INSERT INTO ausencias (trabajador_id, fecha, motivo) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [trabajador_id, fecha, motivo]);
        return result;
    }
};

module.exports = Admin;