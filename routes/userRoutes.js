import express from "express";
import { register, login, logout, updateProfile } from '../controllers/usersController.js';
import checkAuth from "../middleware/checkauth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", checkAuth, updateProfile);

export default router;
