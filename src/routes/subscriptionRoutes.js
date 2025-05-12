import express from 'express';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} from '../controllers/subscriptionController.js';

const router = express.Router();

// ⚠️ Enlève le préfixe `/subscriptions`
router.get('/', getAllSubscriptions);
router.post('/', createSubscription);
router.put('/:subscriptionId', updateSubscription);
router.delete('/:subscriptionId', deleteSubscription);

export default router;
