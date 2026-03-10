const express = require("express");
const router = express.Router();
const produitRoutes = require("../controllers/produitController");
router.get("/", produitRoutes.getProduitByName);
module.exports = router;
