const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const routeIO = (app, io) => {
  const roomRoute = require('./room.route')(io);
  const messageRoute = require('./message.route')(io);
  app.use('/room', roomRoute);
  app.use('/message', messageRoute);
};

module.exports = routeIO;
