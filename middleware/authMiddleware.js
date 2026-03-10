// Middleware pour vérifier l'authentification JWT

// TODO: Importer jsonwebtoken

// Middleware pour protéger les routes
exports.verifyToken = (req, res, next) => {
  // TODO: Récupérer le token depuis les headers (Authorization: Bearer TOKEN)
  // TODO: Vérifier si le token existe
  // TODO: Vérifier si le token est valide avec jwt.verify()
  // TODO: Si valide, ajouter les infos user à req.user
  // TODO: Appeler next() pour continuer
  // TODO: Si invalide, retourner une erreur 401
};
