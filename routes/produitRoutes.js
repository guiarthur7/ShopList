const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/isAdmin.js");
const produitRoutes = require("../controllers/produitController");

router.get("/search", produitRoutes.getProduitByName);
router.get("/", produitRoutes.getAllProduits);
router.get("/:id", produitRoutes.getProduitById);
router.post("/create", isAdmin, produitRoutes.createProduit);
router.put("/:id", isAdmin, produitRoutes.updateProduit);
router.delete("/:id", isAdmin, produitRoutes.deleteProduit);

module.exports = router;
