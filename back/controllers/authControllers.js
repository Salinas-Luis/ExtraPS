const User = require('../model/userModel');

exports.register = async (req, res) => {
    const { nombre_completo, correo, telefono, password } = req.body;
    try {
        await User.create({ nombre_completo, correo, telefono, password, rol_id: 2 });
        res.status(201).json({ success: true, message: "Registro exitoso" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar: " + error.message });
    }
};

exports.login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await User.findByEmail(correo);

        if (user && user.password === password) {
            res.json({
                success: true,
                user: { id: user.id, nombre: user.nombre_completo, rol: user.rol_id }
            });
        } else {
            res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
};