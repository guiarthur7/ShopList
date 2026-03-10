// Configuration
const PORT = 8080;

// Import
const express = require("express");
const { sequelize, liste, produit, users } = require("./models");
const produitRoutes = require("./routes/produitRoutes");

// Test connexion base de données
sequelize
  .authenticate()
  .then(() => console.log("✅ Connexion MySQL OK"))
  .catch((err) => {
    console.error("❌ Erreur MySQL :", err);
    process.exit(1);
  });

// Initialisation serveur
const server = express();
server.use(express.json()); // Parser le JSON des requêtes
server.use("/api/produits", produitRoutes);

// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier public
server.use(express.static("public"));

// Démarrage serveur (UNE SEULE FOIS, à la fin)
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
