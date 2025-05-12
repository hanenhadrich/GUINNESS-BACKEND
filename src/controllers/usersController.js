import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { registerValidator, loginValidator } from '../validators/userValidator.js';

// Inscription
export const register = async (req, res) => {
    try {
        const validationResult = registerValidator.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json(validationResult);
        }

        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ error: 'An account with this email exists already' });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password
        });

        await user.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Connexion
export const login = async (req, res) => {
    try {
        const validationResult = loginValidator.validate(req.body, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json(validationResult);
        }

        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with this email:", email);
            return res.status(401).json({ error: 'Wrong email and/or password' });
        }

        // Comparaison des mots de passe
        const passwordsMatch = await user.comparePassword(password);
        console.log("Password match result:", passwordsMatch);

        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Wrong email and/or password' });
        }

        const userData = user.toObject();
        delete userData.password;

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: `Welcome ${user.firstName}`,
            user: userData,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
