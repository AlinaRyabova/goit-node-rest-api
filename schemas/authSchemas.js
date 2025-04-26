import Joi from "joi";

import { emailRegex } from "../constans/auth.js";

export const authSignupSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});

export const authVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
})

export const authSigninSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});
