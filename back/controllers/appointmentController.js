console.log("¡El archivo appointmentController.js se cargó correctamente!"); // Si no ves esto al reiniciar, el error es la ruta
const Staff = require('../model/staffModel');
const db = require('../config/db');

const sanitizeHTML = (str) => str ? str.replace(/<[^>]*>?/gm, '') : ''; 
const sanitizeNumbers = (str) => str ? str.replace(/\D/g, '') : '';

async function buscarAlternativas(fecha, habilidadRequerida) {
    const bloquesPosibles = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];
    const sugerencias = [];

    const personalApto = await Staff.findBySkill(habilidadRequerida);

    for (const hora of bloquesPosibles) {
        const h_fin = calcularHoraFinTemporal(hora, 60); 
        
        for (const emp of personalApto) {
            const tieneAusencia = await Staff.checkAbsence(emp.id, fecha);
            if (tieneAusencia) continue;

            const [ocupado] = await db.query(
                `SELECT id FROM citas WHERE trabajador_id = ? AND fecha = ? 
                 AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?))`,
                [emp.id, fecha, h_fin, hora, hora, h_fin]
            );

            if (ocupado.length === 0) {
                if (!sugerencias.includes(hora)) sugerencias.push(hora);
                break; 
            }
        }
        if (sugerencias.length >= 3) break; 
    }
    return sugerencias;
}

function calcularHoraFinTemporal(inicio, minutos) {
    const [h, m] = inicio.split(':').map(Number);
    const total = (h * 60) + m + minutos;
    return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}:00`;
}

exports.asignarYCrearCita = async (req, res) => {
    let { cliente_id, servicio_id, fecha, hora_inicio, hora_fin } = req.body;

    fecha = sanitizeHTML(fecha);
    hora_inicio = sanitizeHTML(hora_inicio);
    hora_fin = sanitizeHTML(hora_fin);

    if (!cliente_id || !servicio_id || !fecha || !hora_inicio || !hora_fin) {
        return res.status(400).json({ error: "Faltan datos necesarios para agendar la cita." });
    }

    try {
        const fechaObj = new Date(fecha);
        const diaSemana = fechaObj.getUTCDay(); 
        if (diaSemana === 0 || diaSemana === 6) {
            return res.status(400).json({ error: "El salón solo opera de Lunes a Viernes." });
        }

        const horaH = parseInt(hora_inicio.split(':')[0]);
        if (horaH < 8 || horaH >= 19) {
            return res.status(400).json({ error: "El horario de servicio es de 08:00 a 19:00." });
        }

        const [serv] = await db.query('SELECT categoria FROM servicios WHERE id = ?', [servicio_id]);
        if (serv.length === 0) return res.status(404).json({ error: "Servicio no encontrado" });
        
        const categoria = serv[0].categoria;
        let habilidadRequerida = 'Ayudante';
        const serviciosCabello = ['Corte', 'Tinte', 'Peinado', 'Planchado'];
        
        if (serviciosCabello.includes(categoria)) {
            habilidadRequerida = 'Estilista';
        }

        const [candidatos] = await db.query(
            'SELECT id FROM personal WHERE habilidad = ? AND esta_activo = 1', 
            [habilidadRequerida]
        );
        
        if (candidatos.length === 0) {
            return res.status(400).json({ error: `No hay personal registrado como: ${habilidadRequerida}` });
        }

        let trabajadorElegido = null;
        let menorCarga = Infinity;

        for (const emp of candidatos) {
            const [ausencia] = await db.query(
                'SELECT id FROM ausencias WHERE trabajador_id = ? AND fecha = ?', 
                [emp.id, fecha]
            );
            if (ausencia.length > 0) continue;

            const [ocupado] = await db.query(
                `SELECT id FROM citas WHERE trabajador_id = ? AND fecha = ? 
                 AND (hora_inicio < ? AND hora_fin > ?)`,
                [emp.id, fecha, hora_fin, hora_inicio]
            );

            if (ocupado.length === 0) {
                const [conteo] = await db.query(
                    'SELECT COUNT(*) as total FROM citas WHERE trabajador_id = ? AND fecha = ?', 
                    [emp.id, fecha]
                );

                if (conteo[0].total < menorCarga) {
                    menorCarga = conteo[0].total;
                    trabajadorElegido = emp.id;
                }
            }
        }

        if (!trabajadorElegido) {
            return res.status(400).json({ error: "No hay personal disponible en este horario." });
        }

        await db.query(
            `INSERT INTO citas (cliente_id, trabajador_id, servicio_id, fecha, hora_inicio, hora_fin, estado) 
             VALUES (?, ?, ?, ?, ?, ?, 'Confirmada')`,
            [cliente_id, trabajadorElegido, servicio_id, fecha, hora_inicio, hora_fin]
        );

        res.status(201).json({ 
            success: true, 
            message: "Cita confirmada exitosamente.",
            trabajador_id: trabajadorElegido 
        });

    } catch (error) {
        console.error("ERROR EN ASIGNACIÓN:", error);
        res.status(500).json({ error: "Error interno al asignar personal." });
    }
};
exports.obtenerCitasPorCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                c.id, 
                DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha, 
                c.hora_inicio, 
                c.hora_fin, 
                c.estado,
                s.nombre AS servicio_nombre,
                u.nombre_completo AS trabajador_nombre
            FROM citas c
            JOIN servicios s ON c.servicio_id = s.id
            JOIN personal p ON c.trabajador_id = p.id
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE c.cliente_id = ?
            ORDER BY c.fecha DESC
        `;
        const [rows] = await db.query(query, [id]);
        res.json(rows); 
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "Error al obtener las citas." });
    }
};