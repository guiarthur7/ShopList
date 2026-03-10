const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('liste', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    id_produit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'produit',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'liste',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "id_produit",
        using: "BTREE",
        fields: [
          { name: "id_produit" },
        ]
      },
    ]
  });
};
