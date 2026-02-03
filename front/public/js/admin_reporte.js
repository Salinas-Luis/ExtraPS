async function generarReporte() {
    const fecha = document.getElementById('fechaReporte').value;
    const tabla = document.getElementById('tabla-reporte');

    if (!fecha) {
        alert("Por favor, selecciona una fecha válida.");
        return;
    }

    try {
        const response = await fetch(`/api/admin/tablero-citas?fecha=${fecha}`);
        const citas = await response.json();

        tabla.innerHTML = ""; 

        if (citas.length === 0) {
            tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay citas registradas para este día.</td></tr>`;
            return;
        }

        citas.forEach(cita => {
const fila = `
                    <tr>
                        <td>${cita.hora_inicio}</td>
                        <td>${cita.cliente}</td>
                        <td>${cita.servicio}</td>
                        <td>${cita.atendido_por}</td>
                        <td><span class="badge bg-success">${cita.estado}</span></td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="abrirModalReasignar(${cita.cita_id})">Reasignar</button>
                            <button class="btn btn-sm btn-danger" onclick="confirmarCancelacion(${cita.cita_id})">Cancelar</button>
                        </td>
                    </tr>
                `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al obtener el reporte:", error);
        tabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar los datos.</td></tr>`;
    }
}

async function confirmarCancelacion(id) {
    if (confirm("¿Estás seguro de cancelar esta cita por contingencia?")) {
        const res = await fetch(`/api/admin/cancelar-cita/${id}`, { method: 'PUT' });
        const data = await res.json();
        if (data.success) {
            alert(data.mensaje);
            generarReporte(); 
        }
    }
}

function abrirModalReasignar(id) {
    const nuevoId = prompt("Ingresa el ID del nuevo personal (ver tabla de personal):");
    if (nuevoId) {
        ejecutarReasignacion(id, nuevoId);
    }
}

async function ejecutarReasignacion(citaId, trabajadorId) {
    const res = await fetch('/api/admin/reasignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cita_id: citaId, nuevo_trabajador_id: trabajadorId })
    });
    const data = await res.json();
    if (data.success) {
        alert(data.mensaje);
        generarReporte();
    }
}
document.addEventListener('DOMContentLoaded', generarReporte);