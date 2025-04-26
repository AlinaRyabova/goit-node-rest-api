import express from "express";

import validateBody from "../helpers/validateBody.js";
import {
  authSignupSchema,
  authSigninSchema,
  authVerifySchema,
} from "../schemas/authSchemas.js";
import {
  signupController,
  signinController,
  getCurrentUserController,
  logoutUserController,
  updateAvatarController,
  verifyController,
  resendVerifyEmailController,
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

authRouter.get("/verify/:verificationToken", verifyController);

authRouter.post(
  "/verify",
  validateBody(authVerifySchema),
  resendVerifyEmailController
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
