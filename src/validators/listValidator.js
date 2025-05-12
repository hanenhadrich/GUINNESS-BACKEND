import Joi from "joi";

export const listValidator = Joi.object({
  title: Joi.string().required().min(2).max(50),
  completed: Joi.boolean()
});
