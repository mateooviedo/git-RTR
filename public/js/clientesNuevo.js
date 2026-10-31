async function guardarCliente() {
    const nombre = document.getElementById('add-cliente').value.trim();
    const telefono = document.getElementById('add-telefono').value.trim();
    const direccion = document.getElementById('add-direccion').value.trim();

    if (!nombre || !telefono || !direccion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:8080/api/clientes/agregarCliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, telefono, direccion })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'No se pudo guardar el cliente');
        }

        alert(resultado.mensaje);

        window.location.href = 'clientes.html';

    } catch (error) {
        console.error('Error al agregar cliente:', error);
        alert('Hubo un error al intentar guardar el cliente.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //capturamos los parametros de la URL
    const urlparams = new URLSearchParams(window.location.search);
    const id = urlparams.get('id');
    const nombre = urlparams.get('nombre');
    const telefono = urlparams.get('telefono');
    const direccion = urlparams.get('direccion');

    //si existe un id, significa que estamos editando
    if (id) {
        //cambiamos el titulo o la etiqueta principal
        document.querySelector('.main label[for="add-cliente"]').textContent = 'Editar cliente';

        //rellenamos los inputs con los datos existentes
        document.getElementById('add-cliente').value = nombre || '';
        document.getElementById('add-telefono').value = telefono || '';
        document.getElementById('add-direccion').value = direccion || '';

        //cambiamos la accion del boton guardar para que actualice en lugar de crear 
        const btnGuardar = document.querySelector('.agregar-nuevo');
        btnGuardar.textContent = 'Actualizar';
        btnGuardar.onclick = () => enviarActualizacion(id);
    } else {
        //si no hay id, funciona como un guardar normal
        document.querySelector('.agregar-nuevo').onclick = guardarCliente;
    }
});

//funcion para evitar los datos modificados al backend (PUT)
async function enviarActualizacion(id) {
    const nombre = document.getElementById('add-cliente').value.trim();
    const telefono = document.getElementById('add-telefono').value.trim();
    const direccion = document.getElementById('add-direccion').value.trim();

    if (!nombre || !telefono || !direccion) {
        alert('por favor, completa todos campos');
        return;
    }

    try {
        const respuesta = await fetch(`http://localhost:8080/api/clientes/actualizarCliente/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, telefono, direccion })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'no se pudo actualizar el cliente');
        }

        alert(resultado.mensaje);
        window.location.href = 'clientes.html';

    } catch (error) {
        console.error('error al actualizar:', error);
        alert('Hubo un error al intentar actualizar');
    }
}