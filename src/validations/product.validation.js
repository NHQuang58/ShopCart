const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string(),
    brand: Joi.string(),
    price: Joi.number(),
    image: Joi.string(),
    category: Joi.string(),
    description: Joi.string(),
    countInStock: Joi.number(),
  }),
};

const getProductSQL = {
  params: Joi.object().keys({
    productID: Joi.number(),
  }),
};

const deleteProductSQL = {
  params: Joi.object().keys({
    productID: Joi.number(),
  }),
};

const updateProductSQL = {
  params: Joi.object().keys({
    productID: Joi.number(),
  }),
};

const createReview = {
  params: Joi.object().keys({
    productID: Joi.number(),
  }),
  body: Joi.object().keys({
    rate: Joi.number(),
    comment: Joi.string(),
  }),
};

const readReview = {
  params: Joi.object().keys({
    productID: Joi.number(),
  }),
  query: Joi.object().keys({
    rate: Joi.number(),
    size: Joi.number(),
    page: Joi.number(),
  }),
};

module.exports = {
  createProduct,
  getProductSQL,
  deleteProductSQL,
  updateProductSQL,
  createReview,
  readReview
};
