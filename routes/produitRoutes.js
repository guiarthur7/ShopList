const express = require("express");
const router = express.Router();
const produitRoutes = require("../controllers/produitController");
router.get("/", produitRoutes.getProduitByName);
router.delete("/:id", produitRoutes.deleteProduit);
router.post("/create", produitRoutes.createProduit);
module.exports = router;
