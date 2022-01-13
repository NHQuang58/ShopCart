const httpStatus = require('http-status');
const { Order, Product, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');
const { now } = require("moment");

const createOrderSQL = async (userID, arrItem) => {
  if (!arrItem.length) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Order is empty');
  }
  const { name, address, phone, paymentMethod, shipFee } = arrItem[0];
  const productIdList = [];
  const productNameList = [];
  const numProductList = [];
  const imageList = [];
  const unitPriceList = [];
  const totalPriceList = [];

  arrItem.forEach((element) => {
    productIdList.push(element.productID);
    productNameList.push(element.productName);
    numProductList.push(element.numProduct);
    imageList.push(element.image);
    unitPriceList.push(element.unitPrice);
    totalPriceList.push(element.totalPrice);
  });
  let total = totalPriceList.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  });
  total += shipFee;
  const orderObj = {
    userID,
    name,
    address,
    phone,
    paymentMethod,
    shipFee,
    productIdList,
    productNameList,
    numProductList,
    imageList,
    unitPriceList,
    totalPriceList,
    total,
  };
  await Order.create(orderObj);
  return orderObj;
};

const getAllOrderSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = await Order.count();
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'createdAt';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Order.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const order = paginationService.getPagingData(data, page, limit);
  return order;
};

const getMyOrdersSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = 10;
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'createdAt';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Order.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const order = paginationService.getPagingData(data, page, limit);
  return order;
};

const getOrderByID = async (orderID) => {
  const order = await Order.findByPk(orderID);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return order;
};

const updateOrderPaid = async (orderID) => {
  const order = await Order.findByPk(orderID);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const orderObj = {
    paymentMethod: 'Paypal',
    isPaid: true,
    paidAt: now(),
  };
  Object.assign(order, orderObj);
  await order.save();
  return order;
};

const updateOrderDeliver = async (orderID, statusDelivery) => {
  const order = await Order.findByPk(orderID);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const orderObj = {
    statusDelivery,
  };
  Object.assign(order, orderObj);
  await order.save();
  return order;
};

module.exports = {
  createOrderSQL,
  getAllOrderSQL,
  getMyOrdersSQL,
  getOrderByID,
  updateOrderPaid,
  updateOrderDeliver,
};
