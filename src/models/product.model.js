const { DataTypes } = require('sequelize');
const now = require('moment');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');

const Product = sequelizeDB.define('Product', {
  productID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  brand: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numReviewer: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  idReviewer: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: [],
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

Product.prototype.updateIdReviewer = async (productID, userID) => {
  await Product.update(
    { idReviewer: sequelizeDB.fn('array_append', sequelizeDB.col('idReviewer'), userID) },
    { where: { productID } }
  );
};

sequelizeDB
  .sync()
  .then(() => logger.info('Sync Product Table success!'))
  .catch(() => logger.error('Sync Product Table fail')); // create database table with name 'Product'

module.exports = Product;
