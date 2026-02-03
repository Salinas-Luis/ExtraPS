document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('usuario');
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const userNameSpan = document.getElementById('userName');

    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (guestNav) guestNav.classList.add('d-none'); 
            if (userNav) {
                userNav.classList.remove('d-none');
                userNav.classList.add('d-flex'); 
            }
            if (userNameSpan) userNameSpan.innerText = `Hola, ${user.nombre}`;
        } catch (e) {
            console.error("Error parseando usuario", e);
        }
    }
});