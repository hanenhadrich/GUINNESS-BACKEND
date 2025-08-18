import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { registerValidator, loginValidator, updateProfileValidator } from "../validators/userValidator.js";


export const register = async (req, res) => {
  try {
    // 	La validation n'arrête pas dès la première erreur trouvée et affiche toutes les erreurs
    const { error } = registerValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }

    const { firstName, lastName, email, password, telephone } = req.body;
// l'email OU le téléphone correspond
    const existingUser = await User.findOne({ $or: [{ email }, { telephone }] });
    if (existingUser) {
      return res.status(409).json({ error: "Un compte avec cet email ou téléphone existe déjà" });
    }

    const user = new User({ firstName, lastName, email, password, telephone });
    await user.save();

    return res.status(201).json({ message: "Compte créé avec succès" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email et/ou mot de passe incorrect" });
    }

    const passwordsMatch = await user.comparePassword(password);
    if (!passwordsMatch) {
      return res.status(401).json({ error: "Email et/ou mot de passe incorrect" });
    }

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: `Bienvenue ${user.firstName}`, user: userData, token });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const { error } = updateProfileValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {}),
      });
    }

    const { firstName, lastName, email, telephone, password } = req.body;

   
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(409).json({ error: "Un compte avec cet email existe déjà" });
      user.email = email;
    }

        if (telephone && telephone !== user.telephone) {
      const phoneExists = await User.findOne({ telephone });
      if (phoneExists) return res.status(409).json({ error: "Un compte avec ce téléphone existe déjà" });
      user.telephone = telephone;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (password) user.password = password; // sera hashé par pre-save hook

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({ message: "Profil mis à jour avec succès", user: updatedUser });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};