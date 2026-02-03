const Admin = require('../model/adminModel');
const db = require('../config/db'); 
const User = require('../model/userModel');

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
        res.status(500).json({ error: "Error al registrar personal: " });
    }
};

exports.registrarFalta = async (req, res) => {
    try {
        const { trabajador_id, fecha, motivo } = req.body;
        if (!trabajador_id || !fecha) {
            return res.status(400).json({ error: "Falta el ID del trabajador o la fecha." });
        }
        const [empleado] = await db.query('SELECT id FROM personal WHERE id = ?', [trabajador_id]);
        if (empleado.length === 0) {
            return res.status(404).json({ error: "El ID de personal no existe." });
        }
        const query = 'INSERT INTO ausencias (trabajador_id, fecha, motivo) VALUES (?, ?, ?)';
        await db.query(query, [trabajador_id, fecha, motivo]);

        res.json({ mensaje: "Ausencia registrada con éxito. El trabajador no recibirá citas ese día." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo registrar la ausencia." });
    }
};

exports.obtenerTableroCitas = async (req, res) => {
    try {
        const { fecha } = req.query; 

        const filtroFecha = fecha ? '?' : 'CURDATE()';

        const query = `
            SELECT 
                c.id AS cita_id,
                u_cliente.nombre_completo AS cliente,
                s.nombre AS servicio,
                u_staff.nombre_completo AS atendido_por,
                c.hora_inicio,
                c.hora_fin,
                c.estado
            FROM citas c
            JOIN usuarios u_cliente ON c.cliente_id = u_cliente.id
            JOIN servicios s ON c.servicio_id = s.id
            JOIN personal p ON c.trabajador_id = p.id
            JOIN usuarios u_staff ON p.usuario_id = u_staff.id
            WHERE c.fecha = ${filtroFecha}
            ORDER BY c.hora_inicio ASC
        `;

        const [rows] = await db.query(query, fecha ? [fecha] : []);
        res.json(rows);
    } catch (error) {
        console.error("Error en el reporte:", error);
        res.status(500).json({ error: "Error al cargar el tablero de citas." });
    }
};
exports.cancelarCitaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE citas SET estado = 'Cancelada' WHERE id = ?", [id]);
        res.json({ success: true, mensaje: "Cita cancelada correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar la cita." });
    }
};

exports.reasignarPersonal = async (req, res) => {
    try {
        const { cita_id, nuevo_trabajador_id } = req.body;
        await db.query("UPDATE citas SET trabajador_id = ? WHERE id = ?", [nuevo_trabajador_id, cita_id]);
        res.json({ success: true, mensaje: "Personal reasignado con éxito." });
    } catch (error) {
        res.status(500).json({ error: "Error al reasignar personal." });
    }
};
exports.obtenerListaClientes = async (req, res) => {
    try {
        const clientes = await User.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

exports.promoverAPersonal = async (req, res) => {
    try {
        const { usuario_id, habilidad } = req.body;
        await db.query('UPDATE usuarios SET rol_id = 3 WHERE id = ?', [usuario_id]);
        await db.query('INSERT INTO personal (usuario_id, habilidad, esta_activo) VALUES (?, ?, 1)', [usuario_id, habilidad]);
        
        res.json({ success: true, mensaje: "¡Usuario promovido a personal!" });
    } catch (error) {
        res.status(500).json({ error: "Error en la promoción" });
    }
};