const Joi = require('joi');

const createMessage = {
  params: Joi.object().keys({
    roomID: Joi.number(),
  }),
  body: Joi.object().keys({
    text: Joi.string(),
  }),
};

const getMessageByRoomID = {
  params: Joi.object().keys({
    roomID: Joi.number(),
  }),
};

module.exports = {
  createMessage,
  getMessageByRoomID,
};
