const users = [];

// Join user to chat
function userJoin(userID, userName, room) {
  const user = { userID, userName, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(userID) {
  return users.find(user => user.userID === userID);
}

// User leaves chat
function userLeave(userID) {
  const index = users.findIndex(user => user.userID === userID);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
