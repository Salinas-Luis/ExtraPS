const db = require('../config/db');

exports.registrarPersonal = async (req, res) => {
    const { usuario_id, habilidad } = req.body;
    try {
        await db.query(
            'INSERT INTO personal (usuario_id, habilidad, esta_activo) VALUES (?, ?, 1)',
            [usuario_id, habilidad]
        );
        res.json({ success: true, message: "Personal registrado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar personal." });
    }
};

exports.registrarAusencia = async (req, res) => {
    const { trabajador_id, fecha, motivo } = req.body;
    try {
        await db.query(
            'INSERT INTO ausencias (trabajador_id, fecha, motivo) VALUES (?, ?, ?)',
            [trabajador_id, fecha, motivo]
        );
        res.json({ success: true, message: "Ausencia registrada." });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar ausencia." });
    }
};