const httpStatus = require('http-status');
const { Room, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const paginationService = require('./pagination.service');
const logger = require("../config/logger");
const sequelizeDB = require("../config/configDB");

const getAllRoom = async ( options) => {
  let page = parseInt(options.page, 10);
  if (!page) page = 1;
  let size = parseInt(options.size, 10);
  // if (!size) size = await Room.count();
  if (!size) size = 10; //get 10 rooms default
  if (!options.order) {
    options.order = 'desc';
  }
  if (!options.sortBy) {
    options.sortBy = 'updatedAt';
  }
  const { limit, offset } = paginationService.getPagination(page, size);
  const data = await Room.findAndCountAll({ limit, offset, order: [[options.sortBy, options.order]] }); // DESC or ASC
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const room = paginationService.getPagingData(data, page, limit);
  return room;
};

const createRoomSQL = async (userID, userName) => {
  const roomID = userID;
  const room = userName;
  const roomDoc = await Room.findByPk(roomID);
  logger.info(`Check Create Room: ${roomID} ${room}`);
  if(roomDoc) {
    logger.error(`Error Create Room: ${roomDoc}`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Room is exist');
  };
  const roomBody = {
    roomID,
    room,
  };
  return Room.create(roomBody);
};

const getRoomByID = async (roomID) => {
  const room = await Room.findByPk(roomID);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  return room;
};

const updateRoomById = async (roomID, updateBody) => {
  const room = await Room.findByPk(roomID);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  Object.assign(room, updateBody);
  await room.save();
  return room;
};

const addToSeenList = async (roomID, userID) => {
  const room = await Room.findByPk(roomID);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  const idSeenList = room.idSeenList;
  //if this user has not seen last message
  if (!idSeenList.includes(userID)) {
    await room.addIdSeen(room.roomID, userID);
  }
  return room;
};

//user when creat a new message in room
const renewRoomSeenList = async (roomID, userID) => {
  const room = await Room.findByPk(roomID);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  let idSeenList = room.idSeenList;
  if(idSeenList === null) { //first message in this room
    await room.addIdSeen(room.roomID, userID);
  }
  else {
    for(const element of idSeenList) {
      await room.removeIdSeen(room.roomID, element);
    }
  }
  await room.addIdSeen(room.roomID, userID);
  return room;
};


module.exports = {
  getAllRoom,
  createRoomSQL,
  getRoomByID,
  updateRoomById,
  renewRoomSeenList,
  addToSeenList,
};
