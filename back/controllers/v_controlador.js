const Service = require('../model/serviceModel');
const Appointment = require('../model/appointmentModel');

exports.validarCita = async (req, res, next) => {
    const { cliente_id, servicio_id, fecha, hora_inicio } = req.body;

    try {
        const fechaObj = new Date(fecha + 'T00:00:00'); 
        const diaSemana = fechaObj.getDay(); 
        if (diaSemana === 0 || diaSemana === 6) {
            return res.status(400).json({ error: "Solo se permiten citas en días laborales (Lunes a Viernes)." });
        }

        const servicio = await Service.getById(servicio_id);
        if (!servicio) return res.status(404).json({ error: "Servicio no encontrado." });

        const [horas, minutos] = hora_inicio.split(':').map(Number);
        const minutosInicio = (horas * 60) + minutos;
        const minutosFin = minutosInicio + servicio.duracion_minutos;

        if (minutosFin > 1140) { 
            return res.status(400).json({ error: "El servicio no puede completarse después de las 19:00." });
        }

        const horaFinStr = `${Math.floor(minutosFin / 60).toString().padStart(2, '0')}:${(minutosFin % 60).toString().padStart(2, '0')}:00`;
        req.body.hora_fin = horaFinStr;

        const tieneSolapamiento = await Appointment.checkClientOverlap(cliente_id, fecha, hora_inicio, hora_finStr);
        if (tieneSolapamiento) {
            return res.status(400).json({ error: "Ya tienes otra cita agendada que se cruza con este horario." });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: "Error en la validación del sistema." });
    }
};