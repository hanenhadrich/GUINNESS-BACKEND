
import mongoose from "mongoose";

const reclamationSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      match: [/.+@.+\..+/, "Format d'email invalide"],
      lowercase: true,
    },
    telephone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
      match: [/^(?:\+?\d{1,3})?[-.\s]?(\(?\d+\)?[-.\s]?)*$/, "Numéro de téléphone invalide"],
      trim: true,
    },
    sujet: {
      type: String,
      required: [true, "Le sujet est obligatoire"],
      trim: true,
    },
    details: {
      type: String,
      required: [true, "Les détails sont obligatoires"],
      trim: true,
    },
    dateSoumission: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["en_attente", "en_cours", "résolue"],
      default: "en_attente",
    },
    isRead: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

export default mongoose.model("Reclamation", reclamationSchema);
