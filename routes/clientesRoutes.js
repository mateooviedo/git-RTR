const express = require('express');
const router = express.Router();
const {agregarCliente, buscarCliente, obtenerClientes} = require('../controllers/clientesControllers');

router.post('/agregarCliente', agregarCliente);
router.post('/buscarCliente', buscarCliente);
router.get('/obtenerClientes', obtenerClientes);

module.exports = router;