const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.route('/').post(auth(), orderController.createOrderSQL).get(auth('getOrders'), orderController.getAllOrderSQL);

router.route('/myorders').get(auth(), orderController.getMyOrdersSQL);

router.route('/:orderID').get(auth(), validate(orderValidation.getOrderByID), orderController.getOrderByID);
router.route('/:orderID/pay').patch(auth(), validate(orderValidation.payOrder), orderController.updateOrderPaid);
router
  .route('/:orderID/deliver')
  .patch(auth('manageOrders'), validate(orderValidation.updateDeliver), orderController.updateDeliver);
module.exports = router;
