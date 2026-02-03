
document.getElementById('fechaFiltro').addEventListener('change', cargarAgenda);

async function cargarAgenda() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const fecha = document.getElementById('fechaFiltro').value;
    const tabla = document.getElementById('tabla-agenda');

    const response = await fetch(`/api/staff/mi-agenda?trabajador_id=${usuario.id}&fecha=${fecha}`);
    const citas = await response.json();

    tabla.innerHTML = '';
    citas.forEach(cita => {
        tabla.innerHTML += `
            <tr>
                <td>${cita.hora_inicio} - ${cita.hora_fin}</td>
                <td>${cita.cliente}</td>
                <td>${cita.servicio}</td>
                <td><span class="badge bg-info">${cita.estado}</span></td>
                <td>
                    <select class="form-select form-select-sm" onchange="cambiarEstado(${cita.id}, this.value)">
                        <option value="">Cambiar...</option>
                        <option value="En Curso">En Curso</option>
                        <option value="Completada">Completada</option>
                        <option value="No Show">No Show</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

async function cambiarEstado(cita_id, nuevo_estado) {
    if (!nuevo_estado) return;

    const response = await fetch('/api/staff/actualizar-cita', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cita_id, nuevo_estado })
    });

    if (response.ok) {
        alert("Estado actualizado");
        cargarAgenda();
    }
}

cargarAgenda();