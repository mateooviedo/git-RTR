let listaPedidosGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarPedidos();

    const inputSearch = document.getElementById('search');
    if (inputSearch) {
        inputSearch.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase().trim();
            const pedidosFiltrados = listaPedidosGlobal.filter(p => {
                const cliente = p.cliente ? p.cliente.toLowerCase() : '';
                const plato = p.plato ? p.plato.toLowerCase() : '';
                return cliente.includes(textoBusqueda) || plato.includes(textoBusqueda);
            });
            mostrarPedidos(pedidosFiltrados);
        });
    }
});

async function cargarPedidos() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/pedidos/obtenerPedidos'); // Asegúrate que tu ruta backend coincida
        const pedidos = await respuesta.json();
        
        if (!respuesta.ok) throw new Error(pedidos.mensaje || 'Error al obtener pedidos');

        listaPedidosGlobal = pedidos;
        mostrarPedidos(listaPedidosGlobal);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

function mostrarPedidos(pedidos) {
    const cuerpoTabla = document.getElementById('cuerpoTablaPedidos');
    cuerpoTabla.innerHTML = '';

    if (pedidos.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td colspan="5" style="text-align: center;">No se encontraron pedidos.</td>`;
        cuerpoTabla.appendChild(fila);
        return;
    }

    pedidos.forEach(p => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${p.cliente || ''}</td>
            <td>${p.plato || ''}</td>
            <td>${p.cantidad || 0}</td>
            <td>${p.fechaPedido ? new Date(p.fechaPedido).toLocaleString('es-AR') : ''}</td>
            <td>$${Number(p.total || 0).toFixed(2)}</td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}