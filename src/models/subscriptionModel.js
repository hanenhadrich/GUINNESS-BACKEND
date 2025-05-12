import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  adherent: { type: mongoose.Schema.Types.ObjectId, ref: 'Adherent', required: true }, 
  startDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  endDate: { type: Date, required: true },
  type: { type: String, enum: ['semaine', 'mois', 'an', 'autre'], required: true }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
