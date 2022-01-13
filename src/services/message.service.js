const httpStatus = require('http-status');
const { Room, Message } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');
const now = require("moment");

const getAllMessageInRoom = async ( filter, options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  // if (!size) size = await Room.count();
  if (!size) size = 6; //get 6 messages default
  if (!options.order) {
    options.order = 'asc';
  }
  if (!options.sortBy) {
    options.sortBy = 'createdAt';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Message.findAndCountAll({ where: filter, limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const message = paginationService.getPagingData(data, page, limit);

  return message;
};

const createMessageSQL = async (req) => {
  const roomID = req.params.roomID;
  const userName = req.user.userName;
  const text = req.body.text;
  const messageBody = {
    userName,
    text,
    time: now(),
    roomID,
  };
  return Message.create(messageBody);
};


module.exports = {
  getAllMessageInRoom,
  createMessageSQL,
};
