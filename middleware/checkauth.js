import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware d'authentification
const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Vérifie si le header Authorization est présent et bien formaté
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "En-tête d'autorisation manquant ou mal formé" });
    }

    // Récupère le token depuis le header
    const token = authHeader.split(" ")[1];

    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifie si l'utilisateur existe dans la base de données
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Stocke l'ID de l'utilisateur dans la requête
    req.user = { userId: decoded.userId };

    
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré, veuillez vous reconnecter" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalide, accès refusé" });
    }
    return res.status(500).json({ error: "Erreur lors de l'authentification" });
  }
};

export default checkAuth;
