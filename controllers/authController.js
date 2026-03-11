const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models");

exports.register = async (req, res) => {
  const username = req.query.username;
  const password = await bcrypt.hash(req.query.password, 10);
  const existingUser = await users.findOne({ where: { username } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Un utilisateur existe déjà avec ce nom" });
  }
  const secret = process.env.JWT_SECRET;
  const user = await users.create({ username, password });
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: "24h",
  });
  return res
    .status(201)
    .json({ message: "Utilisateur créé avec succès", token });
};

exports.login = async (req, res) => {};
