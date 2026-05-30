const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendSuccess } = require("../utils/apiResponse");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("El email ya esta registrado");
      error.statusCode = 409;
      throw error;
    }

    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser && req.body.role === "admin" ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = signToken(user);

    return sendSuccess(res, {
      statusCode: 201,
      message: "Usuario registrado correctamente",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error("Credenciales invalidas");
      error.statusCode = 401;
      throw error;
    }

    const token = signToken(user);

    return sendSuccess(res, {
      message: "Inicio de sesion exitoso",
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
