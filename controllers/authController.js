const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users, role } = require("../models");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const secret = process.env.JWT_SECRET;

  const existingUser = await users.findOne({ where: { username } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Un utilisateur existe déjà avec ce nom" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = await role.findOne({ where: { name: "USER" } });

  if (!userRole) {
    return res
      .status(404)
      .json({ error: "Erreur lors de l'attribution du rôle" });
  }

  const user = await users.create({
    username,
    password: hashedPassword,
    role_id: userRole.id,
  });

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: userRole.name,
    },
    secret,
    { expiresIn: "24h" },
  );

  return res
    .status(201)
    .json({ message: "Utilisateur créé avec succès", token });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const secret = process.env.JWT_SECRET;

  const user = await users.findOne({
    where: { username },
    include: [{ model: role, as: "role" }],
  });

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

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role ? user.role.name : "USER",
    },
    secret,
    { expiresIn: "24h" },
  );

  return res
    .status(200)
    .json({ message: "Utilisateur connecté avec succès", token });
};
