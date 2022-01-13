const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const messageValidation = require('../../validations/message.validation');
const messageController = require('../../controllers/message.controller');
const router = express.Router();

const messageRoute = (io) => {
  const routeMessageController = new messageController(io);

  router
    .route('/:roomID')
    .get(auth(), validate(messageValidation.getMessageByRoomID), routeMessageController.getAllMessageInRoom)
    .post(auth(), validate(messageValidation.createMessage), routeMessageController.createMessage)

  return router;
};

module.exports = messageRoute;
