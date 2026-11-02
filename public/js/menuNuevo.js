async function guardarPlato() {
    const nombre = document.getElementById('nombreplato').value.trim();
    const descripcion = document.getElementById('descripcionplato').value.trim();
    const precio = document.getElementById('precioplato').value.trim();
    const imagenInput = document.getElementById('imagen');

    if (!nombre || !precio || imagenInput.files.length === 0) {
        alert('Por favor, completa el nombre, el precio y selecciona una imagen.');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('imagen', imagenInput.files[0]);

    try {
        const respuesta = await fetch('http://localhost:8080/api/menu/agregarPlato', {
            method: 'POST',
            body: formData // Con FormData no se define Content-Type manual, fetch lo autogestiona
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No se pudo guardar el plato');
        }

        alert(resultado.mensaje);
        window.location.href = 'menu.html';

    } catch (error) {
        console.error('Error al agregar plato:', error);
        alert('Hubo un error al intentar guardar el plato.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlparams = new URLSearchParams(window.location.search);
    const id = urlparams.get('id');
    const nombre = urlparams.get('nombre');
    const descripcion = urlparams.get('descripcion');
    const precio = urlparams.get('precio');

    if (id) {
        // Cambiar título o etiqueta si lo deseas
        document.querySelector('.main').querySelector('label').textContent = 'Editar Plato';

        // Rellenar datos
        document.getElementById('nombreplato').value = nombre || '';
        document.getElementById('descripcionplato').value = descripcion || '';
        document.getElementById('precioplato').value = precio || '';
        
        // Al editar, la imagen puede ser opcional o requerida según prefieras; quitamos el required temporalmente si ya tiene una
        document.getElementById('imagen').removeAttribute('required');

        const btnGuardar = document.querySelector('.agregar-nuevo');
        btnGuardar.textContent = 'Actualizar';
        btnGuardar.onclick = () => enviarActualizacion(id);
    } else {
        document.querySelector('.agregar-nuevo').onclick = guardarPlato;
    }
});

async function enviarActualizacion(id) {
    const nombre = document.getElementById('nombreplato').value.trim();
    const descripcion = document.getElementById('descripcionplato').value.trim();
    const precio = document.getElementById('precioplato').value.trim();
    const imagenInput = document.getElementById('imagen');

    if (!nombre || !precio) {
        alert('Por favor, completa al menos el nombre y el precio.');
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    
    // Si seleccionó una nueva imagen, la agregamos; si no, el backend conservará la anterior
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }

    try {
        const respuesta = await fetch(`http://localhost:8080/api/menu/actualizarPlato/${id}`, {
            method: 'PUT',
            body: formData
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No se pudo actualizar el plato');
        }

        alert(resultado.mensaje);
        window.location.href = 'menu.html';

    } catch (error) {
        console.error('Error al actualizar:', error);
        alert('Hubo un error al intentar actualizar el plato.');
    }
}