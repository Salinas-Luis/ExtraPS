const db = require('../config/db');

const Service = {
    getAll: async () => {
        const query = 'SELECT id, nombre, descripcion, duracion_minutos, precio, categoria FROM servicios';
        const [rows] = await db.query(query);
        return rows;
    },

    getById: async (id) => {
        const query = 'SELECT * FROM servicios WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }
};

module.exports = Service;