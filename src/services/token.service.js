const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token, JWT } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const redisClient = require('../app/redisConnect');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const saveTokenSQL = async (token, userId, expires, type) => {
  const jwtDoc = await JWT.create({
    token,
    userID: userId,
    type,
    expires: expires.toDate(),
  });
  return jwtDoc;
};

const saveTokenRedis = async (token, userID, expires, type) => {
  const key = `${userID.toString()}${type}`; //eg. 1refresh
  // await redisClient.set(key, JSON.stringify({ token, expires, type }));
  await redisClient.set(key, token);
  return token;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const verifyTokenSQL = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const userID = payload.sub;
  if (!userID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'userID not found');
  }
  const tokenDoc = await JWT.findOne({ where: { token, type, userID: payload.sub } });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const verifyTokenRedis = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const userID = payload.sub;
  const key = `${userID.toString()}${type}`;
  if (!userID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'userID not found');
  }
  const tokenDoc = await redisClient.get(key);
  if (token !== tokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token is false');
  }
  // const blackToken = await redisClient.lRange(`BLL_${userID.toString()}`, 0, -1);
  // if (blackToken != null) {
  //   if (blackToken.includes(tokenDoc)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Token is Black');
  //   }
  // }
  return userID;
};
/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.userID, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.userID, refreshTokenExpires, tokenTypes.REFRESH);
  // await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveTokenSQL(refreshToken, user.userID, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokensRedis = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.userID, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.userID, refreshTokenExpires, tokenTypes.REFRESH);

  await saveTokenRedis(refreshToken, user.userID, refreshTokenExpires, tokenTypes.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} userName
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (userName) => {
  // const user = await userService.getUserByEmail(email);
  const user = await userService.getUserByUsername(userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.userID, expires, tokenTypes.RESET_PASSWORD);
  // await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveTokenSQL(resetPasswordToken, user.userID, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate reset password token with redis
 * @param {string} userName
 * @returns {Promise<string>}
 */
const generateResetPasswordTokenRedis = async (userName) => {
  const user = await userService.getUserByUsername(userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.userID, expires, tokenTypes.RESET_PASSWORD);
  await saveTokenRedis(resetPasswordToken, user.userID, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.userID, expires, tokenTypes.VERIFY_EMAIL);
  // await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveTokenSQL(verifyEmailToken, user.userID, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
/**
 * Generate verify email token
 */
const generateVerifyEmailTokenRedis = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.userID, expires, tokenTypes.VERIFY_EMAIL);
  await saveTokenRedis(verifyEmailToken, user.userID, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
module.exports = {
  generateToken,
  saveToken,
  saveTokenSQL,
  verifyToken,
  verifyTokenSQL,
  verifyTokenRedis,
  generateAuthTokens,
  generateAuthTokensRedis,
  generateResetPasswordToken,
  generateResetPasswordTokenRedis,
  generateVerifyEmailToken,
  generateVerifyEmailTokenRedis,
};
