import Joi from 'joi'

export const userSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).required().messages({
    'string.base': 'fullName must be a string',
    'string.min': 'fullName must be at least {#limit} characters long',
    'string.max': 'fullName must be at most {#limit} characters long',
    'any.required': 'fullName is required',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'email is required',
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'password is required',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password must match password',
    'any.required': 'confirmPassword is required',
  }),
  phoneNumber: Joi.string(),
})
