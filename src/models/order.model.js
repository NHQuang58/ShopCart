const { DataTypes } = require('sequelize');
const now = require('moment');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');
const { statusDelivery } = require('../config/statusDelivery');

const Order = sequelizeDB.define('Order', {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shipFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productIdList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
  },
  productNameList: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: [],
  },
  numProductList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
  },
  imageList: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: [],
  },
  unitPriceList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
  },
  totalPriceList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    defaultValue: [],
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  paymentMethod: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  statusDelivery: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: statusDelivery.CREATED,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

// Order.prototype.updateProductIdList = async (orderID, productID) => {
//   await Order.update(
//     { productIdList: sequelizeDB.fn('array_append', sequelizeDB.col('productIdList'), productID) },
//     { where: { orderID } }
//   );
// };

sequelizeDB
  .sync()
  .then(() => logger.info('Sync Order Table success!'))
  .catch(() => logger.error('Sync Order Table fail')); // create database table with name 'Order'

module.exports = Order;
