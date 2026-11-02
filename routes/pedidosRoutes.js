const express = require('express');
const router = express.Router();
const { obtenerPedidos, agregarPedido, eliminarPedido } = require('../controllers/pedidosControllers');

router.get('/obtenerPedidos', obtenerPedidos);
router.post('/agregarPedido', agregarPedido);
router.delete('/eliminarPedido/:id', eliminarPedido);

module.exports = router;