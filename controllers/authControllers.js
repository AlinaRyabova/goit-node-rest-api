import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import gravatar from "gravatar";

import {
  signupUser,
  signinUser,
  logoutUser,
  verifyUser,
  resendVerifyEmail,
} from "../services/authServices.js";
import User from "../db/models/user.js";

const avatarsDir = path.resolve("public", "avatars");

export const signupController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(HttpError(400, "Email and password are incorrect"));
    }

    let avatarURL;

    if (req.file) {
      const { path: oldPath, filename } = req.file;
      const newPath = path.join(avatarsDir, filename);
      await fs.rename(oldPath, newPath);
      avatarURL = path.join("avatars", filename);
    } else {
      avatarURL = gravatar.url(email, { s: "250", d: "retro" });
    }

    const newUser = await signupUser({ ...req.body, avatarURL });

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    res.status(409).json({ message: "Email in use" });
  }
};

export const verifyController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    await verifyUser(verificationToken);

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await resendVerifyEmail(email);

    res.status(200).json({
      message: "Verify email resend",
    });
  } catch (error) {
    next(error);
  }
};

export const signinController = async (req, res, next) => {
  try {
    const { token, user } = await signinUser(req.body);

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    if (error.status === 401) {
      res.status(401).json({ message: "Email or password is wrong" });
    } else {
      next(error);
    }
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const logoutUserController = async (req, res) => {
  const { id } = req.user;
  await logoutUser(id);
  res.json({ message: "Logout successfully" });
};

export const updateAvatarController = async (req, res, next) => {
  try {
    const { id } = req.user;

    if (!req.file) {
      return next(HttpError(400, "Avatar file is missing"));
    }

    const { path: oldPath, filename } = req.file;
    const newFileName = `${id}_${filename}`;
    const newPath = path.join(avatarsDir, newFileName);
    await fs.rename(oldPath, newPath);
    const avatarURL = `/avatars/${newFileName}`;
    await User.update({ avatarURL }, { where: { id } });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
