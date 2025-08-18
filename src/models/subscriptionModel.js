import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  adherent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Adherent', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: false, 
  },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: "La date de fin doit être supérieure ou égale à la date de début"
    }
  },
  type: { 
    type: String, 
    enum: ['semaine', 'mois', 'an', 'autre'], 
    required: true,
    default: 'autre'
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
}, { timestamps: true });

// Index utile pour requêtes par adhérent et période
subscriptionSchema.index({ adherent: 1, startDate: 1, endDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
