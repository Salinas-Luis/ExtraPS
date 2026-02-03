document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        correo: document.getElementById('correo').value,
        password: document.getElementById('password').value
    };

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result.user)
    if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(result.user));
        
        if (result.user.rol === 1) {
            window.location.href = '/admin/gestion';
        } else if (result.user.rol === 2) {
            window.location.href = '/cliente/dashboard';
        } else {
            window.location.href = '/personal/agenda';
        }
    } else {
        alert('Error: ' + result.error);
    }
});