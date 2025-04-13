import Joi from "joi";

import { emailRegex } from "../constans/auth.js";

export const authSignupSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
  subscription: Joi.string().valid("starter", "pro", "business").optional(),
  token: Joi.string().optional(),
});

export const authSigninSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});
