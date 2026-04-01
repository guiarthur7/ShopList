const { users, liste, produit } = require("../models");

exports.addProduitToListe = async (req, res) => {
  console.log(req.body);
  try {
    const { username, idProduit } = req.body;

    if (!username || !idProduit) {
      return res
        .status(400)
        .json({ error: "username et idProduit sont obligatoires" });
    }

    const user = await users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const newItem = await liste.create({
      id_user: user.id,
      id_produit: idProduit,
    });

    return res.status(201).json({
      message: "Produit ajoute a la liste",
      item: newItem,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

exports.deleteProduitToListe = async (req, res) => {
  try {
    const { username, idProduit } = req.body;

    if (!username || !idProduit) {
      return res
        .status(400)
        .json({ error: "username et idProduit sont obligatoires" });
    }

    const user = await users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const itemToDelete = await liste.findOne({
      where: { id_produit: idProduit },
      include: [
        {
          model: users,
          as: "id_user_user",
          where: { id: user.id },
          attributes: ["id"],
        },
      ],
    });

    await itemToDelete.destroy();
    return res.status(200).json({ message: "Produit supprime avec succes" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

exports.getMaListe = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username est obligatoire" });
    }

    const user = await users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const maListe = await liste.findAll({
      where: { id_user: user.id },
      include: [
        {
          model: produit,
          as: "id_produit_produit",
          attributes: ["id", "name", "price"],
        },
      ],
    });

    return res.status(200).json(maListe);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};
