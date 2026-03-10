require("dotenv").config();
const Sequelize = require("sequelize");
const initModels = require("./init-models");

// Configuration de la connexion à la base de données depuis .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  },
);

// Initialisation des modèles
const models = initModels(sequelize);

// Export de l'instance sequelize + tous les modèles
module.exports = {
  sequelize,
  ...models,
};
