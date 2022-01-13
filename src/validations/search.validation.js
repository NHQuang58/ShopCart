const Joi = require('joi');

const searchProductSQL = {
  query: Joi.object().keys({
    size: Joi.number(),
    page: Joi.number(),
    term: Joi.string(),
  }),
};

module.exports = {
  searchProductSQL
};
