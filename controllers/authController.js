// Controller pour l'authentification (login, register)

// TODO: Importer bcrypt pour hasher les mots de passe
// TODO: Importer jsonwebtoken pour créer les tokens JWT
// TODO: Importer le modèle users

// Fonction pour l'inscription (register)
exports.register = async (req, res) => {
  // TODO: Récupérer username et password depuis req.body
  // TODO: Vérifier si l'utilisateur existe déjà
  // TODO: Hasher le mot de passe avec bcrypt
  // TODO: Créer l'utilisateur dans la base de données
  // TODO: Retourner une réponse de succès
};

// Fonction pour la connexion (login)
exports.login = async (req, res) => {
  // TODO: Récupérer username et password depuis req.body
  // TODO: Chercher l'utilisateur dans la base de données
  // TODO: Vérifier si l'utilisateur existe
  // TODO: Comparer le mot de passe avec bcrypt
  // TODO: Créer un token JWT
  // TODO: Retourner le token au client
};
