let clientesGlobal = [];
let menuGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosIniciales();

    // Filtro de clientes en tiempo real
    const inputSearchCliente = document.getElementById('searchCliente');
    if (inputSearchCliente) {
        inputSearchCliente.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            const filtrados = clientesGlobal.filter(c =>
                `${c.nombre || ''} ${c.telefono || ''}`.toLowerCase().includes(texto)
            );
            renderizarClientes(filtrados);
        });
    }

    document.getElementById('btnGuardarPedido').addEventListener('click', guardarPedido);
});

async function cargarDatosIniciales() {
    try {
        // Cargar Clientes
        const resClientes = await fetch('http://localhost:8080/api/clientes/obtenerClientes');
        clientesGlobal = await resClientes.json();
        renderizarClientes(clientesGlobal);

        // Cargar Menú
        const resMenu = await fetch('http://localhost:8080/api/menu/obtenerMenu'); // Ajusta la ruta si difiere
        menuGlobal = await resMenu.json();
        renderizarMenuPedidos(menuGlobal);

    } catch (error) {
        console.error('Error al cargar datos para el nuevo pedido:', error);
    }
}

function renderizarClientes(clientes) {
    const contenedor = document.getElementById('contenedorClientes');
    contenedor.innerHTML = '';

    if (clientes.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron clientes.</p>';
        return;
    }

    clientes.forEach(cliente => {
        const div = document.createElement('div');
        div.style.marginBottom = '5px';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'clienteSeleccionado';
        radio.value = cliente.id || cliente.id_cliente;
        radio.id = `cliente_${cliente.id || cliente.id_cliente}`;

        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = ` ${cliente.nombre} (${cliente.telefono || 'Sin teléfono'})`;
        label.style.marginLeft = '8px';

        div.appendChild(radio);
        div.appendChild(label);
        contenedor.appendChild(div);
    });
}

function renderizarMenuPedidos(menu) {
    const tbody = document.getElementById('cuerpoTablaMenuPedidos');
    tbody.innerHTML = '';

    menu.forEach(plato => {
        const fila = document.createElement('tr');

        // Checkbox de selección
        const tdCheck = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'plato-check';
        checkbox.dataset.id = plato.idMenu || plato.id_plato;
        checkbox.dataset.precio = plato.precio;
        checkbox.addEventListener('change', calcularTotal);
        tdCheck.appendChild(checkbox);
        fila.appendChild(tdCheck);

        // Nombre del plato
        const tdNombre = document.createElement('td');
        tdNombre.textContent = plato.nombre || plato.nombre_plato;
        fila.appendChild(tdNombre);

        // Precio
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = `$${Number(plato.precio).toFixed(2)}`;
        fila.appendChild(tdPrecio);

        // Input de cantidad
        const tdCantidad = document.createElement('td');
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = '1';
        inputCantidad.value = '1';
        inputCantidad.style.width = '60px';
        inputCantidad.className = 'plato-cantidad';
        inputCantidad.disabled = true; // Desactivado hasta que marque el checkbox
        inputCantidad.addEventListener('input', calcularTotal);
        
        // Habilitar/deshabilitar input según checkbox
        checkbox.addEventListener('change', () => {
            inputCantidad.disabled = !checkbox.checked;
            if(!checkbox.checked) inputCantidad.value = '1';
            calcularTotal();
        });

        tdCantidad.appendChild(inputCantidad);
        fila.appendChild(tdCantidad);

        tbody.appendChild(fila);
    });
}

function calcularTotal() {
    let totalGeneral = 0;
    const filas = document.querySelectorAll('#cuerpoTablaMenuPedidos tr');

    filas.forEach(fila => {
        const checkbox = fila.querySelector('.plato-check');
        const inputCantidad = fila.querySelector('.plato-cantidad');

        if (checkbox && checkbox.checked) {
            const precio = parseFloat(checkbox.dataset.precio) || 0;
            const cantidad = parseInt(inputCantidad.value) || 1;
            totalGeneral += precio * cantidad;
        }
    });

    document.getElementById('totalGeneralPedido').textContent = totalGeneral.toFixed(2);
}

async function guardarPedido() {
    // 1. Obtener cliente seleccionado
    const clienteRadio = document.querySelector('input[name="clienteSeleccionado"]:checked');
    if (!clienteRadio) {
        alert('Por favor, selecciona un cliente.');
        return;
    }
    const id_cliente = clienteRadio.value;

    // 2. Obtener platos seleccionados y sus cantidades
    const itemsPedido = [];
    const filas = document.querySelectorAll('#cuerpoTablaMenuPedidos tr');

    filas.forEach(fila => {
        const checkbox = fila.querySelector('.plato-check');
        const inputCantidad = fila.querySelector('.plato-cantidad');

        if (checkbox && checkbox.checked) {
            itemsPedido.push({
                id_plato: checkbox.dataset.id,
                cantidad: parseInt(inputCantidad.value) || 1,
                precio_unitario: parseFloat(checkbox.dataset.precio)
            });
        }
    });

    if (itemsPedido.length === 0) {
        alert('Debes seleccionar al menos un plato para el pedido.');
        return;
    }

    const payload = {
        id_cliente,
        items: itemsPedido,
        total: parseFloat(document.getElementById('totalGeneralPedido').textContent)
    };

    try {
        const respuesta = await fetch('http://localhost:8080/api/pedidos/agregarPedido', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultado = await respuesta.json();
        if (!respuesta.ok) throw new Error(resultado.mensaje || 'Error al guardar pedido');

        alert('Pedido registrado con éxito');
        window.location.href = 'pedidos.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al guardar el pedido.');
    }
}