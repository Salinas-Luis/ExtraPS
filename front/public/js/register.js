document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre_completo: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        telefono: document.getElementById('telefono').value,
        contrasena: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            window.location.href = '/login';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
});