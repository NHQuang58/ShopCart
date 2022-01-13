const redis = require('redis');
const { configRedis } = require('../config/configRedis');
const logger = require('../config/logger');

const redisClient = redis.createClient({ host: configRedis.redisPort, port: configRedis.redisHost });

redisClient.connect().then(() =>{logger.info("Redis connect success!!!")} );
redisClient.on('ready', function () {
  logger.info('Redis is ready');
});
redisClient.on('connect', function () {
  logger.info('redis client connected');
});

redisClient.on('error', function (error) {
  logger.error('redis err: ', error);
});

module.exports = redisClient;
