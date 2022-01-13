const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Account } = require('../models');
const paginationService = require('./pagination.service');
const ApiError = require('../utils/ApiError');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};
/**
 * Create a user
 */
const createUserSQL = async (userBody) => {
  if (await Account.isUserAlready(userBody.userName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return Account.create({ ...userBody });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Query for users
 */
const queryUsersSQL = async (filter, options, res) => {
  const page = parseInt(options.page, 10);
  const size = parseInt(options.size, 10);
  const { limit, offset } = paginationService.getPagination(page, size);
  Account.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] })
    .then((data) => {
      const result = paginationService.getPagingData(data, page, limit);
      res.send(result);
    })
    .catch(() => {
      res.status(400).send();
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something wrong when get users');
    });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};
const getUserByPk = async (id) => {
  return Account.findByPk(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by user name
 */
const getUserByUsername = async (_username) => {
  return Account.findOne({ where: { userName: _username } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const hassPassword = async (_password) => {
  return bcrypt.hash(_password, 8);
};
/**
 * Update user by pk
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByPk = async (userId, updateBody) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.userName && (await Account.isUserAlready(updateBody.userName))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.passWord) {
    // need update password
    // eslint-disable-next-line no-param-reassign
    updateBody.passWord = await hassPassword(updateBody.passWord);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
/**
 * Delete user by Pk
 */
const deleteUserByPk = async (userId) => {
  const user = await getUserByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  createUserSQL,
  queryUsers,
  queryUsersSQL,
  getUserById,
  getUserByPk,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  updateUserByPk,
  deleteUserById,
  deleteUserByPk,
};
