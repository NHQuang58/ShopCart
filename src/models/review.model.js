const { DataTypes } = require('sequelize');
const now = require('moment');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');

const Review = sequelizeDB.define('Review', {
  reviewID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

sequelizeDB
  .sync()
  .then(() => logger.info('Sync Review Table success!'))
  .catch(() => logger.error('Sync Review Table fail')); // create database table with name 'Review'

module.exports = Review;
