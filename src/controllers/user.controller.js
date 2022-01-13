const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Create an user
 */
const createUserSQL = catchAsync(async (req, res) => {
  const user = await userService.createUserSQL(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});
/**
 * Get some users
 */
const getUsersSQL = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userName', 'role']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  await userService.queryUsersSQL(filter, options, res);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});
/**
 * Get an user
 */
const getUserSQL = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.params.userID);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

/**
 * Get own user
 */
const getOwnUserSQL = catchAsync(async (req, res) => {
  const user = await userService.getUserByPk(req.user.userID);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});
/**
 * Update an user
 */
const updateUserSQL = catchAsync(async (req, res) => {
  const user = await userService.updateUserByPk(req.params.userID, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Delete an user
 */
const deleteUserSQL = catchAsync(async (req, res) => {
  await userService.deleteUserByPk(req.params.userID);
  res.status(httpStatus.NO_CONTENT).send();
});

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
  getOwnUserSQL,
};
