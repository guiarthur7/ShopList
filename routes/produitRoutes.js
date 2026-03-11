const express = require("express");
const router = express.Router();
const produitRoutes = require("../controllers/produitController");
router.get("/", produitRoutes.getProduitByName);
router.delete("/:id", produitRoutes.deleteProduit);
module.exports = router;
