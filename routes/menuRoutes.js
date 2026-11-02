const express = require('express');
const router = express.Router();
const multer = require('multer');
const menuController = require('../controllers/menuControllers');

// Configuración de Multer para guardar las imágenes en la carpeta 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Renombramos el archivo con un timestamp para evitar nombres duplicados
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Definición de las rutas del menú
router.get('/obtenerMenu', menuController.obtenerMenu);

// Usamos 'upload.single("imagen")' en los endpoints que reciben el archivo desde el formulario
router.post('/agregarPlato', upload.single('imagen'), menuController.agregarPlato);
router.put('/actualizarPlato/:id', upload.single('imagen'), menuController.actualizarPlato);

router.put('/actualizarEstado/:id', menuController.actualizarEstado);
router.delete('/eliminarPlato/:id', menuController.eliminarPlato);

module.exports = router;