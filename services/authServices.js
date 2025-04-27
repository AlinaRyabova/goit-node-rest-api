import bcrypt from "bcrypt";

import User from "../db/models/user.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken, verifyToken } from "../helpers/jwt.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const { APP_DOMAIN } = process.env;

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify email",
  html: `<a
      target="_blank"
      href="${APP_DOMAIN}/api/auth/verify/${verificationToken}"
    >
      Click verify email
    </a>`,
});

export const signupUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw HttpError(409, `Email already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();
  const newUser = await User.create({
    ...data,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail(email, verificationToken);

  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = async (verificationToken) => {
  const user = await findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, `User not found`);
  }

  if (user.verify) {
    throw HttpError(400, `User already verified`);
  }

  await user.update({ verificationToken: null, verify: true });
};

export const resendVerifyEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, `User not found`);
  }

  if (user.verify) {
    throw HttpError(400, `Verification has already been passed`);
  }

  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);
};

export const signinUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, `Email or password  invalid`);
  }

  if (!user.verify) {
    throw HttpError(401, `Email not verified`);
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, `Email or password  invalid`);
  }
  const payload = {
    email,
  };
  const token = generateToken(payload);
  await user.update({ token });
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async (id) => {
  const user = await findUser({ id });
  if (!user || !user.token) {
    throw HttpError(404, `User not found`);
  }
  await user.update({ token: null });
};
