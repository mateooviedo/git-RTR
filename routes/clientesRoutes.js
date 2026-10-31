const express = require('express');
const router = express.Router();
const {agregarCliente, buscarCliente, obtenerClientes, eliminarCliente, actualizarCliente} = require('../controllers/clientesControllers');

router.post('/agregarCliente', agregarCliente);
router.post('/buscarCliente', buscarCliente);
router.get('/obtenerClientes', obtenerClientes);
router.delete('/eliminarCliente/:id', eliminarCliente);
router.put('/actualizarCliente/:id', actualizarCliente);

module.exports = router;