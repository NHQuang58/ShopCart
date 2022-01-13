const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

/**
 * Create an order by user
 */
const createOrderSQL = catchAsync(async (req, res) => {
  const { userID } = req.user;
  const order = await orderService.createOrderSQL(userID, req.body);
  res.status(httpStatus.CREATED).send(order);
});

/**
 * Get all orders by admin
 */
const getAllOrderSQL = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const order = await orderService.getAllOrderSQL(filter, options);
  res.status(httpStatus.OK).send(order);
});

/**
 * Get all orders by user
 */
const getMyOrdersSQL = catchAsync(async (req, res) => {
  const filter = {
    userID: req.user.userID,
    statusDelivery: req.query.status,
  };
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const order = await orderService.getMyOrdersSQL(filter, options);
  res.status(httpStatus.OK).send(order);
});

/**
 * Get order by id
 */
const getOrderByID = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByID(req.params.orderID);
  res.status(httpStatus.OK).send(order);
});

/**
 * Update order to paid
 */
const updateOrderPaid = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderPaid(req.params.orderID);
  res.status(httpStatus.OK).send(order);
});

/**
 * Update order deliver by admin
 */
const updateDeliver = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderDeliver(req.params.orderID, req.body.statusDelivery);
  res.status(httpStatus.OK).send(order);
});

module.exports = {
  createOrderSQL,
  getAllOrderSQL,
  getMyOrdersSQL,
  getOrderByID,
  updateOrderPaid,
  updateDeliver,
};
