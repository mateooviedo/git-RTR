const express = require('express');
const router = express.Router();
const {agregarCliente, obtenerClientes, eliminarCliente, actualizarCliente} = require('../controllers/clientesControllers');

router.post('/agregarCliente', agregarCliente);
router.get('/obtenerClientes', obtenerClientes);
router.delete('/eliminarCliente/:id', eliminarCliente);
router.put('/actualizarCliente/:id', actualizarCliente);

module.exports = router;