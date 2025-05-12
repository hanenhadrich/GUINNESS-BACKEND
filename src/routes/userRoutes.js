import express from 'express';
import { register, login } from '../controllers/usersController.js';

const router = express.Router();

// Routes pour l'inscription et la connexion
router.post('/register', register);
router.post('/login', login);

export default router;
