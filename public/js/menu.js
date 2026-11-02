let listaMenuGlobal = [];

async function cargarMenu() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/menu/obtenerMenu');
        const platos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(platos.mensaje || 'Error al cargar el menu');
        }

        listaMenuGlobal = platos;
        mostrarMenu(listaMenuGlobal);

    } catch (error) {
        console.error('Hubo un problema al cargar el menu:', error);
    }
}

function mostrarMenu(platosAMostrar) {
    const cuerpoTabla = document.querySelector('.cuerpoTabla');

    if (!cuerpoTabla) {
        throw new Error('No se encontro el tbody de la tabla del menu');
    }

    cuerpoTabla.innerHTML = '';

    if (platosAMostrar.length === 0) {
        const fila = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No se encontreon platos';
        td.textContent = 'No se encontraron platos.';
        td.style.textAlign = 'center';
        fila.appendChild(td);
        cuerpoTabla.appendChild(fila);
        return;
    }

    platosAMostrar.forEach((plato) => {
        const fila = document.createElement('tr');

        // Nombre
        const tdNombre = document.createElement('td');
        tdNombre.textContent = plato.nombre;
        fila.appendChild(tdNombre);

        // Precio
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = `$${plato.precio}`;
        fila.appendChild(tdPrecio);

        // Disponible (Checkbox basado en tinyint 1/0)
        const tdDisponible = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = plato.activo === 1;
        checkbox.onchange = () => cambiarEstadoPlato(plato.idMenu, checkbox.checked);
        tdDisponible.appendChild(checkbox);
        fila.appendChild(tdDisponible);

        // Acciones (Modificar y Eliminar)
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn-accion';
        btnEditar.innerHTML = '✏️';
        btnEditar.title = 'Modificar';
        btnEditar.onclick = () => editarPlato(plato);

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-accion';
        btnEliminar.innerHTML = '🗑️';
        btnEliminar.title = 'Eliminar';
        btnEliminar.onclick = () => eliminarPlato(plato);

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
        fila.appendChild(tdAcciones);

        cuerpoTabla.appendChild(fila);
    });
}

function editarPlato(plato) {
    const params = new URLSearchParams({
        id: plato.idMenu,
        nombre: plato.nombre,
        descripcion: plato.descripcion || '',
        precio: plato.precio,
        imagen: plato.imagen || ''
    });

    window.location.href = `menunuevo.html?${params.toString()}`;
}

async function eliminarPlato(plato) {
    if (confirm(`¿Estás seguro de eliminar el plato "${plato.nombre}"?`)) {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/menu/eliminarPlato/${plato.idMenu}`, {
                method: 'DELETE'
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || 'No se pudo eliminar el plato');
            }

            cargarMenu();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('Hubo un error al intentar eliminar el plato.');
        }
    }
}

async function cambiarEstadoPlato(id, activoBool) {
    const activo = activoBool ? 1 : 0;
    try {
        await fetch(`http://localhost:8080/api/menu/actualizarEstado/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo })
        });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
    }
}

// Inicialización y Buscador en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();

    const inputSearch = document.getElementById('search');

    if (inputSearch) {
        inputSearch.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();

            const platosFiltrados = listaMenuGlobal.filter(plato => {
                const nombre = plato.nombre ? plato.nombre.toLowerCase() : '';
                const descripcion = plato.descripcion ? plato.descripcion.toLowerCase() : '';

                return nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
            });

            mostrarMenu(platosFiltrados);
        });
    }
});