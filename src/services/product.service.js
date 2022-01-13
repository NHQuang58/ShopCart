const httpStatus = require('http-status');
const { Product, Review } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');
const { Op } = require('sequelize');
const logger = require("../config/logger");
const createProductSQL = async (productBody) => {
  return Product.create(productBody);
};

const getAllProductSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = await Product.count();
  if (!options.order) {
    options.order = 'asc';
  }
  if (!options.sortBy) {
    options.sortBy = 'rate';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Product.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const product = paginationService.getPagingData(data, page, limit);
  return product;
};

const getTopProductSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = await Product.count();
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'rate';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Product.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const product = paginationService.getPagingData(data, page, limit);
  return product;
};

const getProductById = async (productID) => {
  const product = await Product.findByPk(productID);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const deleteProductById = async (productID) => {
  const product = await Product.findByPk(productID);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.destroy();
  return product;
};

const updateProductById = async (productID, updateBody) => {
  const product = await Product.findByPk(productID);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const createReviewSQL = async (productID, userID, userName, reviewBody) => {
  const product = await Product.findByPk(productID);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const idReviewerList = product.idReviewer;
  if (idReviewerList != null) {
    if (idReviewerList.includes(userID)) {
      // if this user reviewed this product
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'This user reviewed this product');
    }
  }

  const { rate, comment } = reviewBody;
  const reviewObj = {
    productID,
    userName,
    rate,
    comment,
  };
  await Review.create(reviewObj);
  // calc new rating
  const newRate = (product.rate * product.numReviewer + rate) / (product.numReviewer + 1);
  // calc new number of reviewers
  const newNumReviewer = product.numReviewer + 1;
  const productObj = {
    rate: newRate,
    numReviewer: newNumReviewer,
  };
  Object.assign(product, productObj);
  await product.save();
  await product.updateIdReviewer(productID, userID);
  return product;
};

const readReviewSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = 5;
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'createdAt';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Review.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const review = paginationService.getPagingData(data, page, limit);
  return review;
};

const searchProductSQL = async (filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  if (!size) size = await Product.count();
  logger.info(`page = ${page}, size = ${size}`);
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'rate';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  logger.info(`limit = ${limit}, offset = ${offset}`);
  const term = filter.term.toLowerCase();
  //search in name or description
  const data = await Product.findAndCountAll( { where: {[Op.or]: [{name: {[Op.like]: '%' + term + '%'}}, { description :{[Op.like]: '%' + term + '%'} }] } ,
                                              limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  //only search name
  // const data = await Product.findAndCountAll( { where: {[Op.or]: {name: {[Op.like]: '%' + term + '%'}} } , limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const product = paginationService.getPagingData(data, page, limit);
  return product;
};

module.exports = {
  createProductSQL,
  getAllProductSQL,
  getTopProductSQL,
  getProductById,
  deleteProductById,
  updateProductById,
  createReviewSQL,
  readReviewSQL,
  searchProductSQL,
};
