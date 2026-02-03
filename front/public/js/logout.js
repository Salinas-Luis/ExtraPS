function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/login';
}

