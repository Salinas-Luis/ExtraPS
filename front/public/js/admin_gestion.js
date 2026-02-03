
document.getElementById('formEmpleado').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        usuario_id: document.getElementById('usuario_id').value,
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