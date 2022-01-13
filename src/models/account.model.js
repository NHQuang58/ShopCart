const { DataTypes } = require('sequelize');
const now = require('moment');
const bcrypt = require('bcryptjs');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');

const Account = sequelizeDB.define('Account', {
  userID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  passWord: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

Account.beforeCreate(async (user) => {
  user.passWord = await bcrypt.hash(user.passWord, 8);
});
// Account.beforeUpdate(async (user, options) => {
//   user.passWord = await bcrypt.hash(user.passWord, 8);
// });

Account.isUserAlready = async (_userName) => {
  const user = await Account.findOne({ where: { userName: _userName } });
  return !!user;
};

sequelizeDB
  .sync()
  .then(() => logger.info('Sync Account Table success!'))
  .catch(() => logger.error('Sync Account Table fail')); // create database table with name 'Account'

module.exports = Account;
