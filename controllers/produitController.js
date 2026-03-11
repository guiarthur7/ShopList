const { produit } = require("../models");

exports.createProduit = async (req, res) => {};

exports.getAllProduits = async (req, res) => {
  const produits = await produit.findAll();
  res.json(produits);
};

exports.getProduitByName = async (req, res) => {
  const search = req.query.search;
  let resultats = [];
  let produits = await produit.findAll();
  produits.forEach((element) => {
    if (element.name === search) resultats.push(element);
  });
  if (resultats.length === 0) {
    resultats = produits;
  }
  res.json(resultats);
};

exports.deleteProduit = async (req, res) => {
  deleted = await produit.destroy({ where: { id: req.params.id } });
  if (deleted) {
    res.status(200).json("Produit supprimé avec succès");
  } else {
    res.status(404).json("Problème lors de la suppresion");
  }
};
