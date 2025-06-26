// authController.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { registerValidator, loginValidator } from '../validators/userValidator.js';

export const register = async (req, res) => {
  try {
    // Valider les champs
    const { error } = registerValidator.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        errors: error.details.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {})
      });
    }

    const { firstName, lastName, email, password, telephone } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Création du nouvel utilisateur
    const user = new User({ firstName, lastName, email, password, telephone });
    await user.save();

    res.status(201).json({ message: 'Account created successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
        }, {})
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Wrong email and/or password' });
    }

    const passwordsMatch = await user.comparePassword(password);
    if (!passwordsMatch) {
      return res.status(401).json({ error: 'Wrong email and/or password' });
    }

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: `Welcome ${user.firstName}`, user: userData, token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
