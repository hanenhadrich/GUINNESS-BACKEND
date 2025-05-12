import mongoose from 'mongoose';


const adherentSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    dateInscription: { type: Date, default: Date.now },
    actif: { type: Boolean, default: true }
  },
  { timestamps: true }
);


const Adherent = mongoose.model('Adherent', adherentSchema);
export default Adherent;
