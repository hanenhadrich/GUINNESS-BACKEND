// validators/reclamationValidator.js
import Joi from "joi";

export const reclamationValidator = Joi.object({
  nom: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères.",
    "string.empty": "Le nom est obligatoire.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "any.required": "Le nom est obligatoire.",
  }),
  prenom: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères.",
    "string.empty": "Le prénom est obligatoire.",
    "string.min": "Le prénom doit contenir au moins 2 caractères.",
    "any.required": "Le prénom est obligatoire.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "L’email doit être une adresse email valide.",
    "any.required": "L’email est obligatoire.",
  }),
  telephone: Joi.string().pattern(/^(?:\+?\d{1,3})?[-.\s]?(\(?\d+\)?[-.\s]?)*$/).required().messages({
    "string.pattern.base": "Le numéro de téléphone n’est pas valide.",
    "any.required": "Le numéro de téléphone est obligatoire.",
  }),
  sujet: Joi.string().trim().min(3).max(150).required().messages({
    "string.base": "Le sujet doit être une chaîne de caractères.",
    "string.empty": "Le sujet est obligatoire.",
    "string.min": "Le sujet doit contenir au moins 3 caractères.",
    "any.required": "Le sujet est obligatoire.",
  }),
  details: Joi.string().trim().min(10).required().messages({
    "string.base": "Les détails doivent être une chaîne de caractères.",
    "string.empty": "Les détails sont obligatoires.",
    "string.min": "Les détails doivent contenir au moins 10 caractères.",
    "any.required": "Les détails sont obligatoires.",
  }),
  statut: Joi.string().valid("en_attente", "en_cours", "résolue").optional(),
});
