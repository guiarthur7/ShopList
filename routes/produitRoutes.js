const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isAdmin } = require("../middleware/isAdmin.js");
const produitRoutes = require("../controllers/produitController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers image sont acceptés"));
    }
  },
});

router.get("/search", produitRoutes.getProduitByName);
router.get("/", produitRoutes.getAllProduits);
router.get("/:id", produitRoutes.getProduitById);
router.post(
  "/create",
  isAdmin,
  upload.single("image"),
  produitRoutes.createProduit,
);
router.put("/:id", isAdmin, produitRoutes.updateProduit);
router.delete("/:id", isAdmin, produitRoutes.deleteProduit);

module.exports = router;
