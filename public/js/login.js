const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // evita que la pagina se recargue

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // llamar al endpoint correcto (puerto por defecto 3000)
            const respuesta = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                // redirigir a la pantalla dashboard (misma carpeta `public`)
                window.location.href = 'dashboard.html';
            } else {
                alert(data.mensaje || 'Error al iniciar sesión');
            }

        } catch (error) {
            console.error('error de red o conexion', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}