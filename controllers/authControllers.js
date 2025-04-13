import {
  signupUser,
  signinUser,
  logoutUser,
} from "../services/authServices.js";

export const signupController = async (req, res) => {
  try {
    const newUser = await signupUser(req.body);

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    res.status(409).json({ message: "Email in use" });
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
