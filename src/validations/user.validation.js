const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};
const createUserSQL = {
  body: Joi.object().keys({
    userName: Joi.string().required().email(),
    passWord: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getUsersSQL = {
  query: Joi.object().keys({
    userName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string().required(),
    order: Joi.string().required(),
    size: Joi.number().integer().required(),
    page: Joi.number().integer().required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const getUserSQL = {
  params: Joi.object().keys({
    userID: Joi.number(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};
const updateUserSQL = {
  params: Joi.object().keys({
    userID: Joi.number(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const deleteUserSQL = {
  params: Joi.object().keys({
    userID: Joi.number(),
  }),
};

module.exports = {
  createUser,
  createUserSQL,
  getUsers,
  getUsersSQL,
  getUser,
  getUserSQL,
  updateUser,
  updateUserSQL,
  deleteUser,
  deleteUserSQL,
};
