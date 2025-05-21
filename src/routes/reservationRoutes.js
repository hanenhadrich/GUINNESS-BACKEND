import express from 'express';
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', getAllReservations);
router.post('/', createReservation);
router.put('/:reservationId', updateReservation);
router.delete('/:reservationId', deleteReservation);

export default router;
