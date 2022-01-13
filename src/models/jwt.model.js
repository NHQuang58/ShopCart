const { DataTypes } = require('sequelize');
const now = require('moment');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');

const JWT = sequelizeDB.define('Token', {
  token: {
    type: DataTypes.TEXT,
  },
  userID: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.TEXT,
  },
  expires: {
    type: DataTypes.DATE,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

sequelizeDB
  .sync()
  .then(() => logger.info('Sync JWT Table success!'))
  .catch(() => logger.error('Sync JWT Table fail')); // create database table with name 'Token'

module.exports = JWT;
