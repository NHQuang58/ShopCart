const { userJoin, getRoomUsers, getCurrentUser, userLeave } = require("../utils/users.util");
const formatMessage = require("../utils/messages.util");
const logger = require('../config/logger');

const botName = 'Bot';

const socket = (io) => {
// Run when client connects
  io.on('connection', socket => {

    //event when Admin switch room chat
    socket.on('switch', ({ oldRoom, newRoom }) => {
      socket.leave(oldRoom);
      socket.join(newRoom);
      console.log('admin left from room: ', oldRoom);
      console.log('admin join to room: ', newRoom);
    });

    //when admin online, ready for chat, socket of admin will join 'adminRoom' for receive notice from Bot
    socket.on('adminOnline', ({userID, userName}) => {
      socket.join('adminRoom');
      socket.join('testRoom');
      logger.info(`Admin ${userID} - ${userName} is online`);
    });

    //when user online, socket of user will join his room
    socket.on('userOnline', ({ userID, userName }) => {
      socket.userID = userID;
      const room = userName;
      logger.info(`User ${userID} - ${userName} is online`);
      const user = userJoin(userID, userName, room);
      socket.join(user.room);

      // Welcome current user
      socket.emit('messageFromBot', formatMessage(botName, 'Welcome to Shop!'));

      //bot say hello to user when join
      // socket.to(user.room).emit('message', formatMessage(botName, `${user.userName} has joined the chat`));

      // // Send users and room info
      // io.to(user.room).emit('roomUsers', {
      //   room: user.room,
      //   users: getRoomUsers(user.room)
      // });
    });

    // Listen for chatMessage
    // socket.on('chatMessage', msg => {
    //   const user = getCurrentUser(socket.userID);
    //   io.to('adminRoom').emit('newChat', formatMessage(botName, user.room));
    //   console.log('msg from userID: ', socket.userID);
    //   console.log('chatMessageTxt: ', msg);
    //   console.log('user.room: ', user.room);
    //   io.to(user.room).emit('message', formatMessage(user.userName, msg));
    // });


    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.userID );
      logger.info(`Account ${user.userID} - ${user.userName} is disconnect`);
      // if (user) {
      //   io.to(user.room).emit(
      //     'message',
      //     formatMessage(botName, `${user.userName} has left the chat`)
      //   );
      //
      //   // Send users and room info
      //   io.to(user.room).emit('roomUsers', {
      //     room: user.room,
      //     users: getRoomUsers(user.room)
      //   });
      // }
    });
  });
}

module.exports = socket;
