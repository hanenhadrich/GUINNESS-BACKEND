import Joi from 'joi';

export const subscriptionValidator = Joi.object({
  adherent: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), 
  startDate: Joi.date().iso().required(),  
  duration: Joi.number().min(1).required(),
  type: Joi.string().valid('semaine', 'mois', 'an', 'autre').required(),
  endDate: Joi.date().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
});
