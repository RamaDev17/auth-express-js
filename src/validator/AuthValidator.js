import Joi from "joi";

const RegisterValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().required(),
});

const LoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { RegisterValidator, LoginValidator };
