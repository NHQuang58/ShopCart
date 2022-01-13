const Joi = require('joi');

const createRoom = {
  body: Joi.object().keys({
    name: Joi.string(),
    brand: Joi.string(),
    price: Joi.number(),
    image: Joi.string(),
    category: Joi.string(),
    description: Joi.string(),
    countInStock: Joi.number(),
  }),
};

const getRoomByID = {
  params: Joi.object().keys({
    roomID: Joi.number(),
  }),
};

module.exports = {
  createRoom,
  getRoomByID,
};
