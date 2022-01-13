const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { JWT } = require('../models');
const config = require('../config/config');
const redisClient = require('../app/redisConnect');
/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * check password with hass
 */
const checkPassword = async (password, truePassword) => {
  return bcrypt.compare(password, truePassword);
};

/**
 * Login with username and password
 */
const loginUserNameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username');
  }
  const isPasswordCorrect = await checkPassword(password, user.passWord);
  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};
/**
 * Logout with refresh token
 */
const logoutSQL = async (refreshToken) => {
  const refreshTokenDoc = await JWT.findOne({ where: { token: refreshToken, type: tokenTypes.REFRESH } });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.destroy();
};

/**
 * Logout with refresh token
 */
const logoutRedis = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, config.jwt.secret);
  const userID = payload.sub;
  if (!userID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'userID not found');
  }
  const key = userID.toString() + tokenTypes.REFRESH;
  const currentRefreshToken = await redisClient.get(key);
  if (refreshToken !== currentRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not true');
  }
  // const blackToken = await redisClient.lRange(`BLL_${userID.toString()}`, 0, -1);
  // if (blackToken != null) {
  //   if (blackToken.includes(refreshToken)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Token is Black');
  //   }
  // }

  await redisClient.del(key);
  // await redisClient.lPush(`BLL_${userID.toString()}`, refreshToken, config.redis.timeToLive);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};
/**
 * Refresh refresh token
 */
const refreshAuthSQL = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyTokenSQL(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserByPk(refreshTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.destroy();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};
/**
 * Refresh refresh token
 */
const refreshAuthRedis = async (refreshToken) => {
  try {
    const userID = await tokenService.verifyTokenRedis(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserByPk(userID);
    if (!user) {
      throw new Error();
    }
    const key = userID.toString() + tokenTypes.REFRESH;
    const currentRefreshToken = await redisClient.get(key);
    if (refreshToken !== currentRefreshToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not true');
    }
    await redisClient.del(key);
    // await redisClient.lPush(`BLL_${userID.toString()}`, refreshToken, config.redis.timeToLive);
    return tokenService.generateAuthTokensRedis(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Reset password
 */
const resetPasswordSQL = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyTokenSQL(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserByPk(resetPasswordTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByPk(user.userID, { passWord: newPassword });
    await JWT.destroy({ where: { userID: user.userID, type: tokenTypes.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Reset password with redis
 */
const resetPasswordRedis = async (resetPasswordToken, newPassword) => {
  try {
    const userID = await tokenService.verifyTokenRedis(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserByPk(userID);
    if (!user) {
      throw new Error();
    }
    const key = userID.toString() + tokenTypes.RESET_PASSWORD;
    const currentResetPasswordToken = await redisClient.get(key);
    if (resetPasswordToken !== currentResetPasswordToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'resetPasswordToken not true');
    }
    await userService.updateUserByPk(user.userID, { passWord: newPassword });

    await redisClient.del(key);
    // await redisClient.lPush(`BLL_${userID.toString()}`, resetPasswordToken, config.redis.timeToLive);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
/**
 * Verify email
 */
const verifyEmailSQL = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyTokenSQL(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserByPk(verifyEmailTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await JWT.destroy({ where: { userID: user.userID, type: tokenTypes.VERIFY_EMAIL } });
    await userService.updateUserByPk(user.userID, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Verify email redis
 */
const verifyEmailRedis = async (verifyEmailToken) => {
  try {
    const userID = await tokenService.verifyTokenRedis(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserByPk(userID);
    if (!user) {
      throw new Error();
    }
    const key = userID.toString() + tokenTypes.VERIFY_EMAIL;
    const currentVerifyEmailToken = await redisClient.get(key);
    if (verifyEmailToken !== currentVerifyEmailToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'verifyEmailToken not true');
    }
    await redisClient.del(key);
    await userService.updateUserByPk(user.userID, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
module.exports = {
  loginUserWithEmailAndPassword,
  loginUserNameAndPassword,
  logout,
  logoutSQL,
  logoutRedis,
  refreshAuth,
  refreshAuthSQL,
  refreshAuthRedis,
  resetPassword,
  resetPasswordSQL,
  resetPasswordRedis,
  verifyEmail,
  verifyEmailSQL,
  verifyEmailRedis,
};
