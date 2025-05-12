import express from 'express';
import {
  getAllAdherents,
  createAdherent,
  updateAdherent,
  deleteAdherent
} from '../controllers/adherentController.js';
import checkAuth from '../middleware/checkauth.js';




const router = express.Router();


router.get('/', getAllAdherents);
//avec controle
router.post('/', checkAuth, createAdherent);
router.put('/:adherentId', checkAuth, updateAdherent);
router.delete('/:adherentId', checkAuth, deleteAdherent);

export default router;
