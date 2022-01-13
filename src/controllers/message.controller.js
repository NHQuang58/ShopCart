const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roomService, messageService } = require('../services');
const logger = require('../config/logger');
const { Room } = require("../models");

function messageController (io) {
  this.io = io;

  //get all messages in room
  this.getAllMessageInRoom = catchAsync(async (req, res) => {
    const filter = pick(req.params, ['roomID']);
    const options = pick(req.query, ['sortBy', 'order', 'size', 'page']);
    const message = await messageService.getAllMessageInRoom(filter, options);
    await roomService.addToSeenList(req.params.roomID, req.user.userID);
    res.status(httpStatus.OK).send(message);
  });

  //create a new message in room
  this.createMessage = catchAsync(async (req, res) => {
    const message = await messageService.createMessageSQL(req);
    const updateBody = {
      lastMsg: req.body.text,
      lastUserSend: req.user.userName,
    };
    //renew idSeenList
    await roomService.renewRoomSeenList(req.params.roomID, req.user.userID);
    //update last msg and last userSend
    const room = await roomService.updateRoomById(req.params.roomID, updateBody);
    //notice for current room that have new message in room
    this.io.to(room.room).emit('newMessageEvent', message);
    if(req.user.role !== 'admin') {
      //notice for admin that have new message from user
      this.io.to('adminRoom').emit('newMessageFromUser', message);
    }
    res.status(httpStatus.CREATED).send(message);
  });

}

module.exports = messageController;
