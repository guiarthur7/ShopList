const express = require("express");
const router = express.Router();
const produitRoutes = require("../controllers/produitController");

router.get("/search", produitRoutes.getProduitByName);
router.get("/", produitRoutes.getAllProduits);
router.get("/:id", produitRoutes.getProduitById);
router.post("/create", produitRoutes.createProduit);
router.put("/:id", produitRoutes.updateProduit);
router.delete("/:id", produitRoutes.deleteProduit);

module.exports = router;
