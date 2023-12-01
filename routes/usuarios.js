const express = require("express");
const router = express.Router();
const UsuariosController = require('../controllers/usuarios-controller')

router.post("/login", UsuariosController.getUsuarios);
router.post("/cadastro", UsuariosController.postUsuario);

module.exports = router;
