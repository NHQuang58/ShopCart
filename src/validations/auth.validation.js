const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    contact: Joi.string().required(),
  }),
};
const registerSQL = {
  body: Joi.object().keys({
    userName: Joi.string().required().email(),
    passWord: Joi.string().required(),
    // score: Joi.number().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const loginSQL = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    passWord: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const forgotPasswordSQL = {
  body: Joi.object().keys({
    userName: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};
const resetPasswordSQL = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    passWord: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  registerSQL,
  login,
  loginSQL,
  logout,
  refreshTokens,
  forgotPassword,
  forgotPasswordSQL,
  resetPassword,
  resetPasswordSQL,
  verifyEmail,
};
