const User = require('../model/userModel');


const sanitizeHTML = (str) => str ? str.replace(/<[^>]*>?/gm, '') : ''; 
const sanitizeNumbers = (str) => str ? str.replace(/\D/g, '') : '';

exports.register = async (req, res) => {
    let { nombre_completo, correo, telefono, contrasena } = req.body;

    const nombreLimpio = sanitizeHTML(nombre_completo).trim();
    const correoLimpio = sanitizeHTML(correo).trim();
    const telefonoLimpio = sanitizeNumbers(telefono);

    if (!nombreLimpio || !correoLimpio || !telefonoLimpio || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios y deben ser válidos." });
    }

    if (!correoLimpio.includes('@')) {
        return res.status(400).json({ error: "El formato del correo no es válido." });
    }

    if (telefonoLimpio.length < 8) {
        return res.status(400).json({ error: "El teléfono debe tener al menos 8 dígitos." });
    }

    try {
        await User.create({ 
            nombre_completo: nombreLimpio, 
            correo: correoLimpio, 
            telefono: telefonoLimpio, 
            password: contrasena, 
            rol_id: 2 
        });

        res.status(201).json({ success: true, message: "Registro exitoso y seguro." });
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

