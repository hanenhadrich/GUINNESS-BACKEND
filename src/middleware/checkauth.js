const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assurez-vous que le chemin d'importation de votre modèle User est correct

const checkAuth = async (req, res, next) => {
  try {
    // Vérification si le token existe dans les en-têtes
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Authorization header must be in the format "Bearer <token>"' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided, authorization denied" });
    }

    // Décoder le token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); // Pour débogage (à retirer en production)

    // Extraire le userId du payload du token
    const userId = decodedToken.userId;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid token, user does not exist" });
    }

    // Ajouter l'utilisateur à la requête pour un accès facile dans les routes suivantes
    req.user = user;

    // Passer au middleware suivant
    next();

  } catch (error) {
    // Gestion des erreurs liées au token (invalidité ou expiration)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired, please login again" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token, authorization denied" });
    }

    console.error(error);
    return res.status(500).json({ error: "Something went wrong with the authentication" });
  }
};

module.exports = checkAuth;
