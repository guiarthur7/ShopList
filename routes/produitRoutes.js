const express = require("express");
const router = express.Router();
const produitRoutes = require("../controllers/produitController");

router.get("/search", produitRoutes.getProduitByName);
router.get("/", produitRoutes.getAllProduits);
router.post("/create", produitRoutes.createProduit);
router.delete("/:id", produitRoutes.deleteProduit);

module.exports = router;
