import Joi from 'joi';

export const registerValidator = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères",
    "string.min": "Le prénom doit contenir au moins 2 caractères",
    "any.required": "Le prénom est requis"
  }),
  lastName: Joi.string().min(2).messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.min": "Le nom doit contenir au moins 2 caractères"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "L'adresse e-mail doit être une chaîne de caractères",
    "string.email": "Veuillez entrer une adresse e-mail valide",
    "any.required": "L'adresse e-mail est requise"
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "any.required": "Le mot de passe est requis"
  }),
  telephone: Joi.string().pattern(/^\+216\d{8}$/).required().messages({
    "string.base": "Le numéro de téléphone doit être une chaîne de caractères",
    "string.pattern.base": "Veuillez entrer un numéro de téléphone tunisien valide (ex. : +21612345678)",
    "any.required": "Le numéro de téléphone est requis"
  })
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "L'adresse e-mail doit être une chaîne de caractères",
    "string.email": "Veuillez entrer une adresse e-mail valide",
    "any.required": "L'adresse e-mail est requise"
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "any.required": "Le mot de passe est requis"
  })
});

export const updateProfileValidator = Joi.object({
  firstName: Joi.string().min(2).messages({
    "string.base": "Le prénom doit être une chaîne de caractères",
    "string.min": "Le prénom doit contenir au moins 2 caractères",
  }),
  lastName: Joi.string().min(2).messages({
    "string.base": "Le nom doit être une chaîne de caractères",
    "string.min": "Le nom doit contenir au moins 2 caractères",
  }),
  email: Joi.string().email().messages({
    "string.base": "L'adresse e-mail doit être une chaîne de caractères",
    "string.email": "Veuillez entrer une adresse e-mail valide",
  }),
  telephone: Joi.string().pattern(/^\+216\d{8}$/).messages({
    "string.base": "Le numéro de téléphone doit être une chaîne de caractères",
    "string.pattern.base": "Veuillez entrer un numéro de téléphone tunisien valide (ex. : +21612345678)",
  }),
  password: Joi.string().min(6).messages({
    "string.base": "Le mot de passe doit être une chaîne de caractères",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
  }),
});
