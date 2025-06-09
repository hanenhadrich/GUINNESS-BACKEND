import Joi from 'joi';

export const subscriptionValidator = Joi.object({
  adherent: Joi.object({
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
  }).required(),
  startDate: Joi.string().required(),
  duration: Joi.number().min(1).required(),
  type: Joi.string().valid('semaine', 'mois', 'autre').required(),
  endDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});
