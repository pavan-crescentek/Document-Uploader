const Joi = require('joi');

const registrationUserSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.array().items(Joi.string().valid('ADMIN', 'ENDUSER')).min(1).unique(),
});

module.exports = {
  registrationUserSchema,
};
