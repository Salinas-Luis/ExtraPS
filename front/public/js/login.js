document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        correo: document.getElementById('correo').value,
        contrasena: document.getElementById('password').value
    };

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(result.user));
        
        if (result.user.rol_id === 1) {
            window.location.href = '/admin/dashboard';
        } else if (result.user.rol_id === 2) {
            window.location.href = '/cliente/dashboard';
        } else {
            window.location.href = '/personal/agenda';
        }
    } else {
        alert('Error: ' + result.error);
    }
});