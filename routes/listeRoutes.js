// Routes pour les listes

const express = require("express");
const router = express.Router();
// TODO: Importer listeController
// TODO: Importer authMiddleware pour protéger les routes

// Toutes ces routes nécessitent d'être connecté
// Ajouter authMiddleware.verifyToken avant chaque route

// POST /api/listes - Créer une liste
// GET /api/listes - Récupérer toutes les listes
// GET /api/listes/:id - Récupérer une liste
// PUT /api/listes/:id - Modifier une liste
// DELETE /api/listes/:id - Supprimer une liste

module.exports = router;
