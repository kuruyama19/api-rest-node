const express = require("express");
const router = express.Router();
const login = require("../middleware/login");
const ProdutosController = require('../controllers/produtos-controller')
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Math.round(Math.random() * 200) + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/",ProdutosController.getAllProdutos);
router.post("/",login.obrigatorio, upload.single("produto_imagem"));
router.get("/:id_produto", ProdutosController.getOneProduto);
router.patch("/",login.obrigatorio,ProdutosController.updateProduto);
router.delete("/", login.obrigatorio,ProdutosController.deleteProduto);

module.exports = router;
