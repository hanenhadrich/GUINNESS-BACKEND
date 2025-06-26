import Joi from 'joi';

export const registerValidator = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.base": "First name must be a string",
    "string.min": "First name must be at least 2 characters long",
    "any.required": "First name is required"
  }),
  lastName: Joi.string().min(2).messages({
    "string.base": "Last name must be a string",
    "string.min": "Last name must be at least 2 characters long"
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required"
  }),
  telephone: Joi.string().pattern(/^\+216\d{8}$/).required().messages({
    "string.base": "Phone number must be a string",
    "string.pattern.base": "Please enter a valid Tunisian phone number (e.g. +21612345678)",
    "any.required": "Phone number is required"
  })
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required"
  })
});

export const updateProfileValidator = Joi.object({
  firstName: Joi.string().min(2).messages({
    "string.base": "First name must be a string",
    "string.min": "First name must be at least 2 characters long",
  }),
  lastName: Joi.string().min(2).messages({
    "string.base": "Last name must be a string",
    "string.min": "Last name must be at least 2 characters long",
  }),
  email: Joi.string().email().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
  }),
  telephone: Joi.string().pattern(/^\+216\d{8}$/).messages({
    "string.base": "Phone number must be a string",
    "string.pattern.base": "Please enter a valid Tunisian phone number (e.g. +21612345678)",
  }),
  password: Joi.string().min(6).messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters long",
  }),
});
