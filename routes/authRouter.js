import express from "express";

import validateBody from "../helpers/validateBody.js";
import { authSignupSchema, authSigninSchema } from "../schemas/authSchemas.js";
import {
  signupController,
  signinController,
  getCurrentUserController,
  logoutUserController,
  updateAvatarController,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlevares/authenticate.js";
import upload from "../middlevares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  validateBody(authSignupSchema),
  signupController
);
authRouter.post("/login", validateBody(authSigninSchema), signinController);

authRouter.get("/current", authenticate, getCurrentUserController);

authRouter.post("/logout", authenticate, logoutUserController);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatarController
);

export default authRouter;
