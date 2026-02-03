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
    },
    updateRol: async (usuario_id, nuevo_rol) => {
        try {
            const query = 'UPDATE usuarios SET rol_id = ? WHERE id = ?';
            await db.query(query, [nuevo_rol, usuario_id]);
            return true;
        } catch (error) {
            throw error;
        }
    },
obtenerClientes: async () => {
        try {
            const [rows] = await db.query('SELECT id, nombre_completo FROM usuarios WHERE rol_id = 2');
            return rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = User;