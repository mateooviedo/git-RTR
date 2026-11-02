let listaClientesGlobal = [];

async function cargarClientes() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/clientes/obtenerClientes');
        const clientes = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(clientes.mensaje || 'Error al cargar los clientes');
        }

        listaClientesGlobal = clientes;
        mostrarClientes(listaClientesGlobal);

    } catch (error) {
        console.error('Hubo un problema al cargar los clientes:', error);
    }
}

function mostrarClientes(clientesAMostrar) {
        const cuerpoTabla = document.getElementById('cuerpoTabla');

        if (!cuerpoTabla) {
            throw new Error('No se encontró el tbody de la tabla de clientes.');
        }

        cuerpoTabla.innerHTML = '';

        if (clientesAMostrar.length === 0) {
            const fila = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4;
            td.textContent = 'No se encontraron clientes.';
            td.style.textAlign = 'center';
            fila.appendChild(fila);
            return;
        }

        clientesAMostrar.forEach((cliente) => {
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
}

function editarCliente(cliente) {
    //codificamos los datos para enviarlos de foma segura por la URL
    const params = new URLSearchParams({
        id: cliente.id,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion || ''
    });

    //redirigimos a la misma vista de agregar, pero pasand los datos
    window.location.href = `clientesnuevo.html?${params.toString()}`;
}

async function eliminarCliente(cliente) {
    if (confirm(`¿Estás seguro de eliminar a ${cliente.nombre}?`)) {
        try{
            const respuesta = await fetch(`http://localhost:8080/api/clientes/eliminarCliente/${cliente.id}`, {
                method: 'DELETE'
            });

            const resultado = await respuesta.json();

            if(!respuesta.ok) {
                throw new Error(resultado.mensaje || 'No se pudo eliminar el cliente');
            }

            console.log(resultado.mensaje);

            cargarClientes();

        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Hubo un error al intentar eliminar el cliente.');
        }
    }
}

// inicializacion y eventos
document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();

    //capturamos el imput de busqueda en tiempo real
    const inputSearch = document.getElementById('search');

    if (inputSearch) {
        inputSearch.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();

            //filtramos la lista global buscando coincidencias en nombre, telefono o direccion
            const clientesFiltrados = listaClientesGlobal.filter(cliente => {
                const nombre = cliente.nombre ? cliente.nombre.toLowerCase() : '';
                const telefono = cliente.telefono ? cliente.telefono.toLowerCase() : '';
                const direccion = cliente.direccion ? cliente.direccion.toLowerCase() : '';

                return nombre.includes(textoBusqueda) ||
                    telefono.includes(textoBusqueda) ||
                    direccion.includes(textoBusqueda);
            });

            //actualizamos la tabla de forma instantanea con los filtros
            mostrarClientes(clientesFiltrados);
        });
    }
});