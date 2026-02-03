
document.addEventListener('DOMContentLoaded', async () => {
    const listaServicios = document.getElementById('lista-servicios');
    if (!localStorage.getItem('usuario')) {
            window.location.href = '/login';
        }
    try {
        const response = await fetch('/api/services');
        const servicios = await response.json();

        servicios.forEach(s => {
            const card = document.createElement('div');
            card.className = 'col-md-6';
            card.innerHTML = `
                <div class="card h-100 service-card border-0 shadow-sm" onclick="seleccionarServicio(${s.id}, '${s.nombre}', this)">
                    <div class="card-body">
                        <h5 class="fw-bold">${s.nombre}</h5>
                        <p class="text-muted small">${s.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-soft-primary text-primary">${s.duracion_minutos} min</span>
                            <span class="fw-bold text-dark">$${s.precio}</span>
                        </div>
                    </div>
                </div>
            `;
            listaServicios.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando servicios:", error);
    }
});

function seleccionarServicio(id, nombre, elemento) {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('border-primary', 'border-2'));
    elemento.classList.add('border-primary', 'border-2');
    
    document.getElementById('servicio_id').value = id;
    document.getElementById('btnAgendar').disabled = false;
}

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    const data = {
        cliente_id: usuario.id,
        servicio_id: document.getElementById('servicio_id').value,
        fecha: document.getElementById('fecha').value,
        hora_inicio: document.getElementById('hora_inicio').value,
        hora_fin: calcularHoraFin(document.getElementById('hora_inicio').value, 60) 
    };

    const response = await fetch('/api/appointments/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        alert("¡Cita confirmada!");
        window.location.href = '/cliente/dashboard';
    } else {
        if (result.sugerencias) {
            mostrarSugerencias(result.sugerencias);
        } else {
            alert("Error: " + result.error);
        }
    }
});

function mostrarSugerencias(lista) {
    const container = document.getElementById('sugerencias-container');
    const listaSug = document.getElementById('lista-sugerencias');
    container.classList.remove('d-none');
    listaSug.innerHTML = '';

    lista.forEach(hora => {
        const item = document.createElement('button');
        item.className = 'list-group-item list-group-item-action text-primary';
        item.textContent = `Disponible a las ${hora}`;
        item.onclick = () => {
            document.getElementById('hora_inicio').value = hora;
            container.classList.add('d-none');
        };
        listaSug.appendChild(item);
    });
}

function calcularHoraFin(inicio, minutos) {
    const [h, m] = inicio.split(':').map(Number);
    const total = (h * 60) + m + minutos;
    return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}:00`;
}