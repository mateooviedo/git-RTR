async function cargarClientes() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/clientes/obtenerClientes');
        const clientes = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(clientes.mensaje || 'Error al cargar los clientes');
        }

        const cuerpoTabla = document.getElementById('cuerpoTabla');

        if (!cuerpoTabla) {
            throw new Error('No se encontró el tbody de la tabla de clientes.');
        }

        cuerpoTabla.innerHTML = '';

        clientes.forEach((cliente) => {
            const fila = document.createElement('tr');

            const tdNombre = document.createElement('td');
            tdNombre.textContent = cliente.nombre;
            fila.appendChild(tdNombre);

            const tdTelefono = document.createElement('td');
            tdTelefono.textContent = cliente.telefono;
            fila.appendChild(tdTelefono);

            const tdDireccion = document.createElement('td');
            tdDireccion.textContent = cliente.direccion || '';
            fila.appendChild(tdDireccion);

            const tdAcciones = document.createElement('td');

            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn-accion';
            btnEditar.innerHTML = '✏️';
            btnEditar.title = 'editar';
            btnEditar.onclick = () => editarCliente(cliente);

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-accion';
            btnEliminar.innerHTML = '🗑️';
            btnEliminar.title = 'eliminar';
            btnEliminar.onclick = () => eliminarCliente(cliente);

            tdAcciones.appendChild(btnEditar);
            tdAcciones.appendChild(btnEliminar);
            fila.appendChild(tdAcciones);

            cuerpoTabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Hubo un problema al cargar los clientes:', error);
    }
}

function editarCliente(cliente) {
    console.log('editar cliente:', cliente.nombre);
}

function eliminarCliente(cliente) {
    if (confirm(`¿Estás seguro de eliminar a ${cliente.nombre}?`)) {
        console.log(cliente.nombre, 'eliminado');
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);