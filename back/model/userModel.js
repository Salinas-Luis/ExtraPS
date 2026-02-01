const db = require('../config/db');

const User = {
    create: async (userData) => {
        const { nombre_completo, correo, telefono, password, rol_id } = userData;
        const query = `
            INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [nombre_completo, correo, telefono, password, rol_id]);
        return result;
    },

    findByEmail: async (correo) => {
        const query = `
            SELECT id, nombre_completo, correo, password, rol_id 
            FROM usuarios 
            WHERE correo = ?
        `;
        const [rows] = await db.query(query, [correo]);
        return rows[0]; 
    }
};

module.exports = User;