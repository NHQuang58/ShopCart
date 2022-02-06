const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'manageQuestions',
    'getQuestions',
    'manageProducts',
    'getProducts',
    'manageOrders',
    'getOrders',
    'uploadImage',
    'uploadVideo',
    'getRoom',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
