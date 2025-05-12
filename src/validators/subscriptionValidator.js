import Joi from 'joi';

export const subscriptionValidator = Joi.object({
  adherent: Joi.string().required(),
  startDate: Joi.date().required(),
  duration: Joi.number().min(1).required(),
  type: Joi.string().valid('semaine', 'mois', 'an').required(),
  endDate: Joi.date().optional(), 
  status: Joi.string().valid('active', 'inactive').optional() 
});
