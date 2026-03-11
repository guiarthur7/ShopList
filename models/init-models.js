var DataTypes = require("sequelize").DataTypes;
var _liste = require("./liste");
var _produit = require("./produit");
var _role = require("./role");
var _users = require("./users");

function initModels(sequelize) {
  var liste = _liste(sequelize, DataTypes);
  var produit = _produit(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  liste.belongsTo(produit, { as: "id_produit_produit", foreignKey: "id_produit"});
  produit.hasMany(liste, { as: "listes", foreignKey: "id_produit"});
  users.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(users, { as: "users", foreignKey: "role_id"});
  liste.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(liste, { as: "listes", foreignKey: "id_user"});

  return {
    liste,
    produit,
    role,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
