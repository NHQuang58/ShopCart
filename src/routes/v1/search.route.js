const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const searchValidation = require('../../validations/search.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(searchValidation.searchProductSQL), productController.searchProductSQL);

module.exports = router;
