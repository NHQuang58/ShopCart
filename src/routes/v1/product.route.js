const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageProducts'), validate(productValidation.createProduct), productController.createProductSQL)
  .get(auth('getProducts'), productController.getAllProductSQL);

router.get('/top', productController.getTopProductSQL);

router
  .route('/:productID/createReview')
  .post(auth(), validate(productValidation.createReview), productController.createReviewSQL);

router.route('/:productID/readReview').get(validate(productValidation.readReview), productController.readReviewSQL);

router
  .route('/:productID')
  .get(validate(productValidation.getProductSQL), productController.getProductById)
  .delete(auth('manageProducts'), validate(productValidation.deleteProductSQL), productController.deleteProductSQL)
  .patch(auth('manageProducts'), validate(productValidation.updateProductSQL), productController.updateProductSQL);

module.exports = router;
