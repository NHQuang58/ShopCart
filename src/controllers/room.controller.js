const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roomService, orderService } = require('../services');
const logger = require('../config/logger');

function roomController (io) {
  this.io = io;

  this.testFunc = catchAsync(async (req, res) => {
    logger.info('testFunc');
    this.io
      .to('testRoom')
      .emit('testEvent', 'testEventText');
    res.status(httpStatus.OK).send({test: '1234'});
  });

  //get all room by admin
  this.getAllRoom = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
    const room = await roomService.getAllRoom(options);
    res.status(httpStatus.OK).send(room);
  });

  //create a new room if not exist
  this.createRoom = catchAsync(async (req, res) => {
    const {userID, userName} = req.user;
    const room = await roomService.createRoomSQL(userID, userName);
    res.status(httpStatus.CREATED).send(room);
  });

  //get room by id
  this.getRoomByID = catchAsync(async (req, res) => {
    const room = await roomService.getRoomByID(req.params.roomID);
    res.status(httpStatus.OK).send(room);
  });

}

module.exports = roomController;
