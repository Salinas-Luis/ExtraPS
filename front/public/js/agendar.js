
let servicioSeleccionado = null;

document.addEventListener('DOMContentLoaded', async () => {
    const listaServicios = document.getElementById('lista-servicios');
    const inputFecha = document.getElementById('fecha');

    if (!localStorage.getItem('usuario')) {
        window.location.href = '/login';
        return;
    }

    if (inputFecha) {
        inputFecha.addEventListener('change', (e) => {
            const fecha = new Date(e.target.value);
            const dia = fecha.getUTCDay(); 
            if (dia === 0 || dia === 6) {
                alert("Lo sentimos, Brillo y Estilo solo atiende de Lunes a Viernes.");
                e.target.value = "";
            }
        });
    }

    try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Error al obtener servicios');
        
        const servicios = await response.json();

        if (listaServicios) {
            listaServicios.innerHTML = ''; 
            servicios.forEach(s => {
                const card = document.createElement('div');
                card.className = 'col-md-6';
                card.innerHTML = `
                    <div class="card h-100 service-card border-0 shadow-sm p-3" 
                         onclick="seleccionarServicio(this, ${s.id}, '${s.nombre}', ${s.precio}, ${s.duracion_minutos})">
                        <div class="card-body">
                            <h5 class="fw-bold">${s.nombre}</h5>
                            <p class="text-muted small">${s.descripcion || 'Servicio profesional de estética.'}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <span class="badge bg-light text-primary">⏱ ${s.duracion_minutos} min</span>
                                <span class="fw-bold text-dark">$${s.precio}</span>
                            </div>
                        </div>
                    </div>
                `;
                listaServicios.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error cargando servicios:", error);
        if (listaServicios) {
            listaServicios.innerHTML = '<p class="text-danger text-center">Error al conectar con la base de datos.</p>';
        }
    }
});

function seleccionarServicio(elemento, id, nombre, precio, duracion) {
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('border-primary', 'border-2', 'bg-light');
    });

    elemento.classList.add('border-primary', 'border-2', 'bg-light');

    servicioSeleccionado = { id, nombre, precio, duracion };
    
    const inputId = document.getElementById('servicio_id');
    const resumenContainer = document.getElementById('resumen-seleccion');
    const resumenTexto = document.getElementById('nombre-servicio-resumen');
    const btn = document.getElementById('btnAgendar');

    if (inputId) inputId.value = id;
    if (resumenTexto) resumenTexto.innerText = `${nombre} ($${precio})`;
    if (resumenContainer) resumenContainer.classList.remove('d-none');
    if (btn) btn.disabled = false;
}

const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = JSON.parse(localStorage.getItem('usuario'));
        
        if (!servicioSeleccionado) {
            alert("Por favor selecciona un servicio primero.");
            return;
        }

        const data = {
            cliente_id: usuario.id,
            servicio_id: servicioSeleccionado.id,
            trabajador_id: servicioSeleccionado.id === 1 ? 1 : 2, 
            fecha: document.getElementById('fecha').value,
            hora_inicio: document.getElementById('hora_inicio').value,
            hora_fin: calcularHoraFin(document.getElementById('hora_inicio').value, servicioSeleccionado.duracion)
        };

        try {
            const response = await fetch('/api/appointments/agendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("¡Cita confirmada exitosamente!");
                window.location.href = '/cliente/dashboard'; 
            } else {
                const result = await response.json();
                alert("Error: " + (result.error || "No se pudo agendar la cita."));
            }
        } catch (error) {
            console.error("Error al agendar:", error);
            alert("Hubo un problema de conexión con el servidor.");
        }
    });
}

function calcularHoraFin(inicio, minutos) {
    if (!inicio) return "";
    const [h, m] = inicio.split(':').map(Number);
    const total = (h * 60) + m + minutos;
    const finH = Math.floor(total / 60).toString().padStart(2, '0');
    const finM = (total % 60).toString().padStart(2, '0');
    return `${finH}:${finM}:00`;
}