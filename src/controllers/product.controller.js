const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

/**
 * Create a product
 */
const createProductSQL = catchAsync(async (req, res) => {
  const product = await productService.createProductSQL(req.body);
  res.status(httpStatus.CREATED).send(product);
});

/**
 * Get all products
 */
const getAllProductSQL = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['brand', 'category']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const product = await productService.getAllProductSQL(filter, options);
  res.status(httpStatus.OK).send(product);
});

/**
 * Get top products
 */
const getTopProductSQL = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['brand', 'category']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const product = await productService.getTopProductSQL(filter, options);
  res.status(httpStatus.OK).send(product);
});

/**
 * Get a product by id
 */
const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productID);
  res.status(httpStatus.OK).send(product);
});

/**
 * Delete a product by id
 */
const deleteProductSQL = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productID);
  res.status(httpStatus.OK).send();
});

/**
 * Update a product by id
 */
const updateProductSQL = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productID, req.body);
  res.status(httpStatus.OK).send(product);
});

/**
 * Create a review product
 */
const createReviewSQL = catchAsync(async (req, res) => {
  const { userID, userName } = req.user;
  const product = await productService.createReviewSQL(req.params.productID, userID, userName, req.body);
  res.status(httpStatus.OK).send(product);
});

/**
 * Read reviews about product
 */
const readReviewSQL = catchAsync(async (req, res) => {
  const filter = {
    productID: req.params.productID,
    rate: req.query.rate,
  };
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const review = await productService.readReviewSQL(filter, options);
  res.status(httpStatus.OK).send(review);
});

/**
 * Search products
 */
const searchProductSQL = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['term']);
  const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
  const product = await productService.searchProductSQL(filter, options);
  res.status(httpStatus.OK).send(product);
});

module.exports = {
  createProductSQL,
  getAllProductSQL,
  getTopProductSQL,
  getProductById,
  deleteProductSQL,
  updateProductSQL,
  createReviewSQL,
  readReviewSQL,
  searchProductSQL,
};
