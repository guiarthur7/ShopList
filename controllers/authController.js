const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models");
const { role } = require("../models");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await users.findOne({ where: { username } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Un utilisateur existe déjà avec ce nom" });
  }
  const secret = process.env.JWT_SECRET;
  const roles = await role.findOne({ where: { name: "USER" } });
  if (!roles) {
    return res.status(404).json("Erreur lors de l'attribution du rôle");
  }
  const user = await users.create({
    username,
    password: hashedPassword,
    role_id: roles.id,
  });
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: "24h",
  });
  return res
    .status(201)
    .json({ message: "Utilisateur créé avec succès", token });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await users.findOne({ where: { username } });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Utilisateur ou mot de passe incorrect" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res
      .status(400)
      .json({ error: "Utilisateur ou mot de passe incorrect" });
  }
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: "24h",
  });
  return res
    .status(200)
    .json({ message: "Utilisateur connecté avec succès", token });
};
