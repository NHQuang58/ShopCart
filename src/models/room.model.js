const { DataTypes } = require('sequelize');
const now = require('moment');
const sequelizeDB = require('../config/configDB');
const logger = require('../config/logger');

const Room = sequelizeDB.define('Room', {
  roomID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  lastMsg: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  lastUserSend: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  room: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  idSeenList: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: [],
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

Room.prototype.addIdSeen = async (roomID, userID) => {
  await Room.update(
    { idSeenList: sequelizeDB.fn('array_append', sequelizeDB.col('idSeenList'), userID) },
    { where: { roomID } }
  );
};

Room.prototype.removeIdSeen = async (roomID, userID) => {
  await Room.update(
    { idSeenList: sequelizeDB.fn('array_remove', sequelizeDB.col('idSeenList'), userID) },
    { where: { roomID } }
  );
};

sequelizeDB
  .sync()
  .then(() => logger.info('Sync Room Table success!'))
  .catch(() => logger.error('Sync Room Table fail')); // create database table with name 'Room'

module.exports = Room;
