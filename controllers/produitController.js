const { produit, liste } = require("../models");

exports.createProduit = async (req, res) => {
  try {
    console.log(req.body);
    const { name, prix } = req.body;
    const prod = await produit.create({ name: name, price: prix });

    if (prod) {
      res.status(201).json({ message: "Produit créé avec succès", id: prod.id });
    } else {
      res.status(400).json({ error: "Erreur lors de la création d'un produit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la création" });
  }
};

exports.getAllProduits = async (req, res) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const produits = await produit.findAll();
    const paginationProduit = produits.slice(offset, offset + limit);
    if (paginationProduit.length === 0 && offset > 0) {
      res.status(404).json({ error: "Il n'y a plus de produit à afficher" });
    } else {
      res.json(paginationProduit);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getProduitByName = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    await liste.destroy({ where: { id_produit: id } });
    const deleted = await produit.destroy({ where: { id: id } });
    if (deleted) {
      res.status(200).json({ message: "Produit supprimé avec succès" });
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

exports.getProduitById = async (req, res) => {
  try {
    const prod = await produit.findByPk(req.params.id);
    if (prod) {
      res.json(prod);
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateProduit = async (req, res) => {
  try {
    const { name, price } = req.body;
    const updated = await produit.update(
      { name, price },
      { where: { id: req.params.id } },
    );
    if (updated[0] > 0) {
      res.json({ message: "Produit mis à jour avec succès" });
    } else {
      res.status(404).json({ error: "Erreur lors de la mise à jour ou produit non trouvé" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
