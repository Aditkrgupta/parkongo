const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
  .min(6)
  .required()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
  .messages({
    'string.pattern.base':
      'Password must be at least 6 characters and include one uppercase letter, one lowercase letter, one digit, and one special character'
  })
});
exports.registrationSchema = Joi.object({
    email: Joi.string().email().required(),
  name: Joi.string().required(),
  
   
});





