import express from "express";

import validateBody from "../helpers/validateBody.js";
import { authSignupSchema, authSigninSchema } from "../schemas/authSchemas.js";
import {
  signupController,
  signinController,
  getCurrentUserController,
  logoutUserController,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlevares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSignupSchema), signupController);
authRouter.post("/login", validateBody(authSigninSchema), signinController);

authRouter.get("/current", authenticate, getCurrentUserController);

authRouter.post("/logout", authenticate, logoutUserController);

export default authRouter;
