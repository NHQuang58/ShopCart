const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roomValidation = require('../../validations/room.validation');
const roomController = require('../../controllers/room.controller');
const router = express.Router();

const roomRoute = (io) => {
  const routeRoomController = new roomController(io);

  router
    .route('/')
    .get(auth('getRoom'), routeRoomController.getAllRoom)
    .post(auth(), routeRoomController.createRoom);

  router.route('/:roomID').get(auth(), validate(roomValidation.getRoomByID), routeRoomController.getRoomByID);

  return router;
};

module.exports = roomRoute;
