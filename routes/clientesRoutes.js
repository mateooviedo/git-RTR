const express = require('express');
const router = express.Router();
const {agregarCliente, buscarCliente} = require('../controllers/clientesControllers');

router.post('/agregarCliente', agregarCliente);
router.post('/buscarCliente', buscarCliente);

module.exports = router;