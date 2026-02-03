
document.getElementById('formEmpleado').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        usuario_id: document.getElementById('select-empleado').value,
        habilidad: document.getElementById('habilidad').value
    };

    const response = await fetch('/api/admin/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Personal dado de alta correctamente");
        e.target.reset();
    } else {
        const res = await response.json();
        alert("Error: " + res.error);
    }
});

document.getElementById('formAusencia').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        trabajador_id: document.getElementById('trabajador_id').value,
        fecha: document.getElementById('fechaFalta').value,
        motivo: document.getElementById('motivo').value
    };

    const response = await fetch('/api/admin/ausencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Ausencia registrada. La agenda ha sido bloqueada para este trabajador en esa fecha");
        e.target.reset();
    } else {
        alert("Error al registrar la ausencia.");
    }
});

document.querySelector('.btn-danger').addEventListener('click', async () => {
    const data = {
        trabajador_id: document.querySelector('input[placeholder="6"]').value, 
        fecha: document.querySelector('input[type="date"]').value,
        motivo: document.querySelector('input[placeholder="xd"]').value
    };

    const response = await fetch('/api/admin/ausencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.mensaje || result.error);
});
async function llenarListaUsuarios() {
    try {
        const res = await fetch('/api/admin/lista-clientes');
        
        if (!res.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const usuarios = await res.json();
        const select = document.getElementById('select-empleado');

        if (Array.isArray(usuarios)) {
            select.innerHTML = usuarios.map(u => 
                `<option value="${u.id}">${u.nombre_completo}</option>`
            ).join('');
        } else {
            select.innerHTML = '<option value="">No hay clientes disponibles</option>';
        }
    } catch (error) {
        console.error("Fallo al cargar la lista:", error);
        document.getElementById('select-empleado').innerHTML = '<option value="">Error al cargar</option>';
    }
}

document.addEventListener('DOMContentLoaded', llenarListaUsuarios);