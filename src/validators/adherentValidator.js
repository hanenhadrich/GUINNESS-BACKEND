import Joi from 'joi';

export const adherentValidator = Joi.object({
  nom: Joi.string().required().min(2).max(20).messages({
    'string.base': 'Le nom doit être une chaîne de caractères.',
    'string.empty': 'Le nom est requis.',
    'string.min': 'Le nom doit avoir au moins 2 caractères.',
    'string.max': 'Le nom doit avoir au maximum 20 caractères.',
  }),
  prenom: Joi.string().required().min(2).max(20).messages({
    'string.base': 'Le prénom doit être une chaîne de caractères.',
    'string.empty': 'Le prénom est requis.',
    'string.min': 'Le prénom doit avoir au moins 2 caractères.',
    'string.max': 'Le prénom doit avoir au maximum 20 caractères.',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'L\'email doit être une chaîne de caractères.',
    'string.email': 'L\'email doit être valide.',
    'string.empty': 'L\'email est requis.',
  }),
  telephone: Joi.string().pattern(/^\+216\d{8}$/).required().messages({
    'string.base': 'Le téléphone doit être une chaîne de caractères.',
    'string.empty': 'Le téléphone est requis.',
    'string.pattern.base': 'Le téléphone doit être un numéro valide (ex: +21612345678).',
  }),
  actif: Joi.boolean()
});
