document.addEventListener('DOMContentLoaded', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return window.location.href = '/login';

    const response = await fetch(`/api/appointments/cliente/${usuario.id}`);
    const citas = await response.json();

    const contenedor = document.getElementById('contenedor-citas');

    if (citas.length === 0) {
        contenedor.innerHTML = '<p class="text-center mt-5">Aún no tienes citas agendadas.</p>';
        return;
    }

citas.forEach(cita => {
    // Limpiamos la fecha si viene con el formato T06:00:00
    const fechaLimpia = cita.fecha.split('T')[0];

    contenedor.innerHTML += `
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="fw-bold">${cita.servicio_nombre}</h5>
                        <span class="badge ${cita.estado === 'Confirmada' ? 'bg-success' : 'bg-info'}">${cita.estado}</span>
                    </div>
                    <p class="mb-1 text-muted">📅 ${fechaLimpia}</p>
                    <p class="mb-0 text-muted">⏰ ${cita.hora_inicio} - ${cita.hora_fin}</p>
                    <hr>
                    <small class="text-secondary">Atendido por: <strong>${cita.trabajador_nombre}</strong></small>
                </div>
            </div>
        </div>
    `;
});
});