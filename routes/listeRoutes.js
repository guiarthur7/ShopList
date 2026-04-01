const express = require("express");
const router = express.Router();
const listeController = require("../controllers/listeController");
router.post("/see", listeController.getMaListe);
router.post("/add", listeController.addProduitToListe);
router.post("/del", listeController.deleteProduitToListe);
module.exports = router;
