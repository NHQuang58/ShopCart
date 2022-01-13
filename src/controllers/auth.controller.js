const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Register an user
 */
const registerSQL = catchAsync(async (req, res) => {
  const user = await userService.createUserSQL(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Login an user
 */
const loginSQL = catchAsync(async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await authService.loginUserNameAndPassword(userName, passWord);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Login an user with redis
 */
const loginRedis = catchAsync(async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await authService.loginUserNameAndPassword(userName, passWord);
  const tokens = await tokenService.generateAuthTokensRedis(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Logout an user
 */
const logoutSQL = catchAsync(async (req, res) => {
  await authService.logoutSQL(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Logout an user with redis
 */
const logoutRedis = catchAsync(async (req, res) => {
  await authService.logoutRedis(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});
/**
 * Refresh a token
 */
const refreshTokensSQL = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthSQL(req.body.refreshToken);
  res.send({ ...tokens });
});

/**
 * Refresh a token with redis
 */
const refreshTokensRedis = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthRedis(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Forgot password process
 */
const forgotPasswordSQL = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.userName);
  await emailService.sendResetPasswordEmail(req.body.userName, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Forgot password redis
 */
const forgotPasswordRedis = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordTokenRedis(req.body.userName);
  await emailService.sendResetPasswordEmail(req.body.userName, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Reset password process
 */
const resetPasswordSQL = catchAsync(async (req, res) => {
  await authService.resetPasswordSQL(req.query.token, req.body.passWord);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Reset password with redis
 */
const resetPasswordRedis = catchAsync(async (req, res) => {
  await authService.resetPasswordRedis(req.query.token, req.body.passWord);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Send verification email process
 */
const sendVerificationEmailSQL = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.userName, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Send verification email process with redis
 */
const sendVerificationEmailRedis = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailTokenRedis(req.user);
  await emailService.sendVerificationEmail(req.user.userName, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Verify email process
 */
const verifyEmailSQL = catchAsync(async (req, res) => {
  await authService.verifyEmailSQL(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 * Verify email process with redis
 */
const verifyEmailRedis = catchAsync(async (req, res) => {
  await authService.verifyEmailRedis(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  registerSQL,
  login,
  loginSQL,
  loginRedis,
  logout,
  logoutSQL,
  logoutRedis,
  refreshTokens,
  refreshTokensSQL,
  refreshTokensRedis,
  forgotPassword,
  forgotPasswordSQL,
  forgotPasswordRedis,
  resetPassword,
  resetPasswordSQL,
  resetPasswordRedis,
  sendVerificationEmail,
  sendVerificationEmailSQL,
  sendVerificationEmailRedis,
  verifyEmail,
  verifyEmailSQL,
  verifyEmailRedis,
};
