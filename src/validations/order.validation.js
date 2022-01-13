const Joi = require('joi');
const { statusDeli } = require('./custom.validation');

const getOrderByID = {
  params: Joi.object().keys({
    orderID: Joi.number(),
  }),
};
const payOrder = {
  params: Joi.object().keys({
    orderID: Joi.number(),
  }),
};
const updateDeliver = {
  params: Joi.object().keys({
    orderID: Joi.number(),
  }),
  body: Joi.object().keys({
    statusDelivery: Joi.string().custom(statusDeli),
    // statusDelivery: Joi.string(),
  }),
};

module.exports = {
  getOrderByID,
  payOrder,
  updateDeliver,
};
