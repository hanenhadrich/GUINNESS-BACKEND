import express from 'express';
import {
  getAllAdherents,
  createAdherent,
  updateAdherent,
  deleteAdherent
} from '../controllers/adherentController.js';

const router = express.Router();


router.get('/', getAllAdherents);
router.post('/', createAdherent);
router.put('/:adherentId', updateAdherent);
router.delete('/:adherentId', deleteAdherent);

export default router;
