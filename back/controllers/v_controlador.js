const Service = require('../model/serviceModel');
const Appointment = require('../model/appointmentModel');

exports.validarCita = async (req, res, next) => {
    console.log("== PASO 1: ENTRANDO AL VALIDADOR ==");
    const { cliente_id, servicio_id, fecha, hora_inicio } = req.body;

    try {
        const fechaObj = new Date(fecha.replace(/-/g, '\/')); 
        if (fechaObj.getDay() === 0 || fechaObj.getDay() === 6) {
            return res.status(400).json({ error: "Solo se permiten días laborales." });
        }

        const servicio = await Service.getById(servicio_id);
        if (!servicio) return res.status(404).json({ error: "Servicio no encontrado." });

        const [h, m] = hora_inicio.split(':').map(Number);
        const minutosInicio = (h * 60) + m;
        const duracion = servicio.duracion_minutos || 60;
        const minutosFin = minutosInicio + duracion;

        const h_f = Math.floor(minutosFin / 60).toString().padStart(2, '0');
        const m_f = (minutosFin % 60).toString().padStart(2, '0');
        const hora_fin_generada = `${h_f}:${m_f}:00`;

        console.log("== PASO 2: CHECANDO SOLAPAMIENTO ==");
        const tieneSolapamiento = await Appointment.checkClientOverlap(cliente_id, fecha, hora_inicio, hora_fin_generada);
        
        if (tieneSolapamiento) {
            return res.status(400).json({ error: "Ya tienes otra cita en este horario." });
        }

        req.body.hora_fin = hora_fin_generada;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            error: "Error interno en validación", 
            detalles: err.message 
        });
    }
};