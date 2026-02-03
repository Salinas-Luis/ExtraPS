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
        const [serv] = await db.query('SELECT categoria FROM servicios WHERE id = ?', [servicio_id]);
        if (serv.length === 0) return res.status(404).json({ error: "Servicio no encontrado" });
        
        const categoria = serv[0].categoria;

        let habilidadRequerida = 'Ayudante';
        const serviciosCabello = ['Corte', 'Tinte', 'Peinado', 'Planchado'];
        
        if (serviciosCabello.includes(categoria)) {
            habilidadRequerida = 'Estilista';
        }

        const candidatos = await Staff.findBySkill(habilidadRequerida);
        
        let trabajadorElegido = null;
        let menorCarga = Infinity;

        for (const emp of candidatos) {
            const tieneAusencia = await Staff.checkAbsence(emp.id, fecha);
            if (tieneAusencia) continue;

            const [ocupado] = await db.query(
                `SELECT id FROM citas WHERE trabajador_id = ? AND fecha = ? 
                 AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?))`,
                [emp.id, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin]
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
            const alternativas = await buscarAlternativas(fecha, habilidadRequerida);
            return res.status(400).json({ 
                error: "No hay personal disponible en este horario.",
                sugerencias: alternativas 
            });
        }

        await db.query(
            `INSERT INTO citas (cliente_id, trabajador_id, servicio_id, fecha, hora_inicio, hora_fin, estado) 
             VALUES (?, ?, ?, ?, ?, ?, 'Confirmada')`,
            [cliente_id, trabajadorElegido, servicio_id, fecha, hora_inicio, hora_fin]
        );

        res.status(201).json({ 
            success: true, 
            message: "Cita confirmada exitosamente.",
            detalles: {
                fecha: fecha,
                hora: hora_inicio,
                trabajador_id: trabajadorElegido 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno al asignar personal." });
    }
};