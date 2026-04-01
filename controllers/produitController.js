const { produit } = require("../models");

exports.createProduit = async (req, res) => {
  console.log(req.body);
  const { name, prix } = req.body;
  const prod = await produit.create({ name: name, price: prix });

  if (prod) {
    res.status(201).json({ message: "Produit créer avec succès" });
  } else {
    res.status(404).json({ error: "Erreur lors de la création d'un produit" });
  }
};

exports.getAllProduits = async (req, res) => {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  const produits = await produit.findAll();
  const paginationProduit = produits.slice(offset, offset + limit);
  if (paginationProduit.length === 0) {
    res.status(404).json({ error: "Il n'y a plus de produit à afficher" });
  } else {
    res.json(paginationProduit);
  }
};

exports.getProduitByName = async (req, res) => {
  const search = req.query.search;
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  let resultats = [];
  let produits = await produit.findAll();
  produits.forEach((element) => {
    if (element.name === search) resultats.push(element);
  });
  if (resultats.length === 0) {
    resultats = produits;
  }
  const paginationResultats = resultats.slice(offset, offset + limit);
  res.json(paginationResultats);
};

exports.deleteProduit = async (req, res) => {
  deleted = await produit.destroy({ where: { id: req.params.id } });
  if (deleted) {
    res.status(200).json("Produit supprimé avec succès");
  } else {
    res.status(404).json("Problème lors de la suppresion");
  }
};
