
async function generarReporte() {
    const fechaInput = document.getElementById('fechaReporte');
    const tabla = document.getElementById('tabla-reporte');
    
    if (!fechaInput.value) return;

    try {
        const response = await fetch(`/api/admin/dashboard-general?fecha=${fechaInput.value}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener los datos del servidor');
        }

        const citas = await response.json();

        tabla.innerHTML = '';

        if (citas.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay citas registradas para este día.</td></tr>';
            return;
        }

        citas.forEach(c => {
            const fila = `
                <tr>
                    <td><strong>${c.hora_inicio} - ${c.hora_fin}</strong></td>
                    <td>${c.cliente}</td>
                    <td>${c.servicio}</td>
                    <td>
                        <span class="badge bg-secondary">${c.tipo_personal}</span> 
                        ${c.trabajador}
                    </td>
                    <td>
                        <span class="badge ${obtenerColorEstado(c.estado)}">${c.estado}</span>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error en el reporte:", error);
        alert("No se pudo cargar el reporte diario.");
    }
}

function obtenerColorEstado(estado) {
    const colores = {
        'Confirmada': 'bg-primary',
        'En Curso': 'bg-info',
        'Completada': 'bg-success',
        'No Show': 'bg-danger',
        'Cancelada': 'bg-secondary'
    };
    return colores[estado] || 'bg-dark';
}

document.addEventListener('DOMContentLoaded', generarReporte);