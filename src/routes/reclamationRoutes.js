// routes/reclamationRoutes.js
import express from 'express';
import {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  deleteReclamation,
  markReclamationAsRead 
} from '../controllers/reclamationController.js';

const router = express.Router();

router.post('/', createReclamation);
router.get('/', getAllReclamations);
router.get('/:id', getReclamationById);
router.delete('/:id', deleteReclamation);
router.patch('/:id/read', markReclamationAsRead);
export default router;
