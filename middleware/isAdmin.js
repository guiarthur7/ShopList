const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("MiddleWare isAdmin: Token manquant");
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("MiddleWare isAdmin: JWT_SECRET non défini dans l'environnement");
      return res.status(500).json({ error: "Erreur serveur (config)" });
    }

    const decoded = jwt.verify(token, secret);
    console.log("MiddleWare isAdmin - Decoded token:", decoded);

    if (decoded.role.toUpperCase() !== "ADMIN") {
      console.log(`MiddleWare isAdmin: Accès refusé pour le rôle ${decoded.role}`);
      return res.status(403).json({ error: "Accès refusé : vous n'êtes pas administrateur" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("MiddleWare isAdmin - Erreur JWT:", err.message);
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};
